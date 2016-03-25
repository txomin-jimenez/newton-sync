NXlong = require './nxlong'

module.exports =
  
  # Symbol are used for frame slot key or class names    
  #   kSymbol=7 (byte)
  #   Number of characters in name (xlong) Name (bytes)
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
      value: stringVal.toString('ascii')
      bytesRead: 1 + stringLength.bytesRead + stringLength.value
    )
