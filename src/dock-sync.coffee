###*
  Mixing for DockSession that provides data sync features
@class DockSync
###

_                 = require 'lodash'
CommandBroker     = require './commands/command-broker'
StateMachine      = require './commands/state-machine'
Utils             = require './utils'

NewtonDevice      = require './newton-device'

module.exports =
  
  _synchronize: ->

    #@listenForCommand 'all', (command) ->
      #console.log "sync trace. comm received"
      #console.log command

    console.log "syncing ..."
    
    @_initSyncProcess()
  
  ###*
    Init sync process with connected device
  @method initSyncProcess  
  ###
  _initSyncProcess: ->
    
    # TO-DO: all sync process :)
    
    console.log "init sync process..."
    @receiveCommand('kDSynchronize')
    .then =>
      @sendCommand('kDGetSyncOptions')
    .then =>
      @receiveCommand('kDSyncOptions')
    .then (syncOptions) =>
      console.log "received sync options:"
      console.log syncOptions
      @sendCommand('kDLastSyncTime')
    .then =>
      @receiveCommand('kDCurrentTime')
    .then (newtonTime) =>
      console.log "Newton time: "
      console.log newtonTime
      @sendCommand('kDGetStoreNames')
    .then =>
      @receiveCommand('kDStoreNames')
    .then (stores) =>
      console.log "store info"
      console.log stores
