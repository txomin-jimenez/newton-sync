###*
kDAppNames

Desktop < Newton

ULong 'appn'
ULong length
NSOF  result frame

This command returns the names of the applications present on the newton. It 
also, optionally, returns the names of the soups associated with each 
application. The array looks like this:

[{name: "app name", soups: ["soup1", "soup2"]},
     {name: "another app name", ...}, ...]

Some built-in names are included. "System information" includes the system and
directory soups. If there are packages installed, a "Packages" item is listed.
If a card is present and has a backup there will be a "Card backup" item. If 
there are soups that don't have an associated application (or whose application
I can't figure out) there's an "Other information" entry.

The soup names are optionally returned depending on the value received with 
kDGetAppNames.

###
EventCommand      = require '../event-command'
NsOF              = require '../../nsof'

module.exports = class kDAppNames extends EventCommand
  
  @id: 'appn'
  
  id: kDAppNames.id
  name: 'kDAppNames'
  length: null

  constructor: ->
    super
  
  dataFromBinary: (dataBuffer) ->
    #console.log dataBuffer.toString('hex')
    @length = dataBuffer.readUInt32BE(0)
    @data = NsOF.decode(dataBuffer.slice(4))
