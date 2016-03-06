###*
kDDisconnect

Desktop <> Newton

ULong 'disc'
ULong length=0

This command is sent by either desktop or Newton when the docking operation 
is complete.
###
EventCommand        = require '../event-command'

module.exports = class kDDisconnect extends EventCommand
  
  @id: 'disc'
  
  id: kDDisconnect.id
  name: 'kDDisconnect'
  length: 0

  constructor: ->
    super

  dataFromBinary: (dataBuffer) ->
    null
