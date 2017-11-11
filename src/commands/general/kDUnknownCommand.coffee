###*
kDUnknownCommand

Desktop <> Newton

uLong 'unkn'
ULong length = 4
ULong bad command

This command is sent when a message is received that is unknown. When the
desktop receives this command it can either install a protocol extension and
try again or return an error to the Newton. If the built-in Newton code
receives this command it always signals an error. The bad command parameter
is the 4 char command that wasn't recognized. The data is not returned.
###
EventCommand      = require '../event-command'

module.exports = class kDUnknownCommand extends EventCommand
  
  @id: 'unkn'
  
  id: kDUnknownCommand.id
  name: 'kDUnknownCommand'
  length: 4

  constructor: ->
    super

  dataToBinary: ->
    data = new Buffer(8)
    data.writeUInt32BE(@length,0)
    data.writeString(@data,4,4,'ascii')
    data
  
  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    @data = {unknownCommand: dataBuffer.toString('ascii', 4)}
    
