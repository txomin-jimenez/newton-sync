###*
kDRequestToDock

Desktop < Newton

ULong   'rtdk'
ULong   length
struct  NewtonInfo
UniChar name[]

The Newton's name can be used to locate the proper synchronize file. The
version info includes things like machine type (e.g. J1), ROM version, etc;
###
EventCommand      = require '../event-command'
Utils             = require '../../utils'

module.exports = class kDNewtonName extends EventCommand
  
  @id: 'name'
  
  id: kDNewtonName.id
  name: 'kDNewtonName'
  #length:

  constructor: ->
    super

  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    console.log "newton name length: #{@length}"
    # TO-DO: real test didn't match documentation. check first values to fuuu
    @data =
      fNewtonID: dataBuffer.readUInt32BE(4)
      fManufacturer: dataBuffer.readUInt32BE(8)
      fMachineType: dataBuffer.readUInt32BE(12)
      fROMVersion: dataBuffer.readUInt32BE(16)
      fROMStage: dataBuffer.readUInt32BE(20)
      fuuu: dataBuffer.readUInt32BE(24)
      fRAMSize: dataBuffer.readUInt32BE(28)
      fScreenHeight: dataBuffer.readUInt32BE(32)
      fScreenWidth: dataBuffer.readUInt32BE(36)
      fPatchVersion: dataBuffer.readUInt32BE(40)
      fNOSVersion: dataBuffer.readUInt32BE(44)
      fInternalStorageSig: dataBuffer.readUInt32BE(48)
      fScreenResolutionV: dataBuffer.readUInt32BE(52)
      fScreenResolutionH: dataBuffer.readUInt32BE(56)
      fScreenDepth: dataBuffer.readUInt32BE(60)
      fSystemFlags: dataBuffer.readUInt32BE(64)
      fSerialNumber: [dataBuffer.readUInt32BE(68),dataBuffer.readUInt32BE(72)]
      fTargetProtocol: dataBuffer.readUInt32BE(76)
      name: Utils.unichar.toString(dataBuffer.slice(80))

