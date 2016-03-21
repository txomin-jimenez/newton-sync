_                 = require 'lodash'

Utils             = require './utils'

# (NSOF) Newton Streamed Object encoding / decoding

# Number type props are usually xlong type.
# Xlong number is special. According to documentation:
# 0 ≤ value ≤ 254: unsigned byte
# else: byte 0xFF followed by signed long
NXlong =
  encode: (numberVal) ->
    # 0 ≤ value ≤ 254: unsigned byte
    if numberVal >= 0 and numberVal <= 254
      new Buffer([numberVal])
    else
      # else: byte 0xFF followed by signed long
      bufA = new Buffer([0xFF])
      bufB = new Buffer(4)
      bufB.writeInt32BE(numberVal, 0)
      Buffer.concat [bufA, bufB]
  decode: (buffer) ->
    if buffer[0] is 0xFF
      return(
        value: buffer.readInt32BE(1)
        bytesRead: 5
      )
    else
      return(
        value: buffer[0]
        bytesRead: 1
      )

# encode boolean values as immediate refs
NBoolean =
  encode: (value) ->
    # the Ref for TRUE is 0x1A
    if value
      new Buffer([0x00,0x1a])
    else
      new Buffer([0x00,0x00])
  decode: (buffer) ->
    boolValue = false
    if buffer[1] is 0x1A
      boolValue = true
    return(
      value: boolValue
      bytesRead: 2 # head + value bytes
    )

# kNIL is a special type for null values. encoders can use this types in 
# order to reduce the size of the streamed data
# kNIL=10 (byte)
NNIL =
  encode: ->
    # binary value 10
    new Buffer([0x10])
  decode: (buffer) ->
    # nil is null
    return(
      value: null
      bytesRead: 1 # head + value bytes
    )

# Immediate objects are represented by kImmediate followed by a Ref that 
# gives the value of the immediate 
#   kImmediate=0 (byte)
#   Immediate Ref (xlong)
NImmediate =
  encode: (ref, type = 'integer') ->
    value = switch type
      when 'integer' then NXlong.encode(ref << 2)
      when 'boolean'
        # 0x1a for TRUE or 0 for false
        if ref
          new Buffer([0x1A])
        else
          new Buffer([0])
      when 'nil'
        # nil ref = 0x2
        new Buffer([2])
      else
        throw new Error "#{type} not implemented yet"

    Buffer.concat [new Buffer([0x00]), value]
  decode: (buffer) ->
    # extract binary ref value
    decodedLong = NXlong.decode(buffer.slice(1))
    # check for TRUE ref
    if decodedLong.value is 0x1A
      decodedLong.value = true
    else
      # decode ref value
      decodedLong.value = decodedLong.value >> 2
    # add header byte to count
    decodedLong.bytesRead = decodedLong.bytesRead + 1
    decodedLong

# Symbol are used for frame slot key or class names    
#   kSymbol=7 (byte)
#   Number of characters in name (xlong) Name (bytes)
NSymbol =
  encode: (key) ->
    symbolHeader = new Buffer(1)
    symbolHeader.writeUInt8(7,0) # kSymbol=7
    Buffer.concat [
      symbolHeader
      NXlong.encode(key.length)
      Buffer(key,'ascii')
    ]
  decode: (buffer) ->
    stringLength = NXlong.decode(buffer.slice(1))
    stringVal  = buffer.slice(2,2 + stringLength.value)
    return(
      value: stringVal
      bytesRead: 1 + stringLength.bytesRead + stringLength.value
    )

# encode string  
#   kString=8 (byte)
#   Number of bytes in string (xlong)
#   String (halfwords)
NString =
  encode: (stringVal) ->
    unicharValue = Utils.unichar.toUniCharBuffer(stringVal)
    stringHeader = new Buffer(1)
    stringHeader.writeUInt8(8,0) # kString = 8
    Buffer.concat [
      stringHeader
      NXlong.encode(unicharValue.length)
      unicharValue
    ]
  decode: (buffer) ->
    stringLengthXlong = NXlong.decode(buffer.slice(1))
    binaryValue = buffer.slice(2, 2 + stringLengthXlong.value)
    return(
      value: Utils.unichar.toString(binaryValue)
      # head + length xlong size + string byte length
      bytesRead: 1 + stringLengthXlong.bytesRead + stringLengthXlong.value
    )

