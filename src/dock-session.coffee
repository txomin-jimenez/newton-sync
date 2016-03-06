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
  @property newtonDevice
  ###
  newtonDevice: null
 
  ###*
  @class DockSession
  @constructor
  ###
  constructor: (options) ->
    
    if options
      _.extend this, _.pick options, [
        'socket'
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
    
    @socket.on 'end', =>
      @endSession()
   
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
      @_initSyncProcess()
    .catch (error) =>
      console.log "init session error"
      console.log error
      console.trace()
  
  ###*
    waits for device request and sends initiate docking as response
  @method initDockSession
  ###
  _initDockSession: ->
    @receiveCommand('kDRequestToDock')
    .then (protocolVersion) =>
      console.log "..."
      console.log protocolVersion
      # send session type
      sessionType = DockSession.sessionTypes.kSynchronizeSession
      @sendCommand('kDInitiateDocking',{sessionType: sessionType})
  
  ###*
    send desktop info a save received Newton Device info
  @method exchangeDevicesInfo
  ###
  _exchangeDevicesInfo: ->
    
    @receiveCommand('kDNewtonName')
    .then (newtonNameInfo) =>
      console.log newtonNameInfo?.name
      # kDNewtonName return a set of Newton device info not only a 'name'
      newtonNameInfo.socket = @socket
      @newtonDevice = new NewtonDevice newtonNameInfo
      # TO-DO. at this point we do something to load previous sync file and
      # things like that
      @sendCommand('kDDesktopInfo', @desktopInfo())
    .then =>
      @receiveCommand('kDNewtonInfo')
    .then (newtonInfo) =>
      # TO-DO: save encrypted keys and protocol version for later check
      console.log "newton info: "
      console.log newtonInfo
      @_newtonInfo = newtonInfo
  
  ###*
    Info used to communicate with newton device. we send this info in session
    negotiation. this describes us as an newton sync compatible app. 
  @method desktopInfo
  ###
  desktopInfo: ->
    # TO-DO: this info will be dynamic
    desktopInfo =
      protocolVersion: 10 # fixed at version 9 (the version used by the 1.0 ROMs) 
      desktopType: 0 # 0 for Macintosh and 1 for Windows.
      encryptedKey1: 1680076546 #1434875146 # TO-DO: implement security
      encryptedKey2: 4224566693 #1852706659
      sessionType: 1
      allowSelectiveSync: 0 # TO-DO. this will be adjusted when we can 
                            # retrieve previous sync file
    desktopInfo.desktopApps = [
        name: "Newton Connection"
        id: 2
        version: 1
    ]

    desktopInfo

  ###*
    configure which icons will appear in Dock app at Newton device
  @method setDockIcons
  ###
  _setDockIcons: ->
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
      newtonKey = _.pick(@_newtonInfo,['encryptedKey1','encryptedKey2'])
      sendKeys = @_encryptKey(newtonKey)
      @sendCommand('kDPassword', sendKeys)
    .then =>
      @receiveCommand('kDResult')

  ###*
    Encrypt newtonInfo keys with Newton variant DES algorithm
  @method encryptKeys
  ###
  _encryptKey: (newtonKey) ->

    keyData = new Buffer(8)
    keyData.writeUInt32BE newtonKey.encryptedKey1, 0
    keyData.writeUInt32BE newtonKey.encryptedKey2, 4
    
    # NewtonDesCrypto expects key pair as a single 64bit hex string
    # encryptedValue also is a 64bit hex string
    encryptedData = NewtonDesCrypto.encryptBlock(null, keyData.toString('hex'))
  
    encryptedKey=
      encryptedKey1: parseInt('0x'+encryptedData.slice(0,8))
      encryptedKey2: parseInt('0x'+encryptedData.slice(8,16))
    
    encryptedKey

  _negotiatePasswordOld: ->
    @receiveCommand('kDPassword')
    .then (receivedKeys) =>
      console.log "receivedKeys"
      console.log receivedKeys
      #sendKeys = _.pick(@_newtonInfo,['encryptedKey1','encryptedKey2'])
      #sendKeys =
        #encryptedKey1: 3241982281
        #encryptedKey2: 3988672035
      newtonKeys = _.pick(@_newtonInfo,['encryptedKey1','encryptedKey2'])
      #newtonKey = @_newtonInfo.binaryKey
      console.log "newtonKeys"
      console.log newtonKeys
      keyData = new Buffer(8)
      keyData.writeUInt32BE newtonKeys.encryptedKey1, 0
      keyData.writeUInt32BE newtonKeys.encryptedKey2, 4
      console.log "keyData"
      console.log keyData
      
      cipher = Crypto.createCipheriv("des-ecb", @defaultEncryptPass, '')
      cipher.setAutoPadding(false)
      encryptedData = Buffer.concat([
        cipher.update(keyData)
        cipher.final()
      ])
      
      console.log "encryptedData"
      console.log encryptedData
      console.log encryptedData.length
      
      sendKeys =
        encryptedKey1: encryptedData.readUInt32BE(0)
        encryptedKey2: encryptedData.readUInt32BE(4)
      
      console.log "sendKeys"
      console.log sendKeys
      @sendCommand('kDPassword', sendKeys)
    .then =>
      @receiveCommand('kDResult')
  

  _initSyncProcess: ->

    @listenForCommand 'kDHello', =>
      console.log "say hello"
      #setTimeout =>
        #@sendCommand('kDHello')
      #, 100

    # take control and send command to Newton 
    #@sendCommand("kDDesktopControl")
    #.then =>
      #@sendCommand("kDRequestToSync")
    
    #@receiveCommand('kDRequestToSync')
    #@receiveCommand('kDHello')
    #@sendCommand('kDGetAppNames')
    #.then =>
      #@receiveCommand('kDAppNames')
      #setTimeout =>
        #@sendCommand("kDRequestToSync")
        ##@sendCommand('kDHello')
      #, 1000
  
  ###*
  @method endSession
  ###
  endSession: ->

    # ...

    @dispose()

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
