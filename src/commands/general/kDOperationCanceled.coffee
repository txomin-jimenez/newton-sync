###*
kDOperationCanceled

Desktop <> Newton

uLong 'opca'
ULong length = 0

This command is sent when the user cancels an operation. The receiver should 
return to the "ready" state and acknowledge the cancellation with a 
kDOpCanceledAck command..
###
EventCommand      = require '../event-command'

module.exports = class kDOperationCanceled extends EventCommand
  
  @id: 'opca'
  
  id: kDOperationCanceled.id
  name: 'kDOperationCanceled'
  length: 0

  constructor: ->
    super

