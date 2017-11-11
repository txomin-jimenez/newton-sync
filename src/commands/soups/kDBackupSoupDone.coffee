###*
kDBackupSoupDone

Desktop < Newton

ULong 'bsdn'
ULong length = 0

This command terminates the sequence of commands sent in response to a
kDBackupSoup command.
###
EventCommand        = require '../event-command'

module.exports = class kDBackupSoupDone extends EventCommand
  
  @id: 'bsdn'
  
  id: kDBackupSoupDone.id
  name: 'kDBackupSoupDone'
  length: 0

  constructor: ->
    super

  
