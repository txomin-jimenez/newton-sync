###*
kDCallRootMethod

Desktop > Newton

ULong 'crmf'
ULong length
NSOF method name symbol 
NSOF method args array

This command asks the Newton to call the specified root method. The return 
value from the method is sent to the desktop with a kDCallResult command.
###
EventCommand        = require '../event-command'
NsOF              = require '../../nsof'
NSymbol           = require '../../nsof/nsymbol'

module.exports = class kDCallRootMethod extends EventCommand
  
  @id: 'crmf'
  
  id: kDCallRootMethod.id
  name: 'kDCallRootMethod'
  length: null

  constructor: ->
    super

  dataToBinary: ->
    functionSymbol = NsOF.encode(NSymbol.encode(@data.functionName))
    functionArgs = NsOF.encode(@data.functionArgs)
    
    # for some strange reason real length doesn't work
    #lengthBuff = new Buffer(4)
    #lengthBuff.writeUInt32BE(functionSymbol.length + functionArgs.length, 0)
    lengthBuff = new Buffer('ffffffff','hex')
    
    res = Buffer.concat [lengthBuff, functionSymbol, functionArgs]
    #console.log res.toString('hex')
    res
