module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      dist:
        options: {
          sourceMap: true
        },      
        files: [{
          expand: true,
          cwd: 'src'
          src: './**/*.coffee',
          dest: 'lib'
          ext: '.js'
        },{
          expand: true,
          cwd: 'server'
          src: './**/*.coffee',
          dest: 'server'
          ext: '.js'
        }]
    coffeelint:
      lib:
        files:
          src: ['src/**/*.coffee']
        options:
          # ignore this rule or our command classes will not pass
          camel_case_classes:
            level: 'ignore'

    # just run jshint for tests only because src is coffee
    jshint:
      files: [
        'Gruntfile.js'
        'test/**/*.js'
      ]
      options:
        esversion: 6
        globals:
          console: true
          module: true
          node: true
    watch:
      files: ['src/**/*.coffee', 'server/**/*.coffee', 'test/**/*.js']
      tasks: [
        'coffee'
        'coffeelint'
        'jshint'
        'simplemocha'
      ]
    simplemocha:
      options:
        fullTrace: true
      all:
        src: ['test/**/*.js', '**/*.spec.js']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-simple-mocha'

  grunt.registerTask 'ncu-server', 'start a NCU Server', ->
    done = this.async()
    require('./server.js')

  grunt.registerTask 'test', [
    'coffee'
    'jshint'
    'simplemocha'
  ]
  grunt.registerTask 'default', [
    'coffee'
    'coffeelint'
    'jshint'
    'simplemocha'
  ]
  grunt.registerTask 'server', [
    'coffee'
    'jshint'
    'simplemocha'
    'ncu-server'
  ]
