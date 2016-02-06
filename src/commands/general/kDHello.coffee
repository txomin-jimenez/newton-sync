###*
kDHello

Desktop <> Newton

ULong 'helo'
ULong length

This command is sent during long operations to let the Newton or desktop know 
that the connection hasn't been dropped.
###
EventCommand        = require '../event-command'

module.exports = class kDHello extends EventCommand
  
  @id: 'helo'
  
  id: kDHello.id
  name: 'kDHello'
  length: null

  constructor: ->
    super

  dataToBinary: ->
    new Buffer(0)

  dataFromBinary: (dataBuffer) ->
    null
