module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      dist:
        files: [{
          expand: true,
          cwd: 'src'
          src: './**/*.coffee',
          dest: 'lib'
          ext: '.js'
        }]
    coffeelint:
      lib: ['src/**/*.coffee']
    # just run jshint for tests only because src is coffee
    jshint:
      files: [
        'Gruntfile.js'
        'test/**/*.js'
      ]
      options: globals:
        console: true
        module: true
        node: true
    watch:
      files: ['src/**/*.coffee', 'test/**/*.js']
      tasks: [
        'coffee'
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
  grunt.registerTask 'test', [
    'coffee'
    'jshint'
    'simplemocha'
  ]
  grunt.registerTask 'default', [
    'coffee'
    'jshint'
    'simplemocha'
  ]
