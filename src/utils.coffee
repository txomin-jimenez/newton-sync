module.exports =

  protocol:
    
    # convert 4 byte buffer info to JS Number
    toNumber: (d) ->
      val = 0
      val += d[0] << 24
      val += d[1] << 16
      val += d[2] << 8
      val += d[3]
    
    # convert a JS Number to 4 byte ULong  
    fromNumber: (n) ->
      throw new Error "not implemented"
    
