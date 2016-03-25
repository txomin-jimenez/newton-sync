_                 = require 'lodash'

NXLong = require './nxlong'
NSymbol = require './nsymbol'

module.exports =

  # encode JSON object to Newton Frame
  #   kFrame=6 (byte)
  #   Number of slots (xlong)
  #   Slot tags in ascending order (symbol objects) Slot values in ascending 
  #   order (objects)
  encode: (object) ->
    encode = require('./index').encode
    keyCount = _.size(object)
     
    frameHeader = new Buffer(1)
    frameHeader.writeUInt8(6,0) # kFrame=6

    slotTags = []
    slotValues = []
    _.forEach object, (value, key) ->
      
      ## encode keys to tags (symbols)
      slotTags.push NSymbol.encode(key)
      
      # encode values to each representation
      slotValues.push encode(value, isRoot = false)

    # concat arrays into an array of buffers and concat into a new buffer
    Buffer.concat [frameHeader, NXLong.encode(keyCount)].concat(slotTags,slotValues)
  
  decode: (buffer, precedents) ->
    decode= require('./index').decode
    objByteLength = 1 # head byte
    keyLength = NXLong.decode(buffer.slice(1))
    objByteLength = objByteLength + keyLength.bytesRead
    
    keyArray = new Array(keyLength.value)
    # read key names
    _.forEach keyArray, (value, key) ->
      # extract and decode a value
      value_ = decode(buffer.slice(objByteLength), precedents, isRoot = false)
      # add it to result array
      keyArray[key] = value_.value
      # sum read bytes
      objByteLength = objByteLength + value_.bytesRead
    #### 
   
    # continue reading values and assigning them to key values
    resObj = {}
    _.forEach keyArray, (keyName) ->
      #console.log "------decode #{keyName}:"
      # extract and decode a value
      value_ = decode(buffer.slice(objByteLength), precedents, isRoot = false)
      #console.log value_.value
      # assign it to key
      resObj[keyName] = value_.value
      # sum read bytes
      objByteLength = objByteLength + value_.bytesRead
    ####

    return(
      value: resObj
      bytesRead: objByteLength # head byte is summed earlier
    )
