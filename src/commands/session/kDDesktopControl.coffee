###*
kDDesktopControl

Desktop > Newton
ULong 'dsnc'
ULong length = 0

To indicate that the desktop is in control, each of the following commands
should be preceded by a kDDesktopControl command, to which the Newton does
not reply. Control is relinquished when the desktop sends a kDOperationDone
command.
###
EventCommand        = require '../event-command'

module.exports = class kDDesktopControl extends EventCommand
  
  @id: 'dsnc'
  
  id: kDDesktopControl.id
  name: 'kDDesktopControl'
  length: 0

  constructor: ->
    super

  
