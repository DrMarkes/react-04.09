// Работа с файловой системой
const path = require('path');
// Плагин для проверки SASS
const SassLintPlugin = require('sass-lint-webpack');
// Плагин для извлечения css в отдельные файлы
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// Плагин для использования html-шаблонов
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Плагин для хеширования
const WebpackMd5Hash = require('webpack-md5-hash');
// Плагин для чистки папки dist
const CleanWebpackPlugin = require('clean-webpack-plugin');
// Плагин автообновления страницы
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
// Доступ к плагинам webpack
const webpack = require('webpack');

module.exports = {
    // точки входа
    entry: {
        // путь к точке входа - исходнику
        main: path.resolve(__dirname, 'src', 'js', 'index.js')
    },
    output: {
        // папка для выгрузки результатов сборки
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.[chunkhash].js'
    },
    devtool: false,
    plugins: [
        new CleanWebpackPlugin(path.resolve(__dirname, 'dist'), {} ),
        new MiniCssExtractPlugin({
            filename: 'app.[hash].css'
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            // путь к шаблону html файла index.html
            template: path.resolve(__dirname, 'src', 'index.html'),
            // имя файла в конечной сборке
            filename: 'index.html'
        }),
        new WebpackMd5Hash(),
        new BrowserSyncPlugin({
            // локальный сервер находится по адресу http://localhost:3000/
            host: 'localhost',
            port: 3000,
            // папка со сборкой, используемая в качестве корневой для сервера
            server: { baseDir: ['dist'] }
        }),
        // создаем карты исходников
        new webpack.SourceMapDevToolPlugin(),
        // проверяем SASS
        new SassLintPlugin()
],
    module: {
        rules: [
            // настраиваем обработку js-файлов в babel
            {
                // шаблон для обрабатываемых файлов
                test: /\.js$/,
                // файлы, исключенные из обработки
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            // настраиваем проверку js-файлов в eslint
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            // настраиваем обработку scss-файлов
            {
                test: /\.scss$/,
                use: [
                    // Добавляем экспорт модуля в качестве стиля в DOM
                    'style-loader',
                    // Разбираем файлы CSS
                    MiniCssExtractPlugin.loader,
                    // Загружаем файл CSS с разрешенным импортом и возвращает код CSS
                    'css-loader',
                    // оптимизируем css
                    'clean-css-loader',
                    // добавляем префиксы
                    'postcss-loader',
                    // загружает и преобразует scss-файлы в css
                    'sass-loader'
                ]
            },
            // настраиваем обработку изображений
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    }
};
