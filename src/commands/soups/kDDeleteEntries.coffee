###*
kDDeleteEntries

Desktop > Newton

ULong 'dele'
ULong length
ULong count of ids int the array
ULong [ids]

This command is sent to delete one or more entries from the current soup.

###
_                 = require 'lodash'

EventCommand      = require '../event-command'
Utils             = require '../../utils'

module.exports = class kDDeleteEntries extends EventCommand
  
  @id: 'dele'
  
  id: kDDeleteEntries.id
  name: 'kDDeleteEntries'
  length: null

  constructor: ->
    super
  
  dataToBinary: ->
    
    # commandLength = countSize + (idCount * ulongSize)
    commandSize = 4 + (@data.length * 4)
    
    # buffLength = lengthSize + commandSize
    dataBuff = new Buffer(4 + commandSize)
    dataBuff.writeUInt32BE(commandSize,0)
    dataBuff.writeUInt32BE(@data.length,4)
    # compose serialized array
    _.forEach @data, (value, key) ->
      dataBuff.writeUInt32BE(value, 8 + (key * 4))
    
    dataBuff
