###*
kDSyncOptions

Desktop < Newton

ULong   'sopt'
ULong   length
NSOF    info frame

This command is sent whenever the user on the Newton has selected selective
sync. The frame sent completely specifies which information is to be
synchronized.

  { packages: TRUEREF,
    syncAll: TRUEREF,
    stores: [{store-info}, {store-info}] }
    
Each store frame in the stores array contains the same information returned by
the kDStoreNames command with the addition of soup information. It looks like
this:

  { name: "Treasure Island",
    signature: 159604293,
    totalsize: 15982592,
    usedsize: 3346692,
    kind: "Flash storage card",
    soups: [“Names”,”Notes”,...],
    signatures: [411528, 843359,...],
    info: {store-info-frame}
  }
    
If the user has specified to sync all information the frame will look the same
except there won't be a soups slot--all soups are assumed.

Note that the user can specify which stores to sync while specifying that all
soups should be synced.

If the user specifies that packages should be synced the packages flag will be
true and the packages soup will be specified in the store frame(s).
###
EventCommand      = require '../event-command'
Utils             = require '../../utils'

module.exports = class kDSyncOptions extends EventCommand
  
  @id: 'sopt'
  
  id: kDSyncOptions.id
  name: 'kDSyncOptions'
  length: null

  constructor: ->
    super

  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    
    @data = @dataBuffer
