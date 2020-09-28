/**
 * -----------------------------------------------------------------------------
 * 🧩 PLUGINS AND PATHS
 * -----------------------------------------------------------------------------
 */
// #region

// ☝️🧐 In order to build a Jekyll site and run a local server,
// it is preferable to keep package.json, node_modules and execute gulp commands
// within the source directory.

// ☝️🧐 The combination of Jekyll built-in server + gulp watchers + Chrome Live
// Reload Extension is much more faster than the 'gulp only' process.
// And the first workflow allows us to use extension-free links.

// The last option: symlink
const {
  src, dest, watch, series, parallel, lastRun,
} = require('gulp');

const browserSync = require('browser-sync').create();
const changed     = require('gulp-changed');
const child       = require('child_process');
const gulpif      = require('gulp-if');
// const newer       = require('gulp-newer');
// Prevent pipe breaking caused by errors from gulp plugins
const plumber     = require('gulp-plumber');
const size        = require('gulp-size');
const sourcemaps  = require('gulp-sourcemaps');
const yargs       = require('yargs').alias('p', 'production');

// Look for the --p flag
const PRODUCTION  = !!(yargs.argv.production);

// Paths
const root = {
  base: '.',
  src: './src',
  // It is better to stick to the system standards to avoid errors.
  tmp: './a',
  dest: {
    site: './_site',
    assets: './_site/a',
    build: './.publish',
  },
};

const paths = {
  css: {
    src: {
      main: `${root.src}/main.scss`,
      head: [
        `${root.src}/pages/wip/head-front.scss`,
        `${root.src}/pages/wip/head.scss`,
      ],
      cjk: `${root.src}/cjk.scss`,
      critical: `${root.src}/critical.scss`,
    },
    watch: `${root.src}/**/*.scss`,
    tmp: `${root.src}/css`,
    dest: `${root.dest.assets}/css`,
  },

  jekyll: {
    docs: [
      `${root.base}/*.html`,
      `${root.base}/_config.yml`, `${root.base}/_data/*.yml`,
      `${root.base}/_includes/*.html`,
      `${root.base}/_layouts/*.html`,
      `${root.base}/_posts/*.*`,
    ],
  },

  markup: {
    src: {
      pug: [
        `${root.src}/**/*.pug`,
        `!${root.src}/**/_*.pug`,
        `!${root.src}/pages/base/*.pug`,
      ],
      html: `${root.dest.site}/**/*.html`,
      wip: [
        `${root.src}/pages/wip/*.html`,
      ],
    },
    watch: `${root.src}/**/*.pug`,
    dest: `${root.src}`,
  },

  img: {
    src: {
      graphics: [
        `${root.src}/**/*.+(jpg|jpeg|png|svg|gif|webp)`,
        `!${root.src}/base/graphics/sprite/*{,/**}`,
        `!${root.src}/pages/wip/*`,
        `!${root.src}/img/**/*`,
      ],
      content: `${root.src}/img/**/*.+(jpg|jpeg|png|svg|gif|webp)`,
    },
    // Vars array in watchers breaks build process, so there is one var for a watcher
    watch: [
      `${root.src}/**/*.+(jpg|jpeg|png|svg|gif|webp)`,
      `!${root.src}/base/graphics/sprite*{,/**}`,
    ],
    dest: `${root.dest.assets}/img`,
  },

  js: {
    src: {
      main: [
        `${root.src}/**/*.js`,
        `!${root.src}/ts/**/*.js`,
        `!${root.src}/js/vendor/*.js`,
      ],
      plugins: [
        `${root.src}/js/vendor/jquery.mobile.custom.js`,
        // './node_modules/popper.js/dist/umd/popper.js',
        './node_modules/bootstrap/js/dist/util.js',
        './node_modules/bootstrap/js/dist/alert.js',
        './node_modules/bootstrap/js/dist/button.js',
        './node_modules/bootstrap/js/dist/carousel.js',
        './node_modules/bootstrap/js/dist/collapse.js',
        './node_modules/bootstrap/js/dist/dropdown.js',
        './node_modules/bootstrap/js/dist/modal.js',
        './node_modules/magnific-popup/dist/jquery.magnific-popup.js',
        './node_modules/jquery-sticky/jquery.sticky.js',
        './node_modules/is-in-viewport/lib/isInViewport.js',
      ],
      unoptimized: [
        `${root.src}/js/vendor/*.js`,
        `!${root.src}/js/vendor/jquery.mobile.custom.js`,
      ],
    },
    dest: `${root.dest.assets}/js`,
  },

  sprite: {
    src: {
      main: `${root.src}/base/graphics/sprite/*.svg`,
      cjk: `${root.src}/base/graphics/sprite/cjk/*.svg`,
    },
    dest: `${root.src}/base/graphics`,
  },

};
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🧪 JEKYLL
 * -----------------------------------------------------------------------------
 */
