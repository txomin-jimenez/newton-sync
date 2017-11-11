
module.exports =
  
  encode: (value) ->
    throw new Error "encode kCharacter not implemented yet"
  decode: (buffer) ->

    return(
      value: String.fromCharCode(buffer[0])
      bytesRead: 2
    )
