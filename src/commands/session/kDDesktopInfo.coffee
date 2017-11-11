###*
kDDesktopInfo

Desktop > Newton

ULong   'dinf'
ULong   length
ULong   protocol version
ULong   desktop type i
ULong   encrypted key 1
ULong   encrypted key 2
ULong   session type
ULong   allow selective sync
NSOF    desktop apps

This command is used to negotiate the real protocol version. The protocol
version sent with the kDRequestToDock command is now fixed at version 9 (the
version used by the 1.0 ROMs) so we can support package loading with NPI 1.0,
Connection 2.0 and NTK 1.0. Connection 3.0 will send this command with the real
protocol version it wants to use to talk to the Newton. The Newton will respond
with a number equal to or lower than the number sent to it by the desktop. The
desktop can then decide whether it can talk the specified protocol or not.

The desktop type identifies the sender – 0 for Macintosh and 1 for Windows.

The password key is used as part of password verification.

Session type will be the real session type and should override what was sent in
kDInitiateDocking. In fact, it will either be the same as was sent in
kDInitiateDocking or kSettingUpSession to indicate that although the desktop has
accepted a connection, the user has not yet specified an operation.

AllowSelectiveSync is a boolean. The desktop should say no when the user hasn't
yet done a full sync and, therefore, can't do a selective sync.
  
DesktopApps is an array of frames that describes who the Newton is talking with.
Each frame in the array looks like this:
    { name: "Newton Backup Utility", id: 1, version: 1 }
    
There might be more than one item in the array if the Newton is connecting with
a DIL app. The built- in Connection app expects 1 item in the array that has id:
      1: NBU
      2: NCU

It won't allow connection with any other id.
###
EventCommand      = require '../event-command'
Utils             = require '../../utils'
NsOF              = require '../../nsof'

module.exports = class kDDesktopInfo extends EventCommand
  
  @id: 'dinf'
  
  id: kDDesktopInfo.id
  name: 'kDDesktopInfo'
  #length:

  constructor: ->
    super

  dataToBinary: ->
    data = new Buffer(24)
    
    data.writeUInt32BE(@data.protocolVersion,0)
    data.writeUInt32BE(@data.desktopType,4)
    
    # encription keys. TO-DO: do something with them
    data.writeUInt32BE(@data.encryptedKey1 ,8)
    data.writeUInt32BE(@data.encryptedKey2,12)
    
    data.writeUInt32BE(@data.sessionType,16)
    data.writeUInt32BE(@data.allowSelectiveSync,20)
    
    desktopAppsData = NsOF.encode(@data.desktopApps)
    
    lengthBuff = new Buffer(4)
    #console.log "data length: #{data.length}"
    lengthBuff.writeUInt32BE(data.length+desktopAppsData.length,0)
    
    Buffer.concat [lengthBuff,data,desktopAppsData]

  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    
    @data =
      protocolVersion: dataBuffer.readUInt32BE(4)
      desktopType: dataBuffer.readUInt32BE(8)
      encryptedKey1:dataBuffer.readUInt32BE(12)
      encryptedKey2: dataBuffer.readUInt32BE(16)
      sessionType:dataBuffer.readUInt32BE(20)
      allowSelectiveSync: dataBuffer.readUInt32BE(24)
      desktopApps: dataBuffer.slice(28)
