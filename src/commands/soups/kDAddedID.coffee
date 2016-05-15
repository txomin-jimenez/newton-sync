###*
kDAddedID

Desktop < Newton

ULong 'adid'
ULong length
ULong ID

This command is sent in response to a kDAddEntry command from the PC. It
returns the ID that the entry was given when it was added to the current soup.

###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDAddedID extends EventCommand
  
  @id: 'adid'
  
  id: kDAddedID.id
  name: 'kDAddedID'
  length: null

  constructor: ->
    super
  
  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    @data = dataBuffer.readUInt32BE(4)
    
