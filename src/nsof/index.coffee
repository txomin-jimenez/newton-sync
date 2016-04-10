_                 = require 'lodash'
Utils             = require '../utils'

NBoolean          = require './nboolean'
NNIL              = require './nnil'
NkCharacter       = require './nkcharacter'
NUniChar          = require './nunichar'
NBinary           = require './nbinary'
NLargeBinary      = require './nlargebinary'
NImmediate        = require './nimmediate'
NSymbol           = require './nsymbol'
NString           = require './nstring'
NKPrecedent       = require './nkprecedent'
NArray            = require './narray'
NPlainArray       = require './nplainarray'
NFrame            = require './nframe'
NSmallRect        = require './nsmallrect'


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
        else if value instanceof Buffer
          if value[0] <= 12
            value
          else
            throw new Error "invalid NSOF Buffer"
        else if value instanceof Array
          NPlainArray.encode(value)
        else if value._binaryClass?
          NBinary.encode(value)
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
    
    # we have to populate precedents array in order, but we have to decode 
    # child objects first so we push an empty object ref and replace when
    # object is fully decoded
    precedentRefObj =
      value: null
    
    # The tag byte is followed an ID, called a precedent ID. The IDs are 
    # assigned consecutively, starting with 0 for the root object, and are used
    # by the kPrecedent tag to generate backward pointer references to objects 
    # that have already been introduced. Note that no object may be traversed 
    # more than once; any pointers to previously traversed objects must be 
    # represented with kPrecedent. Immediate objects cannot be precedents; all
    # precedents are heap objects (binary objects, arrays, and frames).
    if [3,4,5,6,7,8,11,12].indexOf(ntype) > -1
      # populate precedent ref array
      precedents.push precedentRefObj
    
    result = switch ntype
      when 0 then NImmediate.decode(buffer)
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
      when 11 then NSmallRect.decode(buffer)
      when 12 then NLargeBinary.decode(buffer,precedents)
      else
        throw new Error "decoding NSOF type '#{ntype}' is unknown"
    
    precedentRefObj.value = result.value


    if isRoot
      result.value
    else
      result