// #region

const shell = require('shelljs');

function jekyllBuild(done) {
  let command;

  if (PRODUCTION) {
    command = shell.exec('JEKYLL_ENV=production jekyll build');
    done();
  }

  if (!PRODUCTION) {
    command = shell.exec('bundle exec jekyll build --config _config.yml');
    // command = shell.exec('bundle exec jekyll build --config _config.yml,_config.dev.yml');
    // command = child.spawn('bundle', ['exec', 'jekyll', 'build', '--config', '_config.yml,_config.dev.yml'], { stdio: 'inherit' });
    done();
  }
  return command;
}

function jekyllServe(done) {
  child.spawn(
    'jekyll',
    // ['serve', '--host=192.168.0.14', '--watch', '--incremental', '--drafts'],
    ['serve', '--watch', '--incremental', '--drafts', '--config', '_config.yml'],
    { stdio: 'inherit' },
  );
  done();
}
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🎨 STYLES
 * -----------------------------------------------------------------------------
 */
// #region

const autoprefixer = require('gulp-autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const sass         = require('gulp-sass');
const postcss      = require('gulp-postcss');
const uncss        = require('postcss-uncss');

// COMMON STYLES FUNCTION
const cssTasks = (
  source, subtitle, uncssHTML, destination, link = true,
) => src(source)
  .pipe(changed(paths.css.dest))
  .pipe(plumber())
  .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
  .pipe(sass({
    precision: 4,
    includePaths: ['.'],
  }).on('error', sass.logError))
  // autoprefixer (browserslist) has been set in package.json
  .pipe(autoprefixer({ cascade: false }))
  .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
  .pipe(dest(paths.css.tmp))
  .pipe(
    gulpif(
      PRODUCTION,
      gulpif(
        link,
        postcss([
          uncss({
            html: uncssHTML,
            ignore: [
              /* eslint-disable max-len */
              // Bootstrap & Magnific Popup
              /\.carousel([-_]+[a-zA-Z]+)?/, /\.collaps(-[a-zA-Z]+)?/, /\.collapse?(ing)?/, /\.dropdown([-_]+[a-zA-Z]+)?/, /\.mfp(-[a-zA-Z]+)?/, /\.modal(-_[a-z]+)?/, /\w\.fade/, /\w\.open/,

              // Custom
              /\.[hs]laquo-[a-z0-9]+/, '.vk', 'iframe', /\.[mp][bt]-[a-z0-9]+/,

              // Legacy
              '.breadcrumb-item', '.has-icon.event::before', '.media-wrapper.has-lg-img', '.play-it', '.rail', '.section-news', '.snuggled-right', '.vr-friendly', 'figure.small-portrait', 'li:nth-child(n+6)', /\.d-lg-[a-z]+/, /\.metric\.[a-zA-Z]+/, /\.mosaic\.[a-zA-Z-]+/, /\.page-header-(map-wrapper|preloader)/, /\.pager-(first|last|previous)/, /\.pic-deputy\.col-md-3/, /\.search-(cancel|headline|reset|toggler)/, /\.sec-illustrated-[lr] img/, /\w\.hidden/, /\w\.left/,
              /* eslint-enable max-len */
            ],
          }),
        ]),
      ),
    ),
  )
  .pipe(gulpif(PRODUCTION, cleanCSS({ level: { 1: { specialComments: 0 } } })))
  .pipe(size({ title: `styles: ${subtitle}` }))
  .pipe(dest(destination))
  .pipe(browserSync.stream());

// MAIN
function cssMain(done) {
  cssTasks(
    paths.css.src.main, // src
    'main', // subtitle
    // uncssHTML; use array syntax for normal results
    [
      `${root.src}/pages/wip/uncss/*.html`,
      `!${root.src}/pages/wip/uncss/cjk.html`,
    ],
    paths.css.dest,
  );
  done();
}

// CJK
function cssCJK(done) {
  cssTasks(
    paths.css.src.cjk, // src
    'CJK', // subtitle
    // uncssHTML; use array syntax for normal results
    [`${root.src}/pages/wip/uncss/cjk.html`],
    paths.css.dest,
  );
  done();
}

// HEAD
function cssHead(done) {
  cssTasks(
    paths.css.src.head, // src
    'head', // subtitle
    '', // uncss
    paths.css.dest,
    false,
  );
  done();
}

// STYLES BUILD
const css = parallel(
  cssHead,
  cssCJK,
  cssMain,
);
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🖼 IMAGES / MEDIA
 * -----------------------------------------------------------------------------
 */
// #region

const imagemin    = require('gulp-imagemin');
const imageminGIF = require('imagemin-gifsicle');
const imageminJPG = require('imagemin-mozjpeg');
const imageminPNG = require('imagemin-pngquant');
const imageminSVG = require('imagemin-svgo');
const rename      = require('gulp-rename');

// Common images function
function imgTasks(source, subtitle, changePaths = false) {
  return src(source)
    .pipe(changed(paths.img.dest))
    .pipe(
      imagemin(
        [
          imageminGIF({
            interlaced: true,
            optimizationLevel: 3,
          }),
          imageminJPG({ quality: 85 }),
          imageminPNG([0.8, 0.9]),
          imageminSVG({
            plugins: [
              { removeViewBox: false },
              { cleanupIDs: false },
            ],
          }),
        ],
        { verbose: true },
      ),
    )
    .pipe(
      gulpif(
        changePaths,
        rename((path) => {
        /* eslint-disable no-param-reassign */
          path.dirname = path.dirname.replace('base', '');
          path.dirname = path.dirname.replace('structures', '');
          path.dirname = path.dirname.replace('hero', 'jumbotron');
          path.dirname = path.dirname.replace('components', '');
          path.dirname = path.dirname.replace('card/polylog-promo', 'polylog-promo');
          path.dirname = path.dirname.replace('pages', '');
          path.dirname = path.dirname.replace('front', 'p-front');
          path.dirname = path.dirname.replace('careers', 's-careers');
          path.dirname = path.dirname.replace('company', 's-company');
          path.dirname = path.dirname.replace('projects', 's-projects');
          path.dirname = path.dirname.replace('services', 's-services');
          // path.dirname = path.dirname.replace('services/fundraising', 's-services/fundraising');
        /* eslint-enable no-param-reassign */
        }),
      ),
    )
    .pipe(dest(paths.img.dest))
    .pipe(size({ title: `images: ${subtitle}` }));
}

// Graphics
function imgGraphics(done) {
  imgTasks(
    paths.img.src.graphics, // src
    'graphics', // subtitle
    true,
  );
  done();
}

function imgContent(done) {
  imgTasks(
    paths.img.src.content, // src
    'content', // subtitle
  );
  done();
}

// OPTIMIZE
const img = parallel(
  imgGraphics,
  imgContent,
);

// COPY OLD MEDIA
function copyImg() {
  return src('./a/img/**/*', { base: './a/', since: lastRun(copyImg) })
    .pipe(dest('./_site/a/'));
}

function copyUpload() {
  return src('./a/upload/**/*', { base: './a/', since: lastRun(copyUpload) })
    .pipe(dest('./_site/a/'));
}

function copyPDF() {
  return src('./a/pdf/**/*', { base: './a/', since: lastRun(copyPDF) })
    .pipe(dest('./_site/a/'));
}

function copyVideo() {
  return src('./a/video/**/*', { base: './a/', since: lastRun(copyVideo) })
    .pipe(dest('./_site/a/'));
}

const copyMedia = parallel(
  copyImg,
  copyUpload,
  copyPDF,
  copyVideo,
);
// #endregion

/**
 * -----------------------------------------------------------------------------
 * ❤️ SVG SPRITE
 * -----------------------------------------------------------------------------
 */
// #region

const svgSprite = require('gulp-svg-sprite');

// 2020 theme
function svg() {
  return src(paths.sprite.src.main)
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest: '.', // Mode specific output directory
          sprite: 'sprite.svg', // Sprite path and name
          prefix: '.', // Prefix for CSS selectors
          dimensions: '', // Suffix for dimension CSS selectors
          example: true, // Create an HTML example document
        },
      },
      svg: {
        xmlDeclaration: false, // strip out the XML attribute
        doctypeDeclaration: false, // don't include the !DOCTYPE declaration
      },
    }))
    .pipe(dest(paths.sprite.dest));
}

