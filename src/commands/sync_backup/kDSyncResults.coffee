###*
kDSyncResults

Desktop > Newton

ULong 'sres'
ULong length
NSOF  sync results

This command can optionally be sent at the end of synchronization. If it is 
sent, the results are displayed on the Newton. The array looks like this:

  [["store name", restored, "soup name", count, "soup name" count],
     ["store name", restored, ...]]

restored is true if the desktop detected that the Newton had been restore to 
since the last sync.

count is the number of conflicting entries that were found for each soup. Soups
are only in the list if they had a conflict. When a conflict is detected, the 
Newton version is saved and the desktop version is moved to the archive file.
###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDSyncResults extends EventCommand
  
  @id: 'sres'
  
  id: kDSyncResults.id
  name: 'kDSyncResults'
  length: 0

  constructor: ->
    super

  dataToBinary: ->
    
    frameData = NsOF.encode(@data)
    
    lengthBuff = new Buffer(4)
    lengthBuff.writeUInt32BE(frameData.length,0)
    
    Buffer.concat [lengthBuff,frameData]
    
  
