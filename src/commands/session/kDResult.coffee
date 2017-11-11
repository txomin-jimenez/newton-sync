###*
kDResult

Desktop <> Newton

ULong 'rtdk'
ULong length = 4
SLong error code

This command is sent by either Newton or PC in response to any of the commands
that don't request data. It lets the requester know that things are still
proceeding OK.
###
EventCommand      = require '../event-command'

module.exports = class kDResult extends EventCommand
  
  @id: 'dres'
  
  id: kDResult.id
  name: 'kDResult'
  length: 4

  constructor: ->
    super

  dataToBinary: ->
    data = new Buffer(8)
    data.writeUInt32BE(@length,0)
    # TO-DO: check if data is typeof number?
    data.writeInt32BE(@data,4)
    data
  
  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    # this time is a signed long
    @data = {errorCode: dataBuffer.readInt32BE(4)}
    
