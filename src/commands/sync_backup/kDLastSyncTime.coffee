###*
kDLastSyncTime

Desktop > Newton
ULong 'stme'
ULong length = 0

this one’s fake (0) just to get the newton time
###
EventCommand      = require '../event-command'
Utils             = require '../../utils'

module.exports = class kDLastSyncTime extends EventCommand
  
  @id: 'stme'
  
  id: kDLastSyncTime.id
  name: 'kDLastSyncTime'
  length: 4

  constructor: ->
    super

  dataToBinary: ->
    data = new Buffer(8)
    data.writeUInt32BE(@length,0)
    # TO-DO: check if data is typeof number?
    data.writeUInt32BE(0,4)
    data
