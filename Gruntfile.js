var grunt = require('grunt');
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
            src: 'src/<%= pkg.name %>.js',
            dest: 'build/<%= pkg.name %>.min.js'
        }
    },
    karma: {
        unit: {
            configFile: 'karma.conf.js'
        }
    }
});


grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-karma');

grunt.registerTask('default', ['uglify']);
grunt.registerTask('all', ['uglify', 'karma']);