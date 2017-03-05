"use strict"

var gulp = require('gulp');
var del = require('del');
var gulp_sass=require('gulp-sass');
var gulpLoadPlugins = require('gulp-load-plugins'), 
    Plugins = gulpLoadPlugins();
    
var browserSync = require('browser-sync').create(), 
    bsReload = browserSync.reload;

var $CFG = require('./config');
var $CFG_STYLES = $CFG.styles, 
    $CFG_IMG = $CFG.images, 
    $CFG_JS = $CFG.scripts, 
    $CFG_HTML = $CFG.html;
    
/* ****************************************
 * Css 文件处理
 * **************************************** */
gulp.task('clean-css', function() {
    del($CFG_STYLES.dest +'/**/*');
});
gulp.task('concatcss-general', function() {
    return gulp.src($CFG_STYLES.general_source)
    .pipe(Plugins.changed($CFG_STYLES.dest))
    .pipe(gulp_sass())
	.pipe(Plugins.concat($CFG_STYLES.general_file))
	.pipe(gulp.dest($CFG_STYLES.dest))
	.pipe(Plugins.cleanCss($CFG_STYLES.cssMinOptions))
	.pipe(Plugins.debug({title: '创建Css_general:'}))
	.pipe(gulp.dest($CFG_STYLES.dest))
    .pipe(bsReload({ stream: true }));
});

gulp.task('concatscss-quality',function(){
	return gulp.src($CFG_STYLES.quality_source)
	.pipe(Plugins.changed($CFG_STYLES.dest))
	.pipe(gulp_sass())
	.pipe(Plugins.concat($CFG_STYLES.quality_file))
	.pipe(gulp.dest($CFG_STYLES.dest))
	.pipe(Plugins.cleanCss($CFG_STYLES.cssMinOptions))
	.pipe(Plugins.debug({title: '创建Css_quality:'}))
	.pipe(gulp.dest($CFG_STYLES.dest))
  .pipe(bsReload({ stream: true }));
	
});

gulp.task('taskCss', function() {
    var filesArr = [
        '**/*.css', '!'+ $CFG_STYLES.src +'/**/*{-min,.min}.css', 
        '!'+ $CFG_STYLES.src +'/lhui.*.css', 
        '!'+ $CFG_STYLES.src +'/global.*.css', 
        '!'+ $CFG_STYLES.src +'/subpage.*.css'
    ];
    var cssFilter = Plugins.filter(filesArr, {restore: true});
    
    return gulp.src([
        $CFG_STYLES.src +'/**', '!'+ $CFG_STYLES.src +'/lhui.*.css', 
        $CFG_STYLES.src +'/**', '!'+ $CFG_STYLES.src +'/global.*.css', 
        $CFG_STYLES.src +'/**', '!'+ $CFG_STYLES.src +'/subpage.*.css'
    ])
    .pipe(Plugins.changed($CFG_STYLES.dest))
    .pipe(cssFilter)
    .pipe(Plugins.cleanCss($CFG_STYLES.cssMinOptions))
    .pipe(Plugins.debug({title: 'Css打包:'}))
    .pipe(cssFilter.restore)
    .pipe(gulp.dest($CFG_STYLES.dest))
    .pipe(bsReload({ stream: true }));
		
});

/* ****************************************
 * Images 文件处理（不进行图片无损、深度压缩）
 * **************************************** */
gulp.task('clean-images', function() {
    del($CFG_IMG.dest +'/**/*');
});
gulp.task('taskImages', function() {
    return gulp.src($CFG_IMG.src +'/**/*')
    .pipe(Plugins.changed($CFG_IMG.dest))
    .pipe(Plugins.debug({title: 'Images打包:'}))
    .pipe(gulp.dest($CFG_IMG.dest));
});

/* ****************************************
 * Js 文件处理
 * **************************************** */
gulp.task('clean-js', function() {
    del($CFG_JS.dest +'/**/*');
});
gulp.task('taskJs', function() {
    var filesArr = [
        '**/*.js', '!'+ $CFG_JS.src +'/**/*{-min,.min}.js', 
        '!'+ $CFG_JS.src +'/modernizr.js', 
        '!'+ $CFG_JS.src +'/sea.js', 
        '!'+ $CFG_JS.src +'/library/jquery.js', 
		'!'+ $CFG_JS.src +'/library/dist/layer_mobile/{layer,layer.source}.js'
    ];
    var jsFilter = Plugins.filter(filesArr, {restore: true});
    return gulp.src([$CFG_JS.src +'/**'])
    .pipe(Plugins.changed($CFG_JS.dest))
    .pipe(jsFilter)
    .pipe(Plugins.uglify($CFG_JS.uglifyOptions))
    .pipe(Plugins.debug({title: 'Js打包:'}))
    .pipe(jsFilter.restore)
    .pipe(gulp.dest($CFG_JS.dest))
    .pipe(bsReload({ stream: true }));
});

/* ****************************************
 * html 文件处理
 * **************************************** */
gulp.task('clean-html', function() {
    del($CFG_HTML.dest +'/*.html');
});
gulp.task('taskHtml', function() {
    var htmlFilter = Plugins.filter([$CFG_HTML.src +'/*.html', '!'+ $CFG_HTML.src +'/tpl.*.html']);
    return gulp.src([$CFG_HTML.src + '/*.html'])
    //.pipe(Plugins.changed($CFG_HTML.dest))
    .pipe(htmlFilter)
    .pipe(Plugins.fileInclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest($CFG_HTML.dest +'/'))
    .pipe(Plugins.processhtml())
    .pipe(Plugins.debug({title: 'Html打包:'}))
    .pipe(gulp.dest($CFG_HTML.dest +'/'))
    .pipe(bsReload({ stream: true }));
});

/* ****************************************
 * 其他操作处理
 * **************************************** */
gulp.task('build', function(callback) {
    Plugins.sequence(['clean-css', 'clean-images', 'clean-js', 'clean-html'], ['concatcss-general','concatscss-quality'], ['taskCss', 'taskImages', 'taskJs'], 'taskHtml', callback);
});

//创建本地服务器，并且实时更新页面文件
gulp.task('browser-sync', ['build'], function() {
    browserSync.init($CFG.browsersync);
});

gulp.task('default', ['browser-sync'], function() {
    gulp.watch($CFG.watch.styles, ['taskCss','concatcss-general','concatscss-quality']);
    gulp.watch($CFG.watch.images, ['taskImages']);
    gulp.watch($CFG.watch.scripts, ['taskJs']);
    gulp.watch($CFG.watch.html, ['taskHtml']);
	 gulp.watch($CFG.watch.sass_src, ['taskCss','concatcss-general','concatscss-quality']);
});