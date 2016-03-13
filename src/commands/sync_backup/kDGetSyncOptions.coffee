###*
kDGetSyncOptions

Desktop > Newton
ULong 'gsyn'
ULong length = 0

This command is sent when the desktop wants to get the selective sync or 
selective restore info from the Newton.
###
EventCommand        = require '../event-command'

module.exports = class kDGetSyncOptions extends EventCommand
  
  @id: 'gsyn'
  
  id: kDGetSyncOptions.id
  name: 'kDGetSyncOptions'
  length: 0

  constructor: ->
    super

  
