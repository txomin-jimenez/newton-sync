###*
  Handle all Newton Device information related command and process.
@class NewtonDevice
###
_                 = require 'lodash'
CommandBroker     = require './commands/command-broker'
StateMachine      = require './commands/state-machine'
Utils             = require './utils'

module.exports = class NewtonDevice
  
  ###*
  @property name
  ###
  name: null

  # NewtonInfo attributes

  # Newton Information block, as returned by kDNewtonName.
  # A unique id to identify a particular newton 
  fNewtonID: null

  # A decimal integer indicating the manufacturer of the device
  fManufacturer: null

  # A decimal integer indicating the hardware type of the device
  fMachineType: null

  # A decimal number indicating the major and minor ROM version numbers
  # The major number is in front of the decimal, the minor number after
  fROMVersion: null

  # A decimal integer indicating the language (English, German, French)
  # and the stage of the ROM (alpha, beta, final) 
  fROMStage: null

  fRAMSize: null

  # An integer representing the height of the screen in pixels	
  fScreenHeight: null

  # An integer representing the width of the screen in pixels
  fScreenWidth: null

  # 0 on an unpatched Newton and nonzero on a patched Newton
  fPatchVersion: null

  fNOSVersion: null

  # signature of the internal store
  fInternalStoreSig: null

  # An integer representing the number of vertical pixels per inch
  fScreenResolutionV: null

  # An integer representing the number of horizontal pixels per inch
  fScreenResolutionH: null

  # The bit depth of the LCD screen
  fScreenDepth: null

  # various bit flags 
  # 1 = has serial number
  # 2 = has target protocol
  fSystemFlags: null
  fSerialNumber: null
  fTargetProtocol:null

  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
 
  ###*
  @class NewtonDevice
  @constructor
  ###
  constructor: (options) ->

    if options
      _.extend this, _.pick options, [
        'fNewtonID'
        'fManufacturer'
        'fMachineType'
        'fROMVersion'
        'fROMStage'
        'fRAMSize'
        'fScreenWidth'
        'fScreenWidth'
        'fPatchVersion'
        'fNOSVersion'
        'fInternalStoreSig'
        'fScreenResolutionV'
        'fScreenResolutionH'
        'fScreenDepth'
        'fSystemFlags'
        'fSerialNumber'
        'fTargetProtocol'
        'name'
      ]
