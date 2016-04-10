###*
kDCallGlobalFunction

Desktop > Newton

ULong 'cgfn'
ULong length
NSOF function name symbol 
NSOF function args array

This command asks the Newton to call the specified function and return its 
result. This function must be a global function. The return value from the 
function is sent to the desktop with a kDCallResult command.
###
EventCommand        = require '../event-command'
NsOF              = require '../../nsof'
NSymbol           = require '../../nsof/nsymbol'

module.exports = class kDCallGlobalFunction extends EventCommand
  
  @id: 'cgfn'
  
  id: kDCallGlobalFunction.id
  name: 'kDCallGlobalFunction'
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
