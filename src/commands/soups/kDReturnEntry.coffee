###*
kDReturnEntry

Desktop > Newton

ULong 'rete'
ULong length = 4
ULong id // ID of the entry to return

This command is sent when the PC wants to retrieve a changed entry from the 
current soup.
###
EventCommand      = require '../event-command'

module.exports = class kDReturnEntry extends EventCommand
  
  @id: 'rete'
  
  id: kDReturnEntry.id
  name: 'kDReturnEntry'
  length: 4

  constructor: ->
    super

  dataToBinary: ->
    data = new Buffer(8)
    data.writeUInt32BE(@length,0)
    # id number
    data.writeUInt32BE(@data,4)
    data
  
    
