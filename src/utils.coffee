_                 = require 'lodash'

Iconv             = require('iconv').Iconv
unicharDecode = new Iconv('UTF-16BE','UTF-8')
unicharEncode = new Iconv('UTF-8','UTF-16BE')

module.exports =

  # Creates enum - like type    
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
 
  # Creates enum - like type. This time for byte shift mask values. used in
  # dock session icons enum
  ByteEnum: ->
    values = arguments
    # get the varargs and save them to a 'values' variable.
    self =
      all: []
      keys: values
    i = 0
    while i < values.length
      self[values[i]] = 1 << i
      # add the variable to this object
      self.all[1 << i] = i
      # add the index to the list of all indices
      i++
    self
  
  unichar:

    toString: (uniCharBuff)->
      # use iconv to convert UTF-16BE buffer to UTF-8 buffer and then to string
      unicharDecode.convert(uniCharBuff).toString('utf8').slice(0,-1)
    
    toUniCharBuffer: (text) ->
      unicharEncode.convert("#{text}\u0000")
  
