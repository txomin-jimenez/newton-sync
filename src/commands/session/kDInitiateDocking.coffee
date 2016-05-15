###*
kDInitiateDocking

Desktop < Newton

ULong 'dock'
ULong length = 4
ULong session type

The session type can be one of {none, settingUp, synchronize, restore,
loadPackage, testComm, loadPatch, updatingStores}; see the Session type enum
in DockSession. The Newton responds with information about itself.
###
EventCommand        = require '../event-command'

module.exports = class kDInitiateDocking extends EventCommand
  
  @id: 'dock'
  
  id: kDInitiateDocking.id
  name: 'kDInitiateDocking'
  length: 4

  constructor: ->
    super

  dataToBinary: ->
    data = new Buffer(8)
    data.writeUInt32BE(@length,0)
    # TO-DO: check if data is typeof number?
    data.writeUInt32BE(@data.sessionType,4)
    data
  
