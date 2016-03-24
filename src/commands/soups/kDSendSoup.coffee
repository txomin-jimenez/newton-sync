###*
kDSendSoup

Desktop > Newton

ULong 'snds'
ULong length = 0

This command requests that all of the entries in a soup be returned to the 
desktop. The Newton responds with a series of kDEntry commands for all the 
entries in the current soup followed by a kDBackupSoupDone command. All of the
entries are sent without any request from the desktop (in other words, a series
of commands is sent). The process can be interrupted by the desktop by sending 
a kDOperationCanceled command. The cancel will be detected between entries. The
kDEntry commands are sent exactly as if they had been requested by a 
kDReturnEntry command (they are long padded).
###
EventCommand      = require '../event-command'

module.exports = class kDSendSoup extends EventCommand
  
  @id: 'snds'
  
  id: kDSendSoup.id
  name: 'kDSendSoup'
  length: 0

  constructor: ->
    super
  
