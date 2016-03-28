NewtonSync        = require '../lib/newton-sync'
_                 = require 'lodash'

# This is a playground for library API functions test

ncuServer = new NewtonSync.server()

ncuServer.on 'new-session', (sessionObj) ->

  console.log "new session init #{sessionObj.id}"

  sessionObj.on "initialized", (newtonDevice) ->
    console.log "session #{sessionObj.id} initialized"

    console.log "Newton device: ID: #{newtonDevice.fNewtonID}. Name: #{newtonDevice.name}"

    #newtonDevice.fullSync()
    #.then =>

      #console.log '###################################################'
      #_.each newtonDevice.stores, (store) ->
        #console.log ' '
        #console.log "  + Store '#{store.name}':"
        #_.each store.soups, (soup) ->
          #console.log "     - Soup '#{soup.name}: Synced entries: #{_.size(soup.entries)}"
        #console.log ' '

      #console.log '###################################################'
      #console.log ' '

    console.log '###################################################'

    newtonDevice.initSync()
    .then ->
      newtonDevice.getSoup('Names')
    .then (namesSoup) ->

      namesSoup.allEntries (entry) ->
        console.log "name entry:"
        console.log entry

      
      #namesSoup.getById(3)
    #.then (frameDoc) ->
      #console.log "First Name contact:"
      #console.log frameDoc
      
      #console.log '###################################################'
      #console.log ' '

      #newtonDevice.finishSync()
    #.catch (err) ->
      #console.log "Error getting first Name contact:"
      #console.log err
    
      #console.log '###################################################'
      #console.log ' '
      
      #newtonDevice.finishSync()
      
      #entryData =
        #address: 'Bulandegi Bidea 19',
        #class: 'person'
        #postal_code: '20159'
        #cardType: 2
        #region: 'Gipuzkoa'
        #city: 'Lezo'
        #name:
          #class: 'person'
          #first: 'Sonia'
          #nameReading: ''
          #last: 'Castro'
        #company: 'Empresa de prueba'
        #sorton: 'Sonia Castro'

      #namesSoup.addEntry(entryData)
    #.then (newId) ->
      #console.log "new added ID: #{newId}"
      
      #newtonDevice.finishSync()
    #.catch (err) ->
      #console.log "error adding new entry:"
      #console.log err
      #newtonDevice.finishSync()
      
      #namesSoup.deleteEntry(11)
    #.then (result) ->
      #console.log "delete Name contact:"
      #console.log result
      
      #console.log '###################################################'
      #console.log ' '

      #newtonDevice.finishSync()
    #.catch (err) ->
      #console.log "Error deleting Name contact:"
      #console.log err
    
      #console.log '###################################################'
      #console.log ' '
      
      #newtonDevice.finishSync()
    
  sessionObj.on "error", (error) ->
    console.log "session #{sessionObj.id} error:"
    console.log error
  
  sessionObj.on "finished", ->
    console.log "session #{sessionObj.id} finished"



