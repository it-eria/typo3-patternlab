# About structure:
This is a structure that is ready to create an HTML template for [CMS Typo 3](https://typo3.org/) using the [Gulp](https://gulpjs.com/) task runner, [PatternLab](http://patternlab.io/) approach and templetizer [Mustache](https://mustache.github.io/)

### List of used packages:
* Gulp - **Gulp - Attention! Used version 4 ([Gulp 4](https://github.com/gulpjs/gulp/tree/4.0))**
* [gulp-sass](https://www.npmjs.com/package/gulp-sass)
* [gulp-sass-glob](https://www.npmjs.com/package/gulp-sass-glob)
* [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)
* [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)
* [gulp-rename](https://www.npmjs.com/package/gulp-rename)
* [gulp-rigger](https://www.npmjs.com/package/gulp-rigger)
* [gulp-mustache](https://www.npmjs.com/package/gulp-mustache)
* [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)
* [gulp-wait](https://www.npmjs.com/package/gulp-wait)
* [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
* [gulp-string-replace](https://www.npmjs.com/package/gulp-string-replace)
* [gulp-inject-string](https://www.npmjs.com/package/gulp-inject-string)
* [gulp-html-beautify](https://www.npmjs.com/package/gulp-html-beautify)
* [gulp-filenames](https://www.npmjs.com/package/gulp-filenames)
* [browserSync](https://browsersync.io/)

### How to use
1. Open console window and write: *git clone https://github.com/it-eria/typo3-patternlab.git* 
   or download and unpack archive
2. In console: *npm install* for packages installing
3. In console: *gulp dev* - after this your PC default browser will show demo page created
> The **gulp dev** command is used to create the template. In this mode at the top of the page you can see the menu with all the pages within current project to fast and convenient switching between them.
4. If you want to make the final assembly type in the command line: *gulp build*

### Files and folders:
* **./gulpfile.js** - a file that describes all tasks for the development process (*gulp dev*) and final build (*gulp build*).
* **./package.json** - file with dependencies (it includes all the packages that it uses **_gulpfile.js_**).
* **./pathConfig.json** - here recorded all paths to the files, that are involved in development and  in final assembly of the project.
* **./serverConfig.json** - configuration [browserSync](https://browsersync.io/) of the server.
* **./intro.html** - demo page.
* **./typo3conf/** - directory for [Typo 3 CMS](https://typo3.org/)
* **./typo3conf/ext/as_template/Resources/Private/Patterns/** - folders with templates for development with according to [PatternLab](http://patternlab.io/) principles.
* **./typo3conf/ext/as_template/Resources/Private/Patterns/data.json** a file that contains everything related to HTML markup for all project pages. And from this templates **_\*.mustache_** in directory _./typo3conf/ext/as_template/Resources/Private/Patterns/Pages/_ pick the data.
* **./typo3conf/ext/as_template/Resources/Private/Patterns/Pages/** - In this directory there are templates for the finished pages, that are compiled into the root directory of the project.

### How to create own project:

##### Need to delete:
* **intro.html** from root directory
* All files in folders:
    * **_./typo3conf/ext/as_template/Resources/Private/Patterns/Atoms/_**
    * **_./typo3conf/ext/as_template/Resources/Private/Patterns/Molecules/_**
    * **_./typo3conf/ext/as_template/Resources/Private/Patterns/Organisms/_**
    * **_./typo3conf/ext/as_template/Resources/Private/Patterns/Pages/_**
* Clean all from **data.json** in **_./typo3conf/ext/as_template/Resources/Private/Patterns/_** folder.