
module.exports =

  # Number type props are usually xlong type.
  # Xlong number is special. According to documentation:
  # 0 ≤ value ≤ 254: unsigned byte
  # else: byte 0xFF followed by signed long
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
