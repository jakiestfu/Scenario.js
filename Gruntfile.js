var fs = require('fs');

module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json');

    var banner = [ "<%= pkg.name %> v<%= pkg.version %>", "The MIT License (MIT)", "Copyright (c) 2014 <%= pkg.author %>" ].join("\n * ").trim();

    grunt.initConfig({

        pkg: pkg,

        uglify: {
            options: {
                banner: "/* " + banner + " */\n",
                preserveComments: 'some',
                footer: "Scenario.version='<%= pkg.version %>';"
            },
            main: {
                files: {
                    'dist/scenario.min.js': ['src/scenario.js'],
                }
            }
        },

        jshint: {
            all: ['src/scenario.js']
        },

        watch: {
            scripts: {
                files: 'src/*.js',
                tasks: ['jshint', 'uglify']
            },
            manifests: {
                files: ['package.json'],
                tasks: ['sync_versions']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Custom task
    grunt.registerTask('sync_versions', 'Keeps versions in sync between NPM and Bower', function(){
        var bower = {
            name: pkg.name,
            author: pkg.author,
            version: pkg.version,
            main: 'dist/scenario.min.js'
        };
        fs.writeFileSync('bower.json', JSON.stringify(bower, null, "\t"));
    });

    grunt.registerTask('default', ['jshint', 'uglify', 'sync_versions']);
    grunt.registerTask('develop', ['jshint', 'uglify', 'sync_versions', 'watch']);
};
