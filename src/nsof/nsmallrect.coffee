#NXLong = require './nxlong'

module.exports =
  
  encode: (key) ->
    throw new Error "encode smallRect not implemented yet"
  
  decode: (buffer) ->
    return(
      value:
        top: buffer[0]
        left: buffer[1]
        bottom: buffer[2]
        right: buffer[3]
      bytesRead: 5
    )
