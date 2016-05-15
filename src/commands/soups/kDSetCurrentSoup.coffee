###*
kDSetCurrentSoup

Desktop > Newton

ULong 'ssou'
ULong length
soup name   // C string

This command sets the current soup. Most of the other commands pertain to this
soup so this command must preceed any command that uses the current soup. If the
soup doesn't exist a kDSoupNotFound error is returned but the connection is left
alive so the desktop can create the soup if necessary. Soup names must be < 25
characters.
###
EventCommand      = require '../event-command'
Utils             = require '../../utils'

module.exports = class kDSetCurrentSoup extends EventCommand
  
  @id: 'ssou'
  
  id: kDSetCurrentSoup.id
  name: 'kDSetCurrentSoup'
  length: null

  constructor: ->
    super
  
  dataToBinary: ->
    
    #frameData = new Buffer(@data + '\0' ,'ascii')
    frameData = Utils.unichar.toUniCharBuffer(@data)
    
    lengthBuff = new Buffer(4)
    lengthBuff.writeUInt32BE(frameData.length,0)
    
    Buffer.concat [lengthBuff,frameData]
    
