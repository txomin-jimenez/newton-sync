###*
kDPassword

Desktop <> Newton

ULong   'pass'
ULong   length=8
ULong   encrypted key 1 
ULong   encrypted key 2

When sent by the Newton, this command returns the key received in the 
kDDesktopInfomessage encrypted using the password.
When sent by the desktop, this command returns the key received in the 
kDNewtonInfomessage encrypted using the password.
###
EventCommand      = require '../event-command'
Utils             = require '../../utils'

module.exports = class kDPassword extends EventCommand
  
  @id: 'pass'
  
  id: kDPassword.id
  name: 'kDPassword'
  length: 8

  constructor: ->
    super
  
  dataToBinary: ->
    data = new Buffer(12)
    data.writeUInt32BE(@length,0)
    data.writeUInt32BE(@data.encryptedKey1,4)
    data.writeUInt32BE(@data.encryptedKey2,8)
    data

  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0) # must be 8

    @data =
      # save in number format
      encryptedKey1: dataBuffer.readUInt32BE(4)
      encryptedKey2: dataBuffer.readUInt32BE(8)
      
