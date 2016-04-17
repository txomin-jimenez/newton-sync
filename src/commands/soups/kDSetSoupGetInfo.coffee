###*
kDSetSoupGetInfo

Desktop > Newton

ULong 'ssgi
ULong length
soup name   // C string

This command is like a combination of kDSetCurrentSoup and kDGetChangedInfo. It
sets the current soup--see kDSetCurrentSoup for details. A kDSoupInfo or kDRes
command is sent by the newton in response.
###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'
Utils             = require '../../utils'

module.exports = class kDSetSoupGetInfo extends EventCommand
  
  @id: 'ssgi'
  
  id: kDSetSoupGetInfo.id
  name: 'kDSetSoupGetInfo'
  length: null

  constructor: ->
    super
  
  dataToBinary: ->
    
    #frameData = new Buffer(@data + '\0' ,'ascii')
    frameData = Utils.unichar.toUniCharBuffer(@data)
    
    lengthBuff = new Buffer(4)
    lengthBuff.writeUInt32BE(frameData.length,0)
    
    Buffer.concat [lengthBuff,frameData]
    
