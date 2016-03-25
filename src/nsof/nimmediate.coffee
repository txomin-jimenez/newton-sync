NXlong = require './nxlong'

module.exports =
  
  # Immediate objects are represented by kImmediate followed by a Ref that 
  # gives the value of the immediate 
  #   kImmediate=0 (byte)
  #   Immediate Ref (xlong)
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
