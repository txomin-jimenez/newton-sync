###*
kDPWWrong

Desktop > Newton

ULong 'pwbd'
ULong length=0

If the password sent from the Newton is wrong, the desktop indicates this with a
kDPWWrong response. If too many attempts at entering a password have been made,
the desktop can instead respond with a kDResult command indicating a 
kDBadPassword error.
###
EventCommand        = require '../event-command'

module.exports = class kDPWWrong extends EventCommand
  
  @id: 'pwbd'
  
  id: kDPWWrong.id
  name: 'kDPWWrong'
  length: 0

  constructor: ->
    super

  dataFromBinary: (dataBuffer) ->
    null
