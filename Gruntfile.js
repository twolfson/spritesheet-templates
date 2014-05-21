module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        // latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,

        strict: false,

        globals: {
          exports: true,
          before: true,
          after: true,
          describe: true,
          it: true
        }
      },
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/*.js']
    },
    watch: {
      files: '<%= lint.files %>>',
      tasks: 'default'
    }
  });

  // Load npm tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Create tasks
  grunt.registerTask('default', ['jshint']);

};
