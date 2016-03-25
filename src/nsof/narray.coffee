_                 = require 'lodash'
NXLong            = require './nxlong'

module.exports =
  
  encode: (value) ->
    encode = require('./index').encode
    console.log value
    throw new Error "encode NArray not implemented yet"

  decode: (buffer, precedents, decode) ->
    decode= require('./index').decode
    arrayByteLength = 1 # head byte
    arrayLength = NXLong.decode(buffer.slice(1))
    arrayByteLength = arrayByteLength + arrayLength.bytesRead
    
    # decode array Class. Usually it's a Symbol but someone could use
    # kPrecedent so we have to use generic decode function
    arrayClass = decode(buffer.slice(arrayByteLength), precedents, isRoot = false)
    arrayByteLength = arrayByteLength + arrayClass.bytesRead
    
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
      value:
        _arrayClass: arrayClass.value
        _arrayData: resArray
      bytesRead: arrayByteLength # head byte is summed earlier
    )
