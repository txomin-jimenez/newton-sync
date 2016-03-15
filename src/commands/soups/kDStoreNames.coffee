###*
kDStoreNames

Desktop < Newton

ULong 'stor'

This command is sent in response to a kDGetStoreNames command. It returns 
information about all the stores on the Newton. Each array slot contains the 
following information about a store:

{Name: "",
  signature: 1234,
  totalsize: 1234,
  usedsize: 1234,
  kind: "",
  info: {store info frame},
  readOnly: true,
  defaultStore: true,     // only for the defaultstore
  storePassword: password  // only if a store password has been set
}
###
EventCommand      = require '../event-command'

module.exports = class kDStoreNames extends EventCommand
  
  @id: 'stor'
  
  id: kDStoreNames.id
  name: 'kDStoreNames'
  length: null

  constructor: ->
    super
  
  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    @data = dataBuffer
    
