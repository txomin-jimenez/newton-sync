NewtonSync          = require '../lib/newton-sync'

ncuServer = new NewtonSync.server()

ncuServer.on 'new-session', (sessionObj) ->

  console.log "new session init #{sessionObj.id}"

  sessionObj.on "initialized", (newtonDevice) ->
    console.log "session #{sessionObj.id} initialized"
  
  sessionObj.on "error", (error) ->
    console.log "session #{sessionObj.id} error:"
    console.log error
  
  sessionObj.on "finished", ->
    console.log "session #{sessionObj.id} finished"



