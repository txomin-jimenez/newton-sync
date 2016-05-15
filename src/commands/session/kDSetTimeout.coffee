###*
kDSetTimeout

Desktop > Newton

ULong 'wicn'
ULong length = 4
ULong timeout in seconds

This command sets the timeout for the connection (the time the Newton will wait
to receive data before it disconnects). This time is typically set to 30 seconds
###
EventCommand        = require '../event-command'

module.exports = class kDSetTimeout extends EventCommand
  
  @id: 'stim'
  
  id: kDSetTimeout.id
  name: 'kDSetTimeout'
  length: 4

  constructor: ->
    super

  dataToBinary: ->
    data = new Buffer(8)
    data.writeUInt32BE(@length,0)
    # TO-DO: check if data is typeof number?
    data.writeUInt32BE(@data,4)
    data
  
