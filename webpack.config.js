const website = {
    // 配置静态CDN
    publicPath: 'http://127.0.0.1:8080/',
    // 是否为调试模式
    isDev : process.env.NODE_ENV === 'development'
}

// 引入path
const path = require('path')

// 引入node的glob对象
const glob = require('glob')

// 引入webpack模块
const webpack = require('webpack')

// webpack中内置的js压缩插件，存放在webpack的optimize对象下
// 缓存插件名称，以便简化后面的配置
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

// html-webpack-plugin插件
const htmlPlugin = require('html-webpack-plugin')

// 文件分离插件
const extractTextPlugin = require('extract-text-webpack-plugin')

// html-withimg-loader用于处理HTML中的图片
const htmlWithimgLoader = require('html-withimg-loader')

// purifycss-webpack插件，消除html中未使用的CSS代码
const purifyCSSPlugin = require('purifycss-webpack')

const config = {
    target: 'web',
    context: path.resolve(__dirname, 'src'),
    // 入口文件的配置项，可以是单一入口，也可以是多入口。
    // 如果此处为多入口，则出口必须配置多出口，否则会报"Conflict: Multiple assets emit to the same filename"
    entry: {
        // main: path.resolve(__dirname, 'src/main.js'),
        app: path.resolve(__dirname, 'src/app.js'),
        jquery: 'jquery',
    },
    // 出口文件的配置项，webpack2.X版本后，支持多出口配置。
    output: {
        // 输出的路径，Node语法
        path: path.resolve(__dirname, 'dist'),
        // 输出的文件名称（配置规则：[name]-入口名称,[hash:5]-5位hash值,[chunkhash]）
        filename: '[name].js',
        publicPath: website.publicPath,
    },
    // 模块：主要是解析CSS和图片转换压缩等功能。
    // 注意rules是数组！！
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: "babel-loader",
                query: {
                    presets: ['latest','react']
                }
            },{
                test: /\.css$/,
                include: path.resolve(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules'),
                // use: [ 'style-loader', 'css-loader' ],
                use: extractTextPlugin.extract({
                    fallback:'style-loader',
                    use: [{
                        loader:'css-loader',
                        options: {
                            importLoaders: 1    // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                        }
                    },{
                        loader:'postcss-loader'
                    }]
                })
            },{
                test: /\.less$/,
                include: path.resolve(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules'),
                // use: [ 'style-loader', 'css-loader', 'less-loader' ],
                use: extractTextPlugin.extract({
                    fallback:'style-loader',
                    use: [{
                        loader:'css-loader',
                        options: {
                            importLoaders: 1    // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                        }
                    },{
                        loader:'postcss-loader'
                    },{
                        loader:'less-loader'
                    }]
                })
            },{
                test: /\.scss$/,
                include: path.resolve(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules'),
                use: extractTextPlugin.extract({
                    fallback:'style-loader',
                    use: [{
                        loader:'css-loader'
                    },{
                        loader:'sass-loader'
                    }]
                })
            },{
                test: /\.(png|jpg|gif|svg|jpeg)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules'),
                use: [{
                    loader:'url-loader',
                    options: {
                        publicPath: website.publicPath,
                        // outputPath: path.resolve(__dirname, 'dist'),
                        name: '[path][name].[ext]',
                        limit: 1024
                    }
                }]
            },{
                test: /\.(htm|html)$/i,
                include: path.resolve(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules'),
                use: ['html-withimg-loader'] 
            }
        ]
    },
    // 插件，根据需要配置不同功能的插件，多个插件，所以是数组。
    plugins: [
        // new UglifyJsPlugin(),
        new htmlPlugin({
            // 最小化配置
            minify: {
                // 移除标签属性的引号
                removeAttributeQuotes: false
            },
            hash: true,
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            // filename: 'index-[hash].html',
            inject: 'body'
        }),
        new extractTextPlugin({
            filename: 'assets/css/common.css'
        }),
        new purifyCSSPlugin({
            paths: glob.sync(path.resolve(__dirname, 'src/*.html')) // src下的所有html文件
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: website.isDev ? '"development"' : '"production"'
            }
        }),
        new webpack.ProvidePlugin({
            $:'jquery'
        }),
        // 模块注释，添加到输出文件头部
        new webpack.BannerPlugin('All Right @Vidong'),
        // 第三方类库抽离
        new webpack.optimize.CommonsChunkPlugin({
            name: ['jquery'],// 对应入口文件的名称（单独抽离）
            filename: 'assets/js/[name].js',// 抽离位置及名称
            minChunks: 1,// 抽离几个文件
        })
    ],
    watchOptions:{
        poll:1000,//监听修改的时间
        aggregateTimeout:500,//防止重复按键，500毫秒内算按键一次
        ignored:[
            path.resolve(__dirname, 'node_modules'),
            'dist'
        ],//不监测文件
    },
}

// 判断是否为开发模式
if(website.isDev){
    // 源代码显示
    config.devtool = '#cheap-module-eval-source-map'
    // 配置webpack开发服务功能
    config.devServer = {
        contentBase: path.resolve(__dirname,'dist'),
        host: '0.0.0.0',
        compress: true,
        port: '8021',
        overlay: {
            errors: true,
        },
        // open: true,
        // historyFallback: {},
        hot: true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}

// 将配置暴露
module.exports = config