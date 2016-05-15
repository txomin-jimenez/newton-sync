###*
kDSynchronize

Desktop < Newton
ULong 'sync'
ULong length = 0

This command is sent to the desktop when the user taps the Synchronize button on
the Newton. The user wishes to synchronize Newton data with desktop applications
###
EventCommand        = require '../event-command'

module.exports = class kDSynchronize extends EventCommand
  
  @id: 'sync'
  
  id: kDSynchronize.id
  name: 'kDSynchronize'
  length: 0

  constructor: ->
    super

  
