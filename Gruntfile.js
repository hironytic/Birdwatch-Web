module.exports = function(grunt) {
  grunt.initConfig({
    react: {
      jsx: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.jsx'],
            dest: 'build',
            ext: '.js'
          }
        ]
      }
    },

    watch: {
      react: {
        files: 'src/**/*.jsx',
        tasks: ['react']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['react']);
};
