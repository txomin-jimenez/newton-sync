###*
kDGetAppNames

Desktop > Newton
ULong 'gapp'
ULong length = 4
ULong what to return

This command asks the Newton to send information about the applications
installed on the Newton. See the kDAppNames description below for details of
the information returned. The what to return parameter determines what
information is returned; see the Info to return with kDAppNames enum
in DockProtocol.h.
  0: return names and soups for all stores
  1: return names and soups for current store
  2: return just names for all stores
  3: return just names for current store
###
EventCommand      = require '../event-command'

module.exports = class kDGetAppNames extends EventCommand
  
  @id: 'gapp'
  
  id: kDGetAppNames.id
  name: 'kDGetAppNames'
  length: 4

  constructor: ->
    super

  dataToBinary: ->
    data = new Buffer(8)
    data.writeUInt32BE(@length,0)
    # TO-DO: check if data is typeof number?
    data.writeUInt32BE(@data,4)
    data
  
