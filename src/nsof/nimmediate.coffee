NXLong = require './nxlong'
NBoolean          = require './nboolean'

module.exports =

  # Immediate objects are represented by kImmediate followed by a Ref that
  # gives the value of the immediate
  #   kImmediate=0 (byte)
  #   Immediate Ref (xlong)
  encode: (ref, type = 'integer') ->
    value = switch type
      when 'integer' then NXLong.encode(ref << 2)
      when 'boolean'
        NBoolean.encode(ref)
      when 'nil'
        # immediate ref nil = 0x2
        new Buffer([2])
      else
        throw new Error "#{type} not implemented yet"

    Buffer.concat [new Buffer([0x00]), value]

  decode: (buffer) ->
    if buffer[1] is 0x1A
      # its a boolean true value
      NBoolean.decode(buffer)
    else if buffer[1] is 2
      # its a nil ref
      NNIL.decode()
    else
      # extract binary ref value
      decodedLong = NXLong.decode(buffer.slice(1))
      # decode ref value
      decodedLong.value = decodedLong.value >> 2
      # add header byte to count
      decodedLong.bytesRead = decodedLong.bytesRead + 1
      decodedLong
