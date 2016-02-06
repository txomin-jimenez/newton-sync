_                 = require 'lodash'

Utils             = require './utils'

# (NSOF) Newton Streamed Object encoding / decoding
toSymbol = (key) =>
  symbolHeader = new Buffer(2)
  if key.length > 254
    throw new Error "not implemented yet"
  symbolHeader.writeUInt8(7,0) # kSymbol=7
  symbolHeader.writeUInt8(key.length,1)
  Buffer.concat [symbolHeader, new Buffer(key,'ascii')]

toImmediate = (numberVal) ->
  new Buffer([0x00, (numberVal << 2)])

toBoolean = (value) ->
  # the Ref for TRUE is 0x1A
  if value
    new Buffer([0x00,0x1a])
  else
    new Buffer([0x00,0x00])

toNIL = ->
  # the Ref for NIL is 0x2. kNIL=10. TO-DO: not sure about this, confused about
  # documentation
  new Buffer([0x00,2])


toString = (stringVal) ->
  unicharValue = Utils.unichar.toUniCharBuffer(stringVal)
  if unicharValue.length > 254
    throw new Error "not implemented yet"
  stringHeader = new Buffer(2)
  stringHeader.writeUInt8(8,0) # kString = 8
  stringHeader.writeUInt8(unicharValue.length,1)
  Buffer.concat [stringHeader, unicharValue]

cast = (value) ->
  switch typeof value
    when 'string' then toString(value)
    when 'number' then toImmediate(value) # TO-DO: check this as only < 255
    when 'boolean' then toBoolean(value)
    when 'object'
      if value is null
        toNIL()
      if value instanceof Array
        toArray(value)
      else
        toFrame(value)
    else
      throw new Error "not implemented yet"


# encode array to Newton plain array
toArray = (arrayObject) ->
  #console.log "toArray"
  #console.log arrayObject
  arrayHeader = new Buffer(2)
  arrayHeader.writeUInt8(5,0) # kPlainArray
  arrayHeader.writeUInt8(arrayObject.length,1) # number of slots

  slotValues = _.map arrayObject, cast
  
  # concat arrays into an array of buffers and concat into a new buffer
  Buffer.concat [arrayHeader].concat(slotValues)

# encode JSON object to Newton Frame
toFrame = (object) ->
  #console.log "toFrame"
  #console.log object
  keyCount = _.size(object)
  if keyCount > 254
    throw new Error "not implemented yet"
   
  frameHeader = new Buffer(2)
  frameHeader.writeUInt8(6,0) # kFrame=6
  frameHeader.writeUInt8(keyCount,1) # number of slots

  slotTags = []
  slotValues = []
  _.forEach object, (value, key) ->
    
    ## encode keys to tags (symbols)
    slotTags.push toSymbol(key)
    
    # encode values to each representation
    slotValues.push cast(value)

  # concat arrays into an array of buffers and concat into a new buffer
  Buffer.concat [frameHeader].concat(slotTags,slotValues)
    
module.exports =
  
  fromValue: (value) ->

    versionHeader = new Buffer([0x02])

    Buffer.concat [versionHeader, cast(value)]