# encode array to Newton plain array
#   kPlainArray=5 (byte)
#   Number of slots (xlong)
#   Slot values in ascending order (objects)
NArray =
  encode: (arrayObject) ->
    arrayHeader = new Buffer(1)
    arrayHeader.writeUInt8(5,0) # kPlainArray

    slotValues = _.map arrayObject, encode
    
    # concat arrays into an array of buffers and concat into a new buffer
    Buffer.concat [
      arrayHeader
      NXlong.encode(arrayObject.length)
    ].concat(slotValues)

  decode: (buffer) ->
    arrayByteLength = 1 # head byte
    arrayLength = NXlong.decode(buffer.slice(1))
    arrayByteLength = arrayByteLength + arrayLength.bytesRead
    
    resArray = new Array(arrayLength.value)
    # continue reading values until result array is completed
    _.forEach resArray, (value, key) ->
      # extract and decode a value
      value_ = decode(buffer.slice(arrayByteLength))
      # add it to result array
      resArray[key] = value_.value
      # sum read bytes
      arrayByteLength = arrayByteLength + value_.bytesRead
    #### 
   
    return(
      value: resArray
      bytesRead: arrayByteLength # head byte is summed earlier
    )

# encode JSON object to Newton Frame
#   kFrame=6 (byte)
#   Number of slots (xlong)
#   Slot tags in ascending order (symbol objects) Slot values in ascending 
#   order (objects)
NFrame =
  encode: (object) ->
    keyCount = _.size(object)
     
    frameHeader = new Buffer(1)
    frameHeader.writeUInt8(6,0) # kFrame=6

    slotTags = []
    slotValues = []
    _.forEach object, (value, key) ->
      
      ## encode keys to tags (symbols)
      slotTags.push NSymbol.encode(key)
      
      # encode values to each representation
      slotValues.push encode(value)

    # concat arrays into an array of buffers and concat into a new buffer
    Buffer.concat [frameHeader, NXlong.encode(keyCount)].concat(slotTags,slotValues)
  decode: (buffer) ->
    objByteLength = 1 # head byte
    keyLength = NXlong.decode(buffer.slice(1))
    objByteLength = objByteLength + keyLength.bytesRead
    
    keyArray = new Array(keyLength.value)
    # read key names
    _.forEach keyArray, (value, key) ->
      # extract and decode a value
      value_ = decode(buffer.slice(objByteLength))
      # add it to result array
      keyArray[key] = value_.value
      # sum read bytes
      objByteLength = objByteLength + value_.bytesRead
    #### 
   
    # continue reading values and assigning them to key values
    resObj = {}
    _.forEach keyArray, (keyName) ->
      # extract and decode a value
      value_ = decode(buffer.slice(objByteLength))
      # assign it to key
      resObj[keyName] = value_.value
      # sum read bytes
      objByteLength = objByteLength + value_.bytesRead
    ####

    return(
      value: resObj
      bytesRead: objByteLength # head byte is summed earlier
    )

# main function for ENCODE NSOF data 
encode = (value) ->
  type = typeof value
  switch type
    when 'string' then NString.encode(value)
    when 'number' then NImmediate.encode(value,'integer')
    when 'boolean' then NImmediate.encode(value,'boolean')
    when 'object'
      if value is null
        NNIL.encode()
      if value instanceof Array
        NArray.encode(value)
      else
        NFrame.encode(value)
    else
      # encode undefined values as kNIL
      if not value?
        NNIL.encode()
      else
        throw new Error "encoding NSOF type '#{type}' not implemented yet"
    
# main function for DECODE NSOF data 
decode = (buffer) ->
  ntype = buffer[0]
  switch ntype
    when 0 # immediate ref
      if buffer[1] is 0x1A
        # its a boolean true value
        NBoolean.decode(buffer)
      else if buffer[1] is 2
        # its a nil ref
        NNIL.decode()
      else
        # decode to numeric value
        NImmediate.decode(buffer)
    when 5 then NArray.decode(buffer)
    when 6 then NFrame.decode(buffer)
    when 7 then NSymbol.decode(buffer)
    when 8 then NString.decode(buffer)
    # kNIL is special type used to save some bytes
    when 10 then NNIL.decode()
    else
      throw new Error "decoding NSOF type '#{ntype}' not implemented yet"

module.exports =
  
  # Encode JSON object to NewtonScript frame
  encode: (value) ->

    versionHeader = new Buffer([0x02])

    Buffer.concat [versionHeader, encode(value)]
  
  # Decode NewtonScript frame to JSON object  
  decode: (buffer) ->
    
    # omit frame header byte
    decode(buffer.slice(1)).value
