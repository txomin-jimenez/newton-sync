DockCommandError = (opts) ->
    this.name = "DockCommandError"
    this.message = "#{opts.errorCode or -9999}: #{opts.reason or 'Dock command failed'}"
    this.errorCode = opts.errorCode or -9999
    this.reason = opts.reason or ""

DockCommandError.prototype = Error.prototype

module.exports = DockCommandError
