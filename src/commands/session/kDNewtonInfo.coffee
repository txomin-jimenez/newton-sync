###*
kDNewtonInfo

Desktop < Newton

ULong   'ninf'
ULong   length=12
ULong   protocol version 
ULong   encrypted key 1 
ULong   encrypted key 2

This command is used to negotiate the real protocol version. See kDDesktopInfo 
for more info. The password key is used as part of password verification.
###
EventCommand      = require '../event-command'
Utils             = require '../../utils'

module.exports = class kDNewtonInfo extends EventCommand
  
  @id: 'ninf'
  
  id: kDNewtonInfo.id
  name: 'kDNewtonInfo'
  length: 12

  constructor: ->
    super

  dataToBinary: ->
    data = new Buffer(16)
    data.writeUInt32BE(@length,0)
    data.writeUInt32BE(@data.protocolVersion,4)
    data.writeUInt32BE(@data.encryptedKey1,8)
    data.writeUInt32BE(@data.encryptedKey2,12)
    data
  
  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0) # must be 12
    
    @data =
      protocolVersion: dataBuffer.readUInt32BE(4)
      encryptedKey1:dataBuffer.readUInt32BE(8)
      encryptedKey2: dataBuffer.readUInt32BE(12)
