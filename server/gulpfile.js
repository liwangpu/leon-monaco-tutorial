const { dest, series, watch } = require("gulp");
const del = require("del");
const ts = require("gulp-typescript");
const sourcemaps = require('gulp-sourcemaps');

function cleanDist(cb) {
    del.sync(["dist/**"]);
    cb();
}


function compileTs(cb) {
    const tsProject = ts.createProject("tsconfig.json");
    tsProject.src()
        .pipe(tsProject())
        .on('error', err => {
            cb();
        })
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.', {
            sourceRoot: function (file) { return file.cwd + '/src'; }
        }))
        .pipe(dest("dist"))
        .on('end', cb);
}


function watchAndReCompile(cb) {
    watch(['src/**/*.ts'], { ignoreInitial: true }, series(compileTs)).on('end', cb);
}

exports.default = series(cleanDist, compileTs, watchAndReCompile);