// 2017 theme
function svgLegacy() {
  return src(paths.sprite.src.main)
    .pipe(svgSprite({
      shape: {
        spacing: {
          padding: 4,
        },
      },
      mode: {
        css: {
          sprite: '../sprite.svg',
          bust: false,
          render: {
            scss: {
              dest: '../_icon.scss',
              template: `${root.src}/base/graphics/_icon-template.mustache`,
            },
          },
        },
      },
    }))
    .pipe(dest(paths.sprite.dest));
}

function svgCJK() {
  return src(paths.sprite.src.cjk)
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest: '.', // Mode specific output directory
          sprite: 'sprite-cjk.svg', // Sprite path and name
          prefix: '.', // Prefix for CSS selectors
          dimensions: '', // Suffix for dimension CSS selectors
          example: true, // Create an HTML example document
        },
      },
      svg: {
        xmlDeclaration: false, // strip out the XML attribute
        doctypeDeclaration: false, // don't include the !DOCTYPE declaration
      },
    }))
    .pipe(dest(paths.sprite.dest));
}

const sprite = series(
  // svg,
  svgLegacy,
  svgCJK,
  parallel(cssMain, imgGraphics),
);
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 📰 MARKUP
 * -----------------------------------------------------------------------------
 */
// #region

// PUG
const gutil = require('gulp-util');
const pug   = require('gulp-pug');

