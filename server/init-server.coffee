NewtonSync        = require '../lib/newton-sync'
_                 = require 'lodash'

# This is a playground server example for library API functions testing

# start NCU Server an listen for Dock connections
ncuServer = new NewtonSync.server()

# new Dock session received
ncuServer.on 'new-session', (sessionObj) ->

  console.log "New session init #{sessionObj.id}"

  # session negotiation finished. Now we can do some operations with device
  sessionObj.on "initialized", (newtonDevice) ->
    console.log "Session #{sessionObj.id} initialized"

    console.log "Newton device: ID: #{newtonDevice.fNewtonID}. 
      Name: #{newtonDevice.name}"

    # setTimeout ->
    #   newtonDevice.notifyUser "Newton NodeJS Sync",
    #     "Hi, welcome to Newton Sync test server."
    # , 1000

    # setTimeout ->
    #   #newtonDevice.finishSync()
    #   newtonDevice.notifyUser "Newton NodeJS Sync", "Bye!"
      
    #   setTimeout ->
    #     newtonDevice.sendCommand('kDResult', 0)
    #     .then =>
    #       sessionObj.endSession()
    #   , 2000
    # , 5000

    return

    #newtonDevice.appNames()
    #.then (appNames) ->
      #console.log "App Names:"
      #console.log appNames

    #newtonDevice.getSoup('Names')
    #.then (namesSoup) ->
      
      #setTimeout ->
        ## get one random entry from Names
        #namesSoup.getEntry(6)
        #.then (nameFrame) ->
          ## this has no sense, just take it as a example
          #name = nameFrame.name.last or 'Steve'
          
          ##newtonDevice.notifyUser "Newton NodeJS Sync",
            ##"Hi #{name}, welcome to Newton Sync test server."
          ##.then ->
          #console.log "Hi #{name}!!!"
      #, 1000

    #newtonDevice.getSoup('Notes')
    #.then (notesSoup) ->
      
      #console.log notesSoup.name
      #console.log notesSoup.userName
      #console.log notesSoup.userDescr
      #console.log notesSoup.nckLastBackupTime
      
      #setTimeout ->
        #notesSoup.getEntry(0)
        #.then (noteFrame) ->

          #console.log "notes entry:"
          #console.log noteFrame
          
      #, 1000

    #.catch (err) ->
      #console.log "Error processing:"
      #console.log err
    
      #errMessage = err.message.substr(0,60) + "..."
      
      #newtonDevice.notifyUser "Error",
        #"Sorry, something went wrong. Process failed with error '#{errMessage}'"
    
    #return
  
    #console.log '###################################################'

    #newtonDevice.initSync()
    #.then ->
      #newtonDevice.getSoup('Names')
    #.then (namesSoup) ->
      
      #getAllEntries = ->
        #namesSoup.allEntries (entry) ->
          #console.log "name entry:"
          #console.log entry
        
        #setTimeout ->
          #newtonDevice.finishSync()
        #, 5000
      
      #getEntry = (entryId) ->
        #namesSoup.getEntry(entryId)
        #.then (frameDoc) ->
          #console.log "Entry #{entryId} data:"
          ##console.log frameDoc
          
          #console.log '###################################################'
          #console.log ' '

          #newtonDevice.finishSync()
        #.catch (err) ->
          #console.log "Error getting entry #{entryId}:"
          #console.log err
        
          #console.log '###################################################'
          #console.log ' '
          
          #newtonDevice.finishSync()

      #addNewEntry = ->
        #entryData =
          #address: '1 Infinite Loop'
          #class: 'person'
          #postal_code: '95014'
          #cardType: 2
          #region: 'CA'
          #city: 'Cupertino'
          #name:
            #class: 'person'
            #first: 'Steve'
            #nameReading: ''
            #last: 'Jobs'
          #company: 'Apple Inc.'
          #sorton:
            #_binaryClass: 'name'
            #_binaryData:  new Buffer('0053006f006e00690061002000430061007300740072006f0000','hex')

        #namesSoup.addEntry(entryData)
        #.then (newId) ->
          #console.log "new added ID: #{newId}"
          
          #newtonDevice.finishSync()
        #.catch (err) ->
          #console.log "error adding new entry:"
          #console.log err
          #newtonDevice.finishSync()
     
      #deleteEntry = (entryId) ->
        #namesSoup.deleteEntry(entryId)
        #.then (result) ->
          #console.log "delete entry #{entryId} result:"
          #console.log result
          
          #console.log '###################################################'
          #console.log ' '

          #newtonDevice.finishSync()
        #.catch (err) ->
          #console.log "Error deleting entry #{entryId}:"
          #console.log err
        
          #console.log '###################################################'
          #console.log ' '
          
          #newtonDevice.finishSync()

      ## do something 
      ##getAllEntries()
      ##deleteEntry([22])
      #addNewEntry()
      ##getEntry(21)
    
  sessionObj.on "error", (error) ->
    console.log "session #{sessionObj.id} error:"
    console.log error
  
  sessionObj.on "finished", ->
    console.log "session #{sessionObj.id} finished"
