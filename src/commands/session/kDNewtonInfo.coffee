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
  #length: 

  constructor: ->
    super

  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0) # must be 12
    
    @data =
      protocolVersion: dataBuffer.readUInt32BE(4)
      encryptedKey1:dataBuffer.readUInt32BE(8)
      encryptedKey2: dataBuffer.readUInt32BE(12)
