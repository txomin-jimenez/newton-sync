module.exports =

  protocol:
    
    # get command ID from binary command buffer
    getCommandId: (buffer) ->
      # ignore first eight letters as always is same 'newtdock' header
      buffer.toString('ascii',8,12)
    
    parseData: (buffer) ->
      # extract data from command (if any). first value is data length
      length = buffer.readUInt32BE(12)
      console.log buffer.readUInt32BE(16)
      {}

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
    
  Enum: ->
    values = arguments
    # get the varargs and save them to a 'values' variable.
    self =
      all: []
      keys: values
    i = 0
    while i < values.length
      self[values[i]] = i
      # add the variable to this object
      self.all[i] = i
      # add the index to the list of all indices
      i++
    self