function pugBuild() {
  return src(paths.markup.src.pug)
    .pipe(plumber())
    .pipe(pug({
      doctype: 'html',
      pretty: true,
      basedir: root.src,
    }))
    .pipe(size({ title: 'html' }))
    .pipe(dest(paths.markup.dest))
    .on('error', gutil.log);
}

// MINIMIZE HTML
// 'gulp html' does nothing; 'gulp html --p' minifies

const htmlmin = require('gulp-htmlmin');

function html(done) {
  src(paths.markup.src.html)
    .pipe(
      gulpif(
        PRODUCTION,
        htmlmin({
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: false,
          removeAttributeQuotes: false,
          removeRedundantAttributes: false,
          minifyJS: true,
          minifyCSS: true,
        }),
      ),
    )
    .pipe(gulpif(PRODUCTION, size({ title: 'optimized HTML' })))
    .pipe(dest(paths.markup.dest));
  done();
}

// COPY WIP HTML TO _SITE
function copyWIP() {
  return src(paths.markup.src.wip)
    .pipe(dest(root.dest.site));
}
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 💾 SCRIPTS
 * -----------------------------------------------------------------------------
 */
// #region

const babel  = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

// Common scripts function
const jsTasks = (source, file, task, compiler) => src(source)
  .pipe(changed(paths.js.dest))
  .pipe(plumber())
  // Use webpack instead others
  // .pipe(webpackstream(webpackconfig, webpack))
  .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
  .pipe(gulpif(compiler, babel({ presets: ['@babel/env'] })))
  .pipe(concat(`${file}.js`))
  .pipe(uglify())
  .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
  .pipe(size({ title: `scripts: ${file}` }))
  .pipe(dest(paths.js.dest))
  .pipe(browserSync.stream());

// Plugins
function jsPlugins(done) {
  jsTasks(
    paths.js.src.plugins, // src
    'plugins', // file
  );
  done();
}

// Main
function jsMain(done) {
  jsTasks(
    paths.js.src.main, // src
    'main', // file
    true,
  );
  done();
}

function jsUnoptimized() {
  return src(paths.js.src.unoptimized, { base: `${root.src}/js/`, since: lastRun(jsUnoptimized) })
    .pipe(changed(paths.js.dest))
    .pipe(size({ title: 'unoptimized scripts' }))
    .pipe(dest(paths.js.dest));
}

// SCRIPTS BUILD
const js = parallel(
  jsUnoptimized,
  jsPlugins,
  jsMain,
);

/*
Use pipeline method for uglify debugging
https://github.com/terinjokes/gulp-uglify/tree/master/docs/why-use-pipeline#using-pipelines
*/
// #endregion

// Typescript
// 😫 It does not work. Use `shell.exec('tsc **/*.ts')` see Jekyll Tasks
// #region

const typescript = require('gulp-typescript');

const tsProject = typescript.createProject('tsconfig.json');

function ts() {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(dest(paths.js.dest));
}

// function ts() {
//   return src(paths.js.src.ts)
//     .pipe(typescript({
//       noImplicitAny: true,
//       outFile: 'output.js',
//     }))
//     .pipe(dest(paths.js.dest));
// }

