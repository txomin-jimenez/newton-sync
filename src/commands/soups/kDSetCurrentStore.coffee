###*
kDSetCurrentStore

Desktop > Newton

ULong 'ssto'
ULong length
NSOF  store frame

This command sets the current store on the Newton. A store frame is sent to
uniquely identify the store to be set:

{ name: "Gilligan’s Island",
  kind: "Flash storage card",
  signature: 734830,
  info: {store-info-frame} // this one is optional
 }

###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDSetCurrentStore extends EventCommand
  
  @id: 'ssto'
  
  id: kDSetCurrentStore.id
  name: 'kDSetCurrentStore'
  length: null

  constructor: ->
    super
  
  dataToBinary: ->
    
    frameData = NsOF.encode(@data)
    
    lengthBuff = new Buffer(4)
    lengthBuff.writeUInt32BE(frameData.length,0)
    
    Buffer.concat [lengthBuff,frameData]
    
