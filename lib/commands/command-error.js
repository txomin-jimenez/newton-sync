(function() {
  var DockCommandError;

  DockCommandError = function(opts) {
    this.name = "DockCommandError";
    this.message = (opts.errorCode || -9999) + ": " + (opts.reason || 'Dock command failed');
    this.errorCode = opts.errorCode || -9999;
    return this.reason = opts.reason || "";
  };

  DockCommandError.prototype = Error.prototype;

  module.exports = DockCommandError;

}).call(this);
