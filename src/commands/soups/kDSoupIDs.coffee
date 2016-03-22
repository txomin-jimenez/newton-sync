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
    console.log dataBuffer.toString('hex')
    @length = dataBuffer.readUInt32BE(0)
    count_ = dataBuffer.readUInt32BE(4)
    if count_ > 0
      data_ = NsOF.decode(dataBuffer.slice(8))
    else
      data_ = null
    @data =
      count: count_
      ids: data_
