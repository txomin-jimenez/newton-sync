Utils             = require '../utils'
NXLong            = require './nxlong'

module.exports =

  encode: (value) ->
    encode = require('./index').encode
    throw new Error "encode Large Binary not implemented yet"

  decode: (buffer, precedents) ->
    decode= require('./index').decode
    bytesRead_ = 1

    # decode binary Class. Usually it's a Symbol but someone could use
    # kPrecedent so we have to use generic decode function
    binaryClass = decode(buffer.slice(bytesRead_), precedents, isRoot = false)
    bytesRead_ = bytesRead_ + binaryClass.bytesRead

    # Compressed? (non-zero means compressed) (byte)
    compressed = buffer.slice(bytesRead_)[0]
    bytesRead_ = bytesRead_ + 1

    # Number of bytes of data (long)
    binaryLength = NXLong.decode(buffer.slice(bytesRead_))
    bytesRead_ = bytesRead_ + binaryLength.bytesRead

    # Number of characters in compander name (long)
    companderNameLength = NXLong.decode(buffer.slice(bytesRead_))
    bytesRead_ = bytesRead_ + companderNameLength.bytesRead

    # Number of byte of compander parameters (long)
    companderParamsLength = NXLong.decode(buffer.slice(bytesRead_))
    bytesRead_ = bytesRead_ + companderParamsLength.bytesRead

    # Reserved (encode zero, ignore when decoding) (long)
    reservedIgnore = NXLong.decode(buffer.slice(bytesRead_))
    bytesRead_ = bytesRead_ + reservedIgnore.bytesRead

    # Compander name (bytes)
    companderName = buffer.slice(bytesRead_, bytesRead_ +
    companderNameLength.value).toString('ascii')

    bytesRead_ = bytesRead_ + companderNameLength.value

    # Compander parameters (bytes)
    companderParams = buffer.slice(bytesRead_, bytesRead_ +
    companderParamsLength.value)

    bytesRead_ = bytesRead_ + companderParamsLength.value

    # Data (bytes)
    binaryData = buffer.slice(bytesRead_, bytesRead_ + binaryLength.value)
    bytesRead_ = bytesRead_ + binaryLength.value

    return(
      value:
        _binaryClass: binaryClass.value
        _compander:
          name: companderName
          params: companderParams
        _binaryData: binaryData
      bytesRead: bytesRead_
    )
