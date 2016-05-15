###*
kDWhichIcons

Desktop > Newton

ULong 'wicn'
ULong length = 4
ULong icon mask

This command is used to customize the set of icons shown on the Newton. The icon
mask indicates which icons should be shown; see the Icon mask enum in
DockSession. For example, to show all icons you would use this:
  
kBackupIcon + kSyncIcon + kInstallIcon + kRestoreIcon + kImportIcon +
kKeyboardIcon
###
EventCommand        = require '../event-command'

module.exports = class kDWhichIcons extends EventCommand
  
  @id: 'wicn'
  
  id: kDWhichIcons.id
  name: 'kDWhichIcons'
  length: 4

  constructor: ->
    super

  dataToBinary: ->
    data = new Buffer(8)
    data.writeUInt32BE(@length,0)
    # TO-DO: check if data is typeof number?
    data.writeUInt32BE(@data,4)
    data
  
