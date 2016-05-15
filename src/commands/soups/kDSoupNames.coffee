###*
kDSoupNames

Desktop < Newton

ULong 'soup'
ULong length
NSOF  [names] // array of strings
NSOF  [signatures/    // array of corresponding soup signatures

This command is sent in response to a kDGetSoupNames command. It returns
the names and signatures of all the soups in the current store.
###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDSoupNames extends EventCommand
  
  @id: 'soup'
  
  id: kDSoupNames.id
  name: 'kDSoupNames'
  length: null

  constructor: ->
    super
  
  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    @data = NsOF.decode(dataBuffer.slice(4))
    
