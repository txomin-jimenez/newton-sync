###*
kDRequestToSync

Desktop > Newton
ULong 'ssyn'
ULong length = 0

This command is sent when the desktop wants to start a sync operation, when
both the Newton and the desktop were waiting for the user to specify an
operation
###
EventCommand        = require '../event-command'

module.exports = class kDRequestToSync extends EventCommand
  
  @id: 'ssyn'
  
  id: kDRequestToSync.id
  name: 'kDRequestToSync'
  length: 0

  constructor: ->
    super

  
