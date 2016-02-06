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
    testData = NsOF.fromValue(@data)
    
    lengthBuff = new Buffer(4)
    #console.log "data length: #{data.length}"
    lengthBuff.writeUInt32BE(data.length,0)
    
    # TO-DO: don't know why but whe must terminate de buffer with 0 0
    # or Newton wont recognize it. Probably a byte padding? or terminator
    Buffer.concat [lengthBuff,data,testData,new Buffer([0x00,0x00])]
  
  dataFromBinary: (dataBuffer) ->
    throw new Error "not implented yet!"
