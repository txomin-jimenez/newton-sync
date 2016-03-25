
module.exports =

  # kNIL is a special type for null values. encoders can use this types in 
  # order to reduce the size of the streamed data
  # kNIL=10 (byte)
  encode: ->
    # binary value 10
    new Buffer([0x10])
  decode: (buffer) ->
    # nil is null
    return(
      value: null
      bytesRead: 1 # head + value bytes
    )
