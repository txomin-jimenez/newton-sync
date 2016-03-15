###*
kDCurrentTime

Desktop < Newton

ULong 'time'
###
moment            = require 'moment'

EventCommand      = require '../event-command'

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
    # TO-DO: will have to make a util function for dates
    @data = moment('1904-01-01T00:00:00.000Z').add(minutesSince1904,'minutes').toJSON()
    
