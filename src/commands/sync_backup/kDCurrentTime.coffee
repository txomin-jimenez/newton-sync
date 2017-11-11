###*
kDCurrentTime

Desktop < Newton

ULong 'time'
###
moment            = require 'moment'

EventCommand      = require '../event-command'
Utils             = require '../../utils'

module.exports = class kDCurrentTime extends EventCommand
  
  @id: 'time'
  
  id: kDCurrentTime.id
  name: 'kDCurrentTime'
  length: null

  constructor: ->
    super
  
  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    minutesSince1904 = dataBuffer.readUInt32BE(4)
    @data = Utils.newtonTime.toJSON(minutesSince1904)
