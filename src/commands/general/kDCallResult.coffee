###*
kDCallResult

Desktop < Newton

ULong 'cres'
ULong length
NSOF  result ref

This command is sent in response to a kDCallGlobalFunction or kDCallRootMethod 
command. The ref is the return value from the function or method called.
###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDCallResult extends EventCommand
  
  @id: 'cres'
  
  id: kDCallResult.id
  name: 'kDCallResult'
  length: null

  constructor: ->
    super
  
  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    @data = NsOF.decode(dataBuffer.slice(4))
