###*
kDGetStoreNames

Desktop > Newton
ULong 'gsto'
ULong length = 0

Request store information to Newton device
###
EventCommand      = require '../event-command'
Utils             = require '../../utils'

module.exports = class kDGetStoreNames extends EventCommand
  
  @id: 'gsto'
  
  id: kDGetStoreNames.id
  name: 'kDGetStoreNames'
  length: null

  constructor: ->
    super

