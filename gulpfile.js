const path = require('path');

const Builder = require('gulp-bem-bundle-builder');
const bundler = require('gulp-bem-bundler-fs');

const gulp = require('gulp');
const debug = require('gulp-debug');
const filter = require('through2-filter').obj;
const merge = require('merge2');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const gulpOneOf = require('gulp-one-of');
const uglify = require('gulp-uglify');

const bemxjst = require('gulp-bem-xjst');
const bemhtml = bemxjst.bemhtml;
const toHtml = bemxjst.toHtml;

const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const postcssEach = require('postcss-each');
const postcssFor = require('postcss-for');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssCalc = require('postcss-calc');
const postcssNested = require('postcss-nested');
const rebemCss = require('rebem-css');
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');
const postcssReporter = require('postcss-reporter');
const csso = require('gulp-csso');

const YENV = process.env.YENV || 'development';
const isProd = YENV === 'production';

const pathToYm = require.resolve('ym');

const builder = Builder({
    levels: [
        'common.blocks',
        'content.blocks'
    ],
    techMap: {
        bemhtml: ['bemhtml.js'],
        js: ['vanilla.js', 'browser.js', 'js'],
        css: ['post.css', 'css']
    }
});
gulp.task('concat-css', () => {
return gulp.src('build/*.css').pipe(concat("style.css"))
.pipe(gulp.dest('build/'))
})

gulp.task('build', () => {
    return bundler('*.bundles/*')
        .pipe(builder({
            // cssdeps: bundle => bundle.src('css', {deps: true})
            //     .pipe(concat(bundle.name + '.css.deps.js')),
            // jsdeps: bundle => bundle.src('js', {deps: true})
            //     .pipe(concat(bundle.name + '.js.deps.js')),
            // bemhtmldeps: bundle => bundle.src('bemhtml', {deps: true})
            //     .pipe(concat(bundle.name + '.bemhtml.deps.js')),
            css: bundle =>
                bundle.src('css')
                    .pipe(gulpOneOf())
                    .pipe(postcss([
                        postcssImport(),
                        postcssEach,
                        postcssFor,
                        postcssSimpleVars(),
                        postcssCalc(),
                        postcssNested,
                        rebemCss,
                        postcssUrl({ url: 'rebase' }),
                        autoprefixer(),
                        postcssReporter()
                    ]))
                    .pipe(concat(bundle.name + '.css'))
                    .pipe(gulpif(isProd, csso())),
            js: () =>
                    gulp.src('desktop.bundles/index/index.js')
                    .pipe(concat('script.js'))
                    .pipe(gulpif(isProd, uglify())),
            tmpls: bundle =>
                bundle.src('bemhtml')
                    .pipe(concat('any.bemhtml.js'))
                    .pipe(bemhtml({ elemJsInstances: true }))
                    .pipe(concat('script.bemhtml.js')),
            html: bundle => {
                const bemhtmlApply = () => toHtml(bundle.target('tmpls'));
                return gulp.src(bundle.dirname + '/*.bemjson.js')
                    .pipe(bemhtmlApply());
            }
        }))
       .on('error', console.error)
       .pipe(debug())
       .pipe(gulp.dest('build/'))
});

gulp.task('default', gulp.series('build', 'concat-css'));
