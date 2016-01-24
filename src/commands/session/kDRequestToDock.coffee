EventCommand        = require '../event-command'

###*
kDRequestToDock

Desktop < Newton

ULong 'rtdk'
ULong length = 4
ULong protocol version

The Newton initiates a session by sending this command to the desktop, which is
listening on the network, serial, etc. The protocol version is the version of 
the messaging protocol that's being used by the Newton ROM. The desktop sends 
a kDInitiateDocking command in response.
###
EventCommand      = require '../event-command'

module.exports = class kDRequestToDock extends EventCommand
  
  @id: 'rtdk'
  
  # Protocol version for Dante Dock application
  @kBaseProtocolVersion: 9
  @kDanteProtocolVersion: 10
  
  id: kDRequestToDock.id
  name: 'kDRequestToDock'
  length: 4

  constructor: ->
    super

  dataToBinary: ->
    data = new Buffer(8)
    data.writeUInt32BE(@length,0)
    # TO-DO: check if data is typeof number?
    data.writeUInt32BE(@data,4)
    data
  
  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    @data = {protocolVersion: dataBuffer.readUInt32BE(4)}
    
