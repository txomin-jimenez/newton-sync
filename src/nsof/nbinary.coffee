Utils             = require '../utils'
NXLong            = require './nxlong'

module.exports =

  encode: (value) ->
    encode = require('./index').encode
    throw new Error "encode Binary not implemented yet"
  
  decode: (buffer, precedents) ->
    decode= require('./index').decode
    bytesRead_ = 1
    binaryLength = NXLong.decode(buffer.slice(1))
    bytesRead_ = bytesRead_ + binaryLength.bytesRead
    # decode binary Class. Usually it's a Symbol but someone could use
    # kPrecedent so we have to use generic decode function
    binaryClass = decode(buffer.slice(bytesRead_), precedents, isRoot = false)
    bytesRead_ = bytesRead_ + binaryClass.bytesRead
    binaryData = buffer.slice(bytesRead_, bytesRead_ + binaryLength.value)
    bytesRead_ = bytesRead_ + binaryLength.value
    
    return(
      value:
        _binaryClass: binaryClass.value
        # TO-DO: convert binaryData to NewtonScript format (if possible)
        _binaryData: binaryData #Utils.unichar.toString(binaryData)
      bytesRead: bytesRead_
    )
