NewtonSync        = require '../lib/newton-sync'
_                 = require 'lodash'

# This is a playground for library API functions test

ncuServer = new NewtonSync.server()

ncuServer.on 'new-session', (sessionObj) ->

  console.log "new session init #{sessionObj.id}"

  sessionObj.on "initialized", (newtonDevice) ->
    console.log "session #{sessionObj.id} initialized"

    newtonDevice.on 'synced', ->

      console.log '###################################################'
      _.each newtonDevice.stores, (store) ->
        console.log ' '
        console.log "  + Store '#{store.name}':"
        _.each store.soups, (soup) ->
          console.log "     - Soup '#{soup.name}: Synced entries: #{_.size(soup.entries)}"
        console.log ' '

      console.log '###################################################'
      console.log ' '

  sessionObj.on "error", (error) ->
    console.log "session #{sessionObj.id} error:"
    console.log error
  
  sessionObj.on "finished", ->
    console.log "session #{sessionObj.id} finished"



