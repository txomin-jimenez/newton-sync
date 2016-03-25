
module.exports =
  
  # encode boolean values as immediate refs
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
