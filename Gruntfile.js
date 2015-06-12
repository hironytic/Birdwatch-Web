module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      options: {
        transform: [ require('grunt-react').browserify ]
      },
      client: {
        src: ['src/**/*.js', 'src/**/*.jsx'],
        dest: 'build/app.js'
      }
    },

    watch: {
      react: {
        files: ['src/**/*.js', 'src/**/*.jsx'],
        tasks: ['browserify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['browserify']);
};