exports.ts = ts;
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🛠 UTILITIES
 * -----------------------------------------------------------------------------
 */
// #region

// CLEAN
const del = require('del');

// Docs
function clean() {
  return del([
    `${root.base}/.jekyll-metadata`,
    `${root.dest.site}/**/*`,
    `!${root.dest.site}/a`,
    `!${root.dest.site}/CNAME`,
    `!${root.dest.site}/favicon.ico`,
    `!${root.dest.site}/manifest.json`,
    `!${root.dest.site}/.htaccess`,
    `!${root.dest.site}/robots.txt`,
  ]);
}

// Assets
function cleanAssets() {
  return del([
    `${paths.css.dest}/**/*`,
    `${paths.js.dest}/**/*`,
    /* don't delete images - there are too many of them to create a new bunch
    each time */
  ]);
}

function cleanSrc() {
  return del([`${root.src}/**/*.css`]);
}

// CLEAN _site with all assets and Jekyll caches
function cleanAll(done) {
  child.exec('bundle exec jekyll clean', (err, stdout, stderr) => {
    /* eslint-disable no-console */
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
}
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 📶 SERVER
 * -----------------------------------------------------------------------------
 */
// #region

const { reload } = browserSync;

function watchFiles() {
  watch(paths.css.watch, series(css));
  watch(paths.js.src.main, series(jsMain));
  watch(paths.img.watch).on('change', series(img, reload));
  watch(paths.jekyll.docs, series(jekyllBuild));
}

const serve = series(
  clean,
  jekyllBuild,
  svg,
  img,
  parallel(css, js),
  parallel(jekyllServe, watchFiles),
);

const serveLight = series(
  clean,
  jekyllBuild,
  parallel(css, js),
  parallel(jekyllServe, watchFiles),
);

// WIP pages

/* Use Browsersync for testing on mobile devices. Use html paths instead
extension-free permalinks */
function serveBS(done) {
  browserSync.init({
    server: {
      baseDir: root.dest.site,
    },
    port: 9000,
    notify: false,
  });
  watchFiles();
  watch(paths.markup.src.wip).on('change', series(copyWIP, reload));
  done();
}
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🏗 BUILD / DEFAULT
 * -----------------------------------------------------------------------------
 */
// #region

const build = series(
  clean,
  cleanSrc,
  jekyllBuild,
  svg,
  svgCJK,
  svgLegacy,
  img,
  parallel(copyMedia, css, js),
);

const buildAssets = series(
  svg,
  svgCJK,
  svgLegacy,
  img,
  parallel(copyMedia, css, js),
);
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 📤 DEPLOY
 * -----------------------------------------------------------------------------
 */
// #region
// https://webdesign-master.ru/blog/tools/2017-06-13-gulp-rsync.html

const gulpRsync = require('gulp-rsync');

function rsync() {
  return src(`${root.dest.site}/**/*`)
    .pipe(gulpRsync({
      root: `${root.dest.site}/`,
      hostname: 'a192664_poly590@polylog.ru',
      destination: 'httpdocs/',
      // Includes files to deploy
      include: ['*.htaccess'],
      // Excludes files from deploy
      exclude: ['/a/', '**/Thumbs.db', '**/*.DS_Store'],
      recursive: true,
      archive: true,
      silent: false,
      compress: true,
    }));
}

// #endregion

/**
 * -----------------------------------------------------------------------------
 * ☑️ TASKS
 * -----------------------------------------------------------------------------
 */

/* eslint-disable no-multi-spaces */
exports.pdf         = copyPDF;
exports.a           = copyMedia;
exports.cleanSrc    = cleanSrc;
exports.cleanAssets = cleanAssets;
exports.cleanAll    = cleanAll;
exports.clean       = clean;
exports.pug         = pugBuild;
exports.cp          = copyWIP;
exports.html        = html;
exports.sprite      = sprite;
exports.imgg        = imgGraphics;
exports.img         = img;
exports.jsu         = jsUnoptimized;
exports.jsp         = jsPlugins;
exports.jsm         = jsMain;
exports.js          = js;
exports.css         = css;
exports.ba          = buildAssets;
exports.j           = jekyllBuild;
exports.jks         = jekyllServe;
exports.w           = watchFiles;
// exports.deploy      = deploy;
exports.rsync       = rsync;
exports.bs          = serveBS;
exports.sFull       = serve;
exports.s           = serveLight;
exports.default     = build;
