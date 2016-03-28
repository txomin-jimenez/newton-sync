###*
kDSoupIDs

Desktop < Newton

ULong 'sids'

This command is sent in response to a kDGetSoupIDs command. It returns all 
the IDs from the current soup.
###
EventCommand      = require '../event-command'
_                 = require 'lodash'

module.exports = class kDSoupIDs extends EventCommand
  
  @id: 'sids'
  
  id: kDSoupIDs.id
  name: 'kDSoupIDs'
  length: null

  constructor: ->
    super
  
  dataFromBinary: (dataBuffer) ->
    @length = dataBuffer.readUInt32BE(0)
    count_ = dataBuffer.readUInt32BE(4)
    if count_ > 0
      data_ = new Array(count_)
      _.forEach data_, (value, key) ->
        value_ = dataBuffer.readUInt32BE(8 + (key * 4))
        data_[key] = value_
    else
      data_ = null
    @data =
      count: count_
      ids: data_
