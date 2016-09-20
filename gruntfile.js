module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mkdir: {
            all: {
                options: {
                    create: [
                        'src/js',
                        'dist/js',
                        'dist/css',
                        'dist/img',
                        'src/sass',
                        'src/img'
                    ]
                }
            }
        },
        'file-creator': {
            basic: {
                'src/sass/global.scss': function (fs, fd, done) {
                    fs.writeSync(fd, '//Import your files here!\n@import "box-sizing";\n@import "vars";\n@import "mixins";\n@import "predefined";\n@import "header";\n@import "main";\n@import "footer";\n');
                    done();
                },
                'src/sass/_box-sizing.scss': function (fs, fd, done) {
                    fs.writeSync(fd, '*,\n*:after,\n*:before {\n    box-sizing: border-box;\n}');
                    done();
                },
                'src/sass/_vars.scss': function (fs, fd, done) {
                    fs.writeSync(fd, '//insert $vars here\n$pathImg: "/dist/img/";\n$white: #ffffff;\n$black: #000000;\n');
                    done();
                },
                'src/sass/_mixins.scss': function (fs, fd, done) {
                    fs.writeSync(fd, '@import "vars";\n\n@mixin svgFallback($svg, $png) {\n    background-image: url("#{$pathImg}#{$png}");\n    background-image: url("#{$pathImg}#{$svg}"), none;\n}\n\n@function str-replace($search, $replace, $subject) {\n    $index: str-index($subject, $search);\n\n    @if $index {\n        @return str-slice($subject, 1, $index - 1) + $replace + str-replace(str-slice($subject, $index + str-length($search)), $search, $replace);\n    }\n\n    @return $subject;\n}\n\n@function pxToRem($px) {\n    //to rem is default\n    //grunt plugin handles rem fallback\n    @if (type_of($px) == string) {\n        $px: str-replace("px", "", $px);\n        $px: str-replace(" ", "", $px);\n    }\n    @return #{($px/16) + "rem"};\n}\n\n@function pxToEm($px) {\n    @if (type_of($px) == string) {\n        $px: str-replace("px", "", $px);\n        $px: str-replace(" ", "", $px);\n    }\n    @return #{($px/16) + "em"};\n}\n\n@function pxToPercent($px) {\n    @if (type_of($px) == string) {\n        $px: str-replace("px", "", $px);\n        $px: str-replace(" ", "", $px);\n    }\n    @return #{(($px/16) * 100) + "%"};\n}\n\n@mixin cf() {\n    &:before, &:after {\n        content: "";\n        display: table;\n    }\n    &:after {\n        clear: both;\n    }\n}\n');
                    done();
                },
                'src/sass/_predefined.scss': function (fs, fd, done) {
                    fs.writeSync(fd, '@import "vars";\n@import "mixins";\n\ndiv.inside {\n    @include cf;\n}\n\n');
                    done();
                },
                'src/sass/_header.scss': function (fs, fd, done) {
                    fs.writeSync(fd, '@import "vars";\n@import "mixins";\n\n#header {\n\n}\n');
                    done();
                },
                'src/sass/_main.scss': function (fs, fd, done) {
                    fs.writeSync(fd, '@import "vars";\n@import "mixins";\n\n#main {\n\n}\n');
                    done();
                },
                'src/sass/_footer.scss': function (fs, fd, done) {
                    fs.writeSync(fd, '@import "vars";\n@import "mixins";\n\n#footer {\n\n}\n');
                    done();
                },
            }
        },
        concat: {
            options: {
                seperator: ";\n",
                sourceMap: true
            },
            dist: {
                // src: ['src/js/**/*.js', 'vendor/jquery/jquery.min.js'] vendor scripts
                src: ['src/js/**/*.js'],
                dest: 'dist/js/global.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapIn: 'dist/js/global.js.map'
            },
            build: {
                src: 'dist/js/global.js',
                dest: 'dist/js/global.min.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'nested',
                    sourcemap: 'auto'
                },
                files: [{
                    expand: true,
                    cwd: 'src/sass/',
                    src: ['**/*.scss'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            }
        },
        //update autoprefixer data: $ npm update caniuse-db
        postcss: {
            options: {
                map: {
                    inline: false
                },
                processors: [
                    require('pixrem')(),
                    require('autoprefixer')({browsers: 'last 2 versions'}),
                    require('cssnano')()
                ]
            },
            dist: {
                src: 'dist/css/global.css'
            }
        },
        imagemin: {
            options: {
                optimizationLevel: 7
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/img/'
                }]
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.svg'],
                    dest: 'dist/img/'
                }]
            }
        },
        watch: {
            scripts: {
                files: ['src/js/**/*.js'],
                tasks: ['js']
            },
            sass: {
                files: ['src/sass/**/*.scss'],
                tasks: ['style']
            },
            img: {
                files: [['src/img/**/*.{png,jpg,gif,svg}']],
                tasks: ['img']
            }
        }
    });

    grunt.registerTask('init', ['mkdir', 'file-creator']);
    grunt.registerTask('js', ['concat', 'uglify']);
    grunt.registerTask('style', ['sass', 'postcss']);
    grunt.registerTask('img', ['newer:imagemin', 'newer:copy']);
    grunt.registerTask('default', ['concat', 'uglify', 'sass', 'postcss', 'imagemin', 'copy']);
};