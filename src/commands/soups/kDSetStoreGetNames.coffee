###*
kDSetStoreGetNames

Desktop > Newton

ULong 'ssgn'
ULong length
NSOF  store frame

This command is the same as kDSetCurrentStore except that it returns the names
of the soups on the stores as if you'd send a kDGetSoupNames command. It sets 
the current store on the Newton. A store frame is sent to uniquely identify the 
store to be set:
  
{ name: "Gilligan’s Island",
  kind: "Flash storage card",
  signature: 734830,
  info: {store-info-frame} // this one is optional
 }

A kDSoupNames is sent by the Newton in response.

###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDSetStoreGetNames extends EventCommand
  
  @id: 'ssgn'
  
  id: kDSetStoreGetNames.id
  name: 'kDSetStoreGetNames'
  length: null

  constructor: ->
    super
  
  dataToBinary: ->
    
    frameData = NsOF.encode(@data)
    
    lengthBuff = new Buffer(4)
    lengthBuff.writeUInt32BE(frameData.length,0)
    
    Buffer.concat [lengthBuff,frameData]
    
