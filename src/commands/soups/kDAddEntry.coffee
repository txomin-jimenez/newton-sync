###*
kDAddEntry

Desktop > Newton

ULong 'adde'
ULong length
NSOF  entry frame

This command is sent when the PC wants to add an entry to the current soup.

###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDAddEntry extends EventCommand
  
  @id: 'adde'
  
  id: kDAddEntry.id
  name: 'kDAddEntry'
  length: null

  constructor: ->
    super
  
  dataToBinary: ->
    
    frameData = NsOF.encode(@data)
    
    lengthBuff = new Buffer(4)
    lengthBuff.writeUInt32BE(frameData.length,0)
    
    Buffer.concat [lengthBuff,frameData]
    
