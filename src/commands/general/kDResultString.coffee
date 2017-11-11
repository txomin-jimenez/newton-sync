###*
kDResultString

Desktop > Newton

ULong 'ress'
ULong length
SLong error code
NSOF  error string

Reports a desktop error to the Newton. The string is included since the Newton
doesn't know how to decode all the desktop errors

###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDResultString extends EventCommand
  
  @id: 'ress'
  
  id: kDResultString.id
  name: 'kDResultString'
  length: null

  constructor: ->
    super

  dataToBinary: ->
    
    errorData = NsOF.encode(@data.message)
    
    lengthBuff = new Buffer('ffffffff','hex')
    #headerData.writeUInt32BE(4 + errorData.length, 0)
    headerData = new Buffer(4)
    headerData.writeInt32BE(@data.code, 0)

    result = Buffer.concat [lengthBuff, headerData, errorData]
    console.log result.toString('hex')
    result
  
