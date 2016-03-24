###*
kDEntry

Desktop < Newton

ULong 'ntry'
ULong length
NSOF  soup entry


###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDEntry extends EventCommand
  
  @id: 'entr'
  
  id: kDEntry.id
  name: 'kDEntry'
  length: null

  constructor: ->
    super
  
  dataFromBinary: (dataBuffer) ->
    #console.log dataBuffer.toString('hex')
    @length = dataBuffer.readUInt32BE(0)
    @data = NsOF.decode(dataBuffer.slice(4))
    
