Utils             = require '../utils'

module.exports =

  encode: (value) ->
    throw new Error "encode UniChar not implemented yet"
  
  decode: (buffer) ->
    binaryValue = buffer.slice(1, 3)
    return(
      value: Utils.unichar.toString(binaryValue)
      bytesRead: 3
    )
