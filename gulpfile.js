/* crear tareas con gulp
function tarea (done){
    console.log('mi primer tarea');

    //finaliza codigo realizando el callback
    done();
}

// llamar la funcion
exports.tarea = tarea;
*/

const { src, dest, watch, parallel} = require("gulp");// Extraer toda la funcionalidad de gulp

//CSS
const sass = require('gulp-sass')(require('sass'));// importar sass del package.js
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//JS
const terser = require('gulp-terser-js');

//Imagenes
const cache = require('gulp-cache')
const imagemin = require('gulp-imagemin')
const webp= require('gulp-webp');
const avif= require('gulp-avif');


function css(done) {   
    
     src('src/scss/**/*.scss')//Identificar archivo de sass
        .pipe(sourcemaps.init())
        .pipe ( plumber())// evita detener el compilao 
        .pipe( sass() ) //Compilarlo 
        .pipe( postcss ([ autoprefixer(), cssnano() ]))//mejorar css 
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")); //Almacenaren el disco duro

    done();
}

function imagenes( done ){
    const opciones = {
        optimizationLevel:3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe( cache ( imagemin ( opciones ) ) )
        .pipe( dest ('build/img' ) )

    done();
}

function versionWebp (done){
    const opciones ={
        quality:50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe(dest('build/img'))

    done();
}

function versionAvf (done){
    const opciones ={
        quality:50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe(dest('build/img'))

    done();
}

function javascript( done ) {
    src('src/js/**/*.js')
    .pipe(sourcemaps.init() )
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));
    
    done();
}

function dev (done){
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);

    done();
}
exports.css=css;
exports.js=javascript;

exports.imagenes=imagenes;
exports.versionWebp=versionWebp;
exports.versionAvf=versionAvf;
exports.dev= parallel(imagenes, versionAvf, versionWebp, javascript, dev) ;

