_                 = require 'lodash'

Utils             = require './utils'

# (NSOF) Newton Streamed Object encoding / decoding

# convert number to xlong
toXlong = (numberVal) ->
  # 0 ≤ value ≤ 254: unsigned byte
  if numberVal >= 0 and numberVal <= 254
    new Buffer([numberVal])
  else
    # else: byte 0xFF followed by signed long
    bufA = new Buffer([0xFF])
    bufB = new Buffer(4)
    bufB.writeInt32BE(numberVal, 0)
    Buffer.concat [bufA, bufB]

toSymbol = (key) ->
  symbolHeader = new Buffer(1)
  symbolHeader.writeUInt8(7,0) # kSymbol=7
  Buffer.concat [
    symbolHeader
    toXlong(key.length)
    Buffer(key,'ascii')
  ]

# encode ref numbers
#   kImmediate=0 (byte)
#   Immediate Ref (xlong)
toImmediate = (ref) ->
  Buffer.concat [new Buffer([0x00]), toXlong(ref << 2)]

# encode boolean values  
toBoolean = (value) ->
  # the Ref for TRUE is 0x1A
  if value
    new Buffer([0x00,0x1a])
  else
    new Buffer([0x00,0x00])

# encode null values
#   kNIL=10 (byte)
toNIL = ->
  # the Ref for NIL is 0x2. kNIL=10. TO-DO: not sure about this, confused about
  # documentation
  new Buffer([0x00,2])

# encode string  
#   kString=8 (byte)
#   Number of bytes in string (xlong)
#   String (halfwords)
toString = (stringVal) ->
  unicharValue = Utils.unichar.toUniCharBuffer(stringVal)
  stringHeader = new Buffer(1)
  stringHeader.writeUInt8(8,0) # kString = 8
  Buffer.concat [
    stringHeader
    toXlong(unicharValue.length)
    unicharValue
  ]

cast = (value) ->
  switch typeof value
    when 'string' then toString(value)
    when 'number' then toImmediate(value)
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
#   kPlainArray=5 (byte)
#   Number of slots (xlong)
#   Slot values in ascending order (objects)
toArray = (arrayObject) ->
  arrayHeader = new Buffer(1)
  arrayHeader.writeUInt8(5,0) # kPlainArray

  slotValues = _.map arrayObject, cast
  
  # concat arrays into an array of buffers and concat into a new buffer
  Buffer.concat [arrayHeader, toXlong(arrayObject.length)].concat(slotValues)

# encode JSON object to Newton Frame
toFrame = (object) ->
  keyCount = _.size(object)
   
  frameHeader = new Buffer(1)
  frameHeader.writeUInt8(6,0) # kFrame=6

  slotTags = []
  slotValues = []
  _.forEach object, (value, key) ->
    
    ## encode keys to tags (symbols)
    slotTags.push toSymbol(key)
    
    # encode values to each representation
    slotValues.push cast(value)

  # concat arrays into an array of buffers and concat into a new buffer
  Buffer.concat [frameHeader, toXlong(keyCount)].concat(slotTags,slotValues)
    
module.exports =
  
  fromValue: (value) ->

    versionHeader = new Buffer([0x02])

    Buffer.concat [versionHeader, cast(value)]
