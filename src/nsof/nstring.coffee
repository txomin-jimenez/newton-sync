Utils             = require '../utils'

NXLong            = require './nxlong'

module.exports =

  # encode string  
  #   kString=8 (byte)
  #   Number of bytes in string (xlong)
  #   String (halfwords)
  encode: (stringVal) ->
    unicharValue = Utils.unichar.toUniCharBuffer(stringVal)
    stringHeader = new Buffer(1)
    stringHeader.writeUInt8(8,0) # kString = 8
    Buffer.concat [
      stringHeader
      NXLong.encode(unicharValue.length)
      unicharValue
    ]
  
  decode: (buffer) ->
    stringLengthXlong = NXLong.decode(buffer.slice(1))
    binaryValue = buffer.slice(2, 2 + stringLengthXlong.value)
    return(
      value: Utils.unichar.toString(binaryValue)
      # head + length xlong size + string byte length
      bytesRead: 1 + stringLengthXlong.bytesRead + stringLengthXlong.value
    )
