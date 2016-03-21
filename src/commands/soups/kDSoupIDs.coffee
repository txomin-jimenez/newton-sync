###*
kDSoupIDs

Desktop < Newton

ULong 'sids'

This command is sent in response to a kDGetSoupIDs command. It returns all 
the IDs from the current soup.
###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDSoupIDs extends EventCommand
  
  @id: 'sids'
  
  id: kDSoupIDs.id
  name: 'kDSoupIDs'
  length: null

  constructor: ->
    super
  
  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    @data =
      count: dataBuffer.readUInt32BE(4)
      ids: NsOF.decode(dataBuffer.slice(8))
    
