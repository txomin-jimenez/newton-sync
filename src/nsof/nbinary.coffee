Utils             = require '../utils'
NXLong            = require './nxlong'
NSymbol           = require './nsymbol'

module.exports =

  encode: (value) ->
    #encode = require('./index').encode
   
    frameHeader = new Buffer(1)
    frameHeader.writeUInt8(3,0) # kBinaryObject
    
    if typeof value.toBinary is 'function'
      binaryData = value.toBinary()
    else if value._binaryData instanceof Buffer
      binaryData = value._binaryData
    else
      binaryData = Utils.unichar.toUniCharBuffer(value._binaryData)
    
    Buffer.concat [
      frameHeader
      NXLong.encode(binaryData.length)
      NSymbol.encode(value._binaryClass)
      binaryData
    ]

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
