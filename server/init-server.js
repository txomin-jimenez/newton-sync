(function() {
  var NewtonSync, _, ncuServer;

  NewtonSync = require('../lib/newton-sync');

  _ = require('lodash');

  ncuServer = new NewtonSync.server();

  ncuServer.on('new-session', function(sessionObj) {
    console.log("New session init " + sessionObj.id);
    sessionObj.on("initialized", function(newtonDevice) {
      console.log("Session " + sessionObj.id + " initialized");
      console.log("Newton device: ID: " + newtonDevice.fNewtonID + ". Name: " + newtonDevice.name);
    });
    sessionObj.on("error", function(error) {
      console.log("session " + sessionObj.id + " error:");
      return console.log(error);
    });
    return sessionObj.on("finished", function() {
      return console.log("session " + sessionObj.id + " finished");
    });
  });

}).call(this);

//# sourceMappingURL=init-server.js.map
