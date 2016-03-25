NXLong            = require './nxlong'

module.exports =
  
  encode: (value) ->
    throw new Error "encode Precedents not implemented yet"
  
  decode: (buffer, precedents) ->
    precedentId = NXLong.decode(buffer.slice(1))

    return(
      value: precedents[precedentId.value].value
      bytesRead: 1 + precedentId.bytesRead
    )