###*
kDRefTest

Desktop <> Newton

ULong 'rtst'
ULong length
NSOF object


This command is first sent from the desktop to the Newton. The Newton 
immediately echos the object back to the desktop. The object can be any 
NewtonScript object (anything that can be sent through object read/write).
This command can also be sent with no ref attached. If the length is 0 the 
command is echoed back to the desktop with no ref included.
###
EventCommand        = require '../event-command'

module.exports = class kDRefTest extends EventCommand
  
  @id: 'rtst'
  
  id: kDRefTest.id
  name: 'kDRefTest'
  length: null

  constructor: ->
    super

  dataToBinary: ->
    testData = NsOF.encode(@data)
    
    lengthBuff = new Buffer(4)
    lengthBuff.writeUInt32BE(data.length,0)
    
    Buffer.concat [lengthBuff,testData]
  
  dataFromBinary: (dataBuffer) ->
    #console.log dataBuffer.toString('hex')
    @length = dataBuffer.readUInt32BE(0)
    try
      @data = NsOF.decode(dataBuffer.slice(4))
    catch err
      console.log "error decoding reftest"
      console.log dataBuffer.slice(4).toString('hex')
      throw err
