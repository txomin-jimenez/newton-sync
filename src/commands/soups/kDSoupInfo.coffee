###*
kDSoupInfo

Desktop < Newton

ULong 'sinf'
ULong length
NSOF  soup info frame 

This command is used to send a soup info frame. When received the info for the
current soup is set to the specified frame.

###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDSoupInfo extends EventCommand
  
  @id: 'sinf'
  
  id: kDSoupInfo.id
  name: 'kDSoupInfo'
  length: null

  constructor: ->
    super
  
  dataFromBinary: (dataBuffer) ->
    #console.log dataBuffer.toString('hex')
    @length = dataBuffer.readUInt32BE(0)
    @data = NsOF.decode(dataBuffer.slice(4))
