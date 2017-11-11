###*
kDGetSoupIDs

Desktop > Newton

ULong 'gids'

This command is sent to request a list of entry IDs for the current soup.
It expects to receive a kDSoupIDs command in response.
###
EventCommand      = require '../event-command'

module.exports = class kDGetSoupIDs extends EventCommand
  
  @id: 'gids'
  
  id: kDGetSoupIDs.id
  name: 'kDGetSoupIDs'
  length: null

  constructor: ->
    super
