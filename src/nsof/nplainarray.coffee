_                 = require 'lodash'
NXlong            = require './nxlong'

module.exports =

  # encode array to Newton plain array
  #   kPlainArray=5 (byte)
  #   Number of slots (xlong)
  #   Slot values in ascending order (objects)
  encode: (arrayObject) ->
    encode = require('./index').encode
    arrayHeader = new Buffer(1)
    arrayHeader.writeUInt8(5,0) # kPlainArray

    slotValues = _.map arrayObject, (val) ->
      encode(val, isRoot = false)
    
    # concat arrays into an array of buffers and concat into a new buffer
    Buffer.concat [
      arrayHeader
      NXlong.encode(arrayObject.length)
    ].concat(slotValues)

  decode: (buffer, precedents) ->
    decode= require('./index').decode
    arrayByteLength = 1 # head byte
    arrayLength = NXlong.decode(buffer.slice(1))
    arrayByteLength = arrayByteLength + arrayLength.bytesRead
    
    resArray = new Array(arrayLength.value)
    # continue reading values until result array is completed
    _.forEach resArray, (value, key) ->
      # extract and decode a value
      value_ = decode(buffer.slice(arrayByteLength), precedents, isRoot = false)
      # add it to result array
      resArray[key] = value_.value
      # sum read bytes
      arrayByteLength = arrayByteLength + value_.bytesRead
    #### 
   
    return(
      value: resArray
      bytesRead: arrayByteLength # head byte is summed earlier
    )
