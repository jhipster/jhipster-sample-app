module.exports = function(grunt) {
  //grunt plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({

    karma: {
      unit: { configFile: 'karma.conf.js' },
      autotest: {
        configFile: 'karma.conf.js',
        autoWatch: true,
        singleRun: false
      },
      travis: {
        configFile: 'karma.conf.js',
        reporters: 'dots',
        browsers: ['PhantomJS']
      }
    }
  });
};

