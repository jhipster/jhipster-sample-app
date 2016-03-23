(function () {
  'use strict';

  var BANNER =
    '/**\n' +
    ' * Angular Dynamic Locale - <%= pkg.version %>\n' +
    ' * https://github.com/lgalfaso/angular-dynamic-locale\n' +
    ' * License: MIT\n' +
    ' */\n';

  module.exports = function(grunt) {
    //grunt plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-npm');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      jshint: {
        all: ['Gruntfile.js', 'src/*.js', 'test/*.js']
      },
      jscs: {
        src: ['src/**/*.js', 'test/**/*.js'],
        options: {
          config: ".jscs.json"
        }
      },
      karma: {
        unit: { configFile: 'karma.conf.js' },
        'unit.min': {
          configFile: 'karma.min.conf.js'
        },
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
      },
      concat: {
        options: {
          banner: BANNER,
        },
        dist: {
          src: ['src/tmhDynamicLocale.js'],
          dest: 'dist/tmhDynamicLocale.js',
        },
      },
      uglify: {
        all: {
          files: {
            'tmhDynamicLocale.min.js': ['src/*.js'],
            'dist/tmhDynamicLocale.min.js': ['src/*.js']
          },
          options: {
            banner: BANNER,
            sourceMap: true
          }
        }
      },
      bump: {
        options: {
          files: ['package.json', 'bower.json'],
          commitFiles: ['package.json', 'bower.json'],
          tagName: '%VERSION%'
        }
      },
      'npm-publish': {
         options: {
           requires: ['jshint', 'karma:unit'],
           abortIfDirty: true
         }
      }
    });
    grunt.registerTask('release', ['jshint', 'jscs', 'karma:unit', 'uglify:all', 'karma:unit.min', 'publish']);
  };
}());

