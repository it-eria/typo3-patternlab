// Requires
const gulp          = require('gulp'),
      sass          = require('gulp-sass'),
      globSass      = require('gulp-sass-glob'),
      autoprefixer  = require('gulp-autoprefixer'),
      cleanCSS      = require('gulp-clean-css'),
      rename        = require('gulp-rename'),
      rigger        = require('gulp-rigger'),
      mustache      = require('gulp-mustache'),
      sourcemap     = require('gulp-sourcemaps'),
      wait          = require('gulp-wait'),
      uglify        = require('gulp-uglify'),
      del           = require('del'),
      stringReplace = require('gulp-string-replace'),
      inject        = require('gulp-inject-string'),
      htmlBeautify  = require('gulp-html-beautify'),
      filenames     = require('gulp-filenames'),
      browserSync   = require('browser-sync').create();


let   path         = require('./pathsConfig.json'),
      serverConfig = require('./serverConfig.json'),
      style = `
        <style>
            body, html {
                margin: 0;
                padding: 0;
            }
            ._pagenavigation {
                display: block;
                list-style: none;
                background-color: #282c34;
                padding: 5px;
                margin: 0;
            }
            ._pagenavigation li {
                display: inline-block;
                margin-right: -5px;
                padding: 0 8px 0 12px;
                border-right: 2px solid #dddddd;
            }
            ._pagenavigation li:first-child {
                padding-left: 0;
            }
            ._pagenavigation li:last-child {
                border: none;
            }
            ._pagenavigation li a {
                color: #3aa9c2;
                text-decoration: none !important;
                font-size: 14px;
                font-family: sans-serif;
            }
        </style>        
      `,
      script = `
        <script>
            let _pageNavigationLink = document.querySelectorAll('._pagenavigation li a'),
                currentUrl = window.location.href,
                pathArr = currentUrl.split('/'),
                currentPage = '/' + pathArr[pathArr.length - 1];
            for(let i = 0; i < _pageNavigationLink.length; i++) {
                let currentElement = _pageNavigationLink[i];
                if(currentElement.getAttribute("href") == currentPage) {
                    currentElement.style.color = "#e06c75";
                }
            }
        </script>
      `
      listOfPages = '';


// Clear Html
gulp.task('clear:html', function() {
    return del([path.clear.html]);
});

// Clear Styles
gulp.task('clear:styles', function() {
    return del([path.clear.styles]);
});

// Clear Scripts
gulp.task('clear:scripts', function() {
    return del([path.clear.scripts]);
});

// Clear Build Dest
gulp.task('clear', gulp.parallel('clear:html', 'clear:styles', 'clear:scripts'));

// Build Style
gulp.task('build:styles', function() {
    return gulp.src(path.src.styles)
        .pipe(wait(500))
        .pipe(globSass())
        .pipe(sourcemap.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 5 versions'],
                cascade: false
            }))
            .pipe(cleanCSS())
            .pipe(rename({
                basename: 'style',
                suffix: '.min'
            }))
        .pipe(sourcemap.write())
        .pipe(gulp.dest(path.build.styles));
});

// Build HTML
gulp.task('build:html', function() {
    return gulp.src(path.src.mustache)
        .pipe(mustache(path.src.json))
        .pipe(stringReplace('--Public--', path.replace.images))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(htmlBeautify())
        .pipe(filenames("pages"))
        .pipe(gulp.dest(path.build.html));
});

// Build Scripts
gulp.task('build:scripts', function() {
    return gulp.src(path.src.scripts)
        .pipe(rigger())
        .pipe(sourcemap.init())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemap.write())
        .pipe(gulp.dest(path.build.scripts));
});

// Start Server
gulp.task('server:start', function() {
    browserSync.init(serverConfig);
    browserSync.watch(path.browserSyncWatch.arr).on('change', browserSync.reload);
});

// Reload Server
gulp.task('server:reload', function(done) {
    browserSync.reload();
    done();
});

// Watch Task
gulp.task('watch', function() {
    // Styles
    gulp.watch(path.watch.styles, gulp.series('build:styles', 'server:reload'));
    // HTML
    gulp.watch([path.watch.mustache, path.watch.json], gulp.series('clear:html','build:html', 'get-pages', 'inject-menu', 'server:reload'));
    // Scripts
    gulp.watch(path.watch.scripts, gulp.series('clear:scripts', 'build:scripts', 'server:reload'));
});

// Build Task
gulp.task('build', gulp.series(
    'clear',
    gulp.parallel('build:styles', 'build:scripts', 'build:html')
));

// Detect start page for browser sync
gulp.task('get-pages', function(done) {
    let files = filenames.get("pages");
    let index = (files.length > 0) ? files[0].substr(0, files[0].length-5) : '';
    listOfPages = '<ul class="_pagenavigation">';

    // Get start page
    serverConfig.startPath = '/'+index;

    // Generate list of pages
    if(files.length > 0) {
        for(let i=0; i<files.length; i++) {
            let currentPage = files[i].substr(0, files[i].length-5);
            listOfPages += '<li><a href="/'+currentPage+'">'+currentPage+'</a></li>';
        }
    }    

    listOfPages += '</ul>';

    filenames.forget("pages");

    done();
});

// Create inject menu
gulp.task('inject-menu', function() {
    return gulp.src('./*.html')
        .pipe(inject.before('</head>', style))
        .pipe(inject.after('<body>', listOfPages))
        .pipe(inject.before('</body>', script))
        .pipe(gulp.dest('./'));
});

// Dev Task
gulp.task('dev', gulp.series(
    'build:styles',
    'build:scripts',
    'build:html',
    'get-pages',
    'inject-menu',
    gulp.parallel('watch', 'server:start')
));