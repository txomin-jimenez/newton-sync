###*
kDOperationDone

Desktop <> Newton

uLong 'opdn'
ULong length = 0

This command is sent when an operation is completed. It't only sent in
situations where there might be some ambiguity. Currently, there are two
situations where this is sent. When the desktop finishes a restore it sends
this command. When a sync is finished and there are no sync results
(conflicts) to send to the newton the desktop sends this command.
###
EventCommand      = require '../event-command'

module.exports = class kDOperationDone extends EventCommand
  
  @id: 'opdn'
  
  id: kDOperationDone.id
  name: 'kDOperationDone'
  length: 0

  constructor: ->
    super

