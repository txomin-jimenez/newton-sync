###*
kDOpCanceledAck

Desktop <> Newton

uLong 'ocaa'
ULong length = 0

This command is sent in response to a kDOperationCanceled.
###
EventCommand      = require '../event-command'

module.exports = class kDOpCanceledAck extends EventCommand
  
  @id: 'ocaa'
  
  id: kDOpCanceledAck.id
  name: 'kDOpCanceledAck'
  length: 0

  constructor: ->
    super

