const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('src/js/calculatorLoader.js', 'js/calculator.js');

mix.sass('src/scss/calculator.scss', 'css');

mix.webpackConfig({
    output: {
        path: `${__dirname}/public/`
    }
});