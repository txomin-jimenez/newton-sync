_                 = require 'lodash'
Utils             = require '../utils'

NXlong            = require './nxlong'
NBoolean          = require './nboolean'
NNIL              = require './nnil'
NkCharacter       = require './nkcharacter'
NUniChar          = require './nunichar'
NBinary           = require './nbinary'
NImmediate        = require './nimmediate'
NSymbol           = require './nsymbol'
NString           = require './nstring'
NKPrecedent       = require './nkprecedent'
NArray            = require './narray'
NPlainArray       = require './nplainarray'
NFrame            = require './nframe'

###*
    (NSOF) Newton Streamed Object encoding / decoding
###

module.exports =

  encode: (value, isRoot = true) ->
    
    type = typeof value
    encodedValue = switch type
      when 'string' then NString.encode(value)
      when 'number' then NImmediate.encode(value,'integer')
      when 'boolean' then NImmediate.encode(value,'boolean')
      when 'object'
        if value is null
          NNIL.encode()
        if value instanceof Array
          NPlainArray.encode(value)
        else
          NFrame.encode(value)
      else
        # encode undefined values as kNIL
        if not value?
          NNIL.encode()
        else
          throw new Error "encoding NSOF type '#{type}' not implemented yet"
    
    if isRoot
      # Add NSOF version 2 Tag
      versionHeader = new Buffer([0x02])

      Buffer.concat [versionHeader, encodedValue]
    else
      encodedValue

  decode: (buffer, precedents = [], isRoot = true) ->
    
    # remove NSOF version tag
    buffer = buffer.slice(1) if isRoot
    
    ntype = buffer[0]
    result = switch ntype
      when 0 # immediate ref
        if buffer[1] is 0x1A
          # its a boolean true value
          NBoolean.decode(buffer)
        else if buffer[1] is 2
          # its a nil ref
          NNIL.decode()
        else
          # decode to numeric value
          NImmediate.decode(buffer)
      when 1 then NkCharacter.decode(buffer)
      when 2 then NUniChar.decode(buffer)
      when 3 then NBinary.decode(buffer, precedents)
      when 4 then NArray.decode(buffer, precedents)
      when 5 then NPlainArray.decode(buffer, precedents)
      when 6 then NFrame.decode(buffer, precedents)
      when 7 then NSymbol.decode(buffer)
      when 8 then NString.decode(buffer)
      when 9 then NKPrecedent.decode(buffer, precedents)
      # kNIL is special type used to save some bytes
      when 10 then NNIL.decode()
      else
        throw new Error "decoding NSOF type '#{ntype}' not implemented yet"

    precedents.push result
    
    if isRoot
      result.value
    else
      result
