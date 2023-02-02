const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.mode || 'development';
const isDev = mode === 'development';
const PORT = process.env.port || 3000;

function buildPlugins() {
    return [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html'),
        }),
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].css',
        }),
    ];
}

function buildLoaders() {
    const babelLoader = {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                    [
                        '@babel/preset-react',
                        {
                            runtime: 'automatic',
                        },
                    ],
                ],
            },
        },
    };

    const cssLoader = {
        test: /\.s[ac]ss$/i,
        use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        auto: (resPath) => Boolean(resPath.includes('.module.')),
                        localIdentName: '[local]__[hash:base64:5]',
                        exportLocalsConvention: 'dashes',
                    },
                },
            },
            'sass-loader',
        ],
    };

    const imagesLoader = {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
    };

    return [babelLoader, cssLoader, imagesLoader];
}

function buildDevServer() {
    return {
        port: PORT,
        historyApiFallback: true,
        open: true,
    };
}

function buildResolves() {
    return {
        extensions: ['.js', '.jsx'],
        preferAbsolute: true,
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        mainFiles: ['index'],
        alias: {}
    };
}

module.exports = {
    mode: mode,
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'build'),
        assetModuleFilename: 'assets/[name].[contenthash][ext]',
        publicPath: '/',
        clean: true,
    },
    plugins: buildPlugins(),
    module: {
        rules: buildLoaders(),
    },
    resolve: buildResolves(),
    devServer: isDev ? buildDevServer() : undefined,
};