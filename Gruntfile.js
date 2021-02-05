module.exports = function(grunt) {
    grunt.initConfig({
        env: process.env.NODE_ENV,
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: false,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target: {
              files: {
                'dist/js/index_fun.js': ['src/js/index_fun.js'],
                'dist/js/accessories_fun.js': ['src/js/accessories_fun.js'],
              }
            }
        },
        concat: {
            basic_and_extras: {
                files: {
                    'dist/index.html': ['src/html/include/header.html', 'src/html/index.html', 'src/html/include/footer.html'],
                    'dist/accessories.html': ['src/html/include/header.html', 'src/html/accessories.html', 'src/html/include/footer.html'],
                    'dist/confirm_email.html': ['src/html/confirm_email.html'],
                },
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [{
                        match: 'LIVE RELOAD SCRIPT',
                        replacement: function (patten, line_num, target_txt, target_file_name) {
                            var replace_str='';
                            if(process.env.NODE_ENV == "development"){
                                replace_str = '<script src="//localhost:35729/livereload.js"></script>';
                            }
                            return replace_str;
                        }
                    },{
                        match: 'DOMAIN',
                        replacement: function (patten, line_num, target_txt, target_file_name) {
                            var replace_str='https://new-arcades.atgames.net/wp-content/uploads';
                            if(process.env.NODE_ENV == "development"){
                                replace_str = 'img';
                            }
                            return replace_str;
                        }
                    }]
                },
                files: [
                    { expand: true, flatten: true, src: [
                        'dist/index.html',
                        'dist/accessories.html',
                    ], dest: 'dist/'}
                ]
            }
        },
        less: {
            options: {
                compress: true,
                yuicompress: true,
                optimization: 2
            },
            styles: {
                files: {
                    'dist/css/index_style.css': ['src/less/index_style.less'],
                    'dist/css/accessories_style.css': ['src/less/accessories_style.less'],
                }
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, flatten: true, src: ['src/img/**'], dest: 'dist/img/', filter: 'isFile' }
                ]
            }
        },
        watch: {
          express: {
            files:  [ 'src/**/*.html', 'src/js/*.js', 'src/less/*.less'],
            tasks:  [ 'uglify','concat', 'replace', 'less', 'express:dev' ],
            options: {
              livereload: true,
              spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
            }
          }
        },
        express: {
          options: {
          },
          dev: {
            options: {
              script: 'server.js',
              node_env: 'development'
            }
          }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('assemble-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['copy', 'uglify', 'concat', 'less', 'express:dev', 'replace', 'watch']);
    grunt.registerTask('pack', ['copy', 'uglify', 'concat', 'less', 'replace']);
};