###*
  Negotiates session with Newton device. Handles connection parameters and
  password exchange with device. Once session initiated successfully it creates
  a NewtonDevice object. NewtonDevice is used to import/export data and so on.
@class DockSession
###

_                 = require 'lodash'
CommandBroker     = require './commands/command-broker'
StateMachine      = require './commands/state-machine'
Utils             = require './utils'
Enum              = Utils.Enum
ByteEnum          = Utils.ByteEnum
NewtonDesCrypto   = require 'newton-des-crypto'

NewtonDevice      = require './newton-device'

module.exports = class DockSession
  
  # dock session types
  @sessionTypes = Enum(
    'kNoSession'
    'kSettingUpSession'
    'kSynchronizeSession'
    'kRestoreSession'
    'kLoadPackageSession'
    'kTestCommSession'
    'kLoadPatchSession'
    'kUpdatingStoresSession'
  )
  # dock app icons mask
  @dockIcons = ByteEnum(
    'kBackupIcon'   #= 1,
    'kRestoreIcon'  # = 1 << 1,
    'kInstallIcon'  # = 1 << 2,
    'kImportIcon'   # = 1 << 3,
    'kSyncIcon'     # = 1 << 4,
    'kKeyboardIcon' # = 1 << 5
  )
  
  ###*
    unique ID that identifies session
  @property id
  ###
  id: null

  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
  
  ###*
    Default timeout in seconds if no comms activity
  @property kDefaultTimeout
  ###
  kDefaultTimeout: 30
  
  ###*
    Newton device instance.
  @property newtonDevice
  ###
  newtonDevice: null

  ###*
    Info used to communicate with newton device. we send this info in session
    negotiation. this describes us as an newton sync compatible app. 
  @property desktopInfo
  ###
  desktopInfo: null
  
  ###*
    password used for protection of dock connection. by default no password
    protection is used
  @property sessionPwd
  ###
  sessionPwd: null
 
  ###*
  @class DockSession
  @constructor
  ###
  constructor: (options) ->
    
    if options
      _.extend this, _.pick options, [
        'id'
        'socket'
        'kDefaultTimeout'
        'sessionPwd'
        'newtonDevice'
      ]
    
    # add machine-state and event emit capability
    _.extend @, StateMachine
    
    # send/receive Newton Dock Commands
    _.extend @, CommandBroker
    
    @_initialize(options)

  ###*
    all init method go here
  @method initialize
  ###
  _initialize: (options) ->
    
    # end session if client disconnects
    @socket.on 'end', =>
      @endSession()

    @initDockInfo()
   
    @initSession()
  
  ###*
    initiates session negotiation with Newton device
      Every session starts like this:
            Desktop                Newton
                            <  kDRequestToDock
        kDInitiateDocking   >
                            <  kDNewtonName 
        kDDesktopInfo       >
                            <  kDNewtonInfo
        kDWhichIcons        >                     optional 
                            <  kDResult
        kDSetTimeout        >                     optional 
                            <  kDPassword
  @method initSession
  ###
  initSession: ->
    
    @_initDockSession()
    .then =>
      @_exchangeDevicesInfo()
    .then =>
      @_setDockIcons()
    .then =>
      @sendCommand('kDSetTimeout', @kDefaultTimeout)
    .then =>
      @_negotiatePassword()
    .then =>
      # At this point session is initiated. User should see dock icons in dock
      # app at Newton Device and could start sync process.
      @newtonDevice.initSyncSession()
    .then =>
      # inform consumers everything is ready for device manipulation
      @emit "initialized", @newtonDevice

    .catch (error) =>
      @emit "error", error
      #console.trace()
      # if something went wrong abort session. Client will have to reconnect
      # if error persist it must be a bug or something
      setTimeout =>
        @endSession()
      , 1000
  
  ###*
    waits for device request and sends initiate docking as response
  @method initDockSession
  ###
  _initDockSession: ->
    @receiveCommand('kDRequestToDock')
    .then (protocolVersion) =>
      # send session type. Only sync will be supported
      sessionType = DockSession.sessionTypes.kSynchronizeSession
      @sendCommand('kDInitiateDocking',{sessionType: sessionType})
  
  ###*
    send desktop info a save received Newton Device info
  @method exchangeDevicesInfo
  ###
  _exchangeDevicesInfo: ->
    
    newtonNameInfo = null
    @receiveCommand('kDNewtonName')
    .then (newtonNameInfo_) =>
      newtonNameInfo = newtonNameInfo_
      # kDNewtonName return a set of Newton device info not only a 'name'
      # TO-DO. at this point we do something to load previous sync file and
      # things like that
      @sendCommand('kDDesktopInfo', @desktopInfo)
    .then =>
      @receiveCommand('kDNewtonInfo')
    .then (newtonInfo) =>
      newtonNameInfo.socket = @socket
      newtonNameInfo.protocolVersion = newtonInfo.protocolVersion
      newtonNameInfo.encryptedKey1 = newtonInfo.encryptedKey1
      newtonNameInfo.encryptedKey2 = newtonInfo.encryptedKey2
      @newtonDevice = new NewtonDevice newtonNameInfo
  
  ###*
    Init dock info for session negotiation
  @method initDockInfo 
  ###
  initDockInfo: ->
    # generate some keys for later password exchange
    key1 = Math.ceil(Math.random() * 2147483647)
    key2 = Math.ceil(Math.random() * 2147483647)

    @desktopInfo =
      protocolVersion: 10 # fixed at version 10 (Newton OS 2.0)
      desktopType: 0 # 0 for Macintosh and 1 for Windows.
      encryptedKey1: key1
      encryptedKey2: key2
      # kSynchronizeSession type didn't work so will use kSettingUpSession
      sessionType: DockSession.sessionTypes.kSettingUpSession
      #sessionType:  DockSession.sessionTypes.kSynchronizeSession
      allowSelectiveSync: 0 # TO-DO. this will be adjusted if needed
    
    @desktopInfo.desktopApps = [
        name: "Newton Connection"
        id: 2
        version: 1
    ]

  ###*
    configure which icons will appear in Dock app at Newton device
  @method setDockIcons
  ###
  _setDockIcons: ->
    # Show only sync dock icon. only sync will be supported for now
    whichIcons = DockSession.dockIcons.kSyncIcon

    @sendCommand('kDWhichIcons', whichIcons)
    .then =>
      @receiveCommand('kDResult')
  
  ###*
    process Dock <-> Newton password exchange and check 
  @method negotiatePassword
  ###
  _negotiatePassword: ->

    @receiveCommand('kDPassword')
    .then (receivedKey) =>
      # check if received key is encrypted correctly with session password
      receivedKey = @_decryptKey(receivedKey)
     
      if receivedKey.encryptedKey1 is @desktopInfo.encryptedKey1 and _
        receivedKey.encryptedKey2 is @desktopInfo.encryptedKey2
        # encrypt and send newton received keys as response
        # if OK newton will start sync process else will respond with error
        # in that case will abort session as something strange happened with
        # password and keys (must be a bug)
        newtonKey = @newtonDevice.getEncryptedKeys()
        sendKeys = @_encryptKey(newtonKey)
        @sendCommand('kDPassword', sendKeys)
      else
        @sendCommand('kDPWWrong')
        .then =>
          # try again. TO-DO: limit to 3 times
          @_negotiatePassword()

  ###*
    Encrypt newtonInfo keys with Newton variant DES algorithm
  @method encryptKeys
  ###
  _encryptKey: (newtonKey) ->

    keyData = new Buffer(8)
    keyData.writeUInt32BE newtonKey.encryptedKey1, 0
    keyData.writeUInt32BE newtonKey.encryptedKey2, 4
    
    # NewtonDesCrypto expects key pair as a single 64bit hex string
    # encryptedData also is a 64bit hex string
    encryptedData = NewtonDesCrypto.encryptBlock(@sessionPwd, keyData.toString('hex'))
  
    encryptedKey=
      encryptedKey1: parseInt('0x'+encryptedData.slice(0,8))
      encryptedKey2: parseInt('0x'+encryptedData.slice(8,16))
    
    encryptedKey
  
  ###*
    Decrypt received desktopInfo key pair
  @method encryptKeys
  ###
  _decryptKey: (desktopKey) ->

    keyData = new Buffer(8)
    keyData.writeUInt32BE desktopKey.encryptedKey1, 0
    keyData.writeUInt32BE desktopKey.encryptedKey2, 4
    
    # NewtonDesCrypto expects key pair as a single 64bit hex string
    # decryptedData also is a 64bit hex string
    decryptedData = NewtonDesCrypto.decryptBlock(@sessionPwd, keyData.toString('hex'))
  
    decryptedKey =
      encryptedKey1: parseInt('0x'+decryptedData.slice(0,8))
      encryptedKey2: parseInt('0x'+decryptedData.slice(8,16))
    
    decryptedKey
  
  
  ###*
    End session with device
  @method endSession
  ###
  endSession: ->

    # wait a bit, Newtons are getting old and they need their time
    setTimeout =>
      @socket.end()

      @emit "finished", this

      @dispose()
    , 1000

  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    @removeAllListeners()

    @newtonDevice?.dispose()
    
    @socket?.destroy()
    
    properties = [
      'socket',
      'newtonDevice',
    ]

    delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
