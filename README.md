# webpack快速构建工具

## 一. webpack安装及注意事项
1. Window+R键，输入cmd打开命令行工具，输入 mkdir XXX（XXX：文件夹名）；
2. cd XXX 进入刚刚创建好的文件夹里，输入cnpm install -g webpack （安装了淘宝镜像可以直接使用cnpm，没有安装的使用npm）
3. 安装好之后初始化一下，（初始化的主要目的是生成package.json文件）在命令行工具中输入：cnpm init，输入完成后，会有一系列的内容，会问到你关于项目的名称，描述等等，可随意填写。
4. 初始化完成后，对项目目录进行安装，第二步的-g是全局安装，官方不推荐使用，比如你的项目使用的是webpack2.X版本，这样就会覆盖之前的版本，导致项目配置错误。
输入命令：cnpm install --save-dev webpack,安装后之后，可以看看是否安装成功，输入命令webpack -v 即可（注：--save-dev：本地安装到开发环境）

> 最好用cnpm，速度比较快

## 二. 小试牛刀，构建一个Webpack项目
1. 进入根目录,建两个文件夹，分别为src和dist

   1).src文件夹：用来存放我们编写的javascript代码，可以简单的理解为用JavaScript编写的模块。

   2).dist文件夹：用来存放供浏览器读取的文件，这个是webpack打包成的文件。

2. 在dist下建立一个index.html文件，用作模板文件，代码如下：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<meta http-equiv="Content-Security-Policy" content="font-src * data:;"> 
<title>Vidong</title>
</head>
<body>
    <h2 id="title"></h2>
    
<script type="text/javascript" src="app.js"></script>
</body>
</html>
```
这里引入的app.js先不管，这个文件现在还没有，这是用webpack打包后生成的文件

src下建一个entry.js文件 写入代码：
```js
document.getElementById('title').innerHTML='Hello Webpack';
``` 
3. 在命令行中执行：webpack src/entry.js dist/bundle.js

4. 这样就打包成功了，如果要看效果，可cnpm install -g live-server，执行```live-server```，浏览器会自动打开一个窗口，点击dist文件夹可查看到效果。

## 三、入口和出口，多入口、多出口配置
1. 在根目录新建一个webpack.config.js文件，然后开始配置；
> entry：配置入口文件的地址，可以是单一入口，也可以是多入口。   
> output：配置出口文件的地址，在webpack2.X版本后，支持多出口配置。   
> module：配置模块，主要是解析CSS和图片转换压缩等功能。   
> plugins：配置插件，根据你的需要配置不同功能的插件。   
> devServer：配置开发服务功能。

2. 在终端输入```webpack```进行打包

3. 多入口、多出口配置
在入口文件中，新增了一个entry.js的入口文件，这个文件需要手动建立，出口文件的filename，我们把原来的bundle.js修改成了[name].js

> [name]的意思是根据入口文件的名称，打包成相同的名称，有几个入口文件，就可以打包出几个文件。

4. 在终端输入 ```webpack``` 进行打包

## 四、Webpack服务和热更新
1. 在终端安装 `cnpm i webpack-dev-server --save-dev`
2. 配置好后执行 webpack-dev-server，这时候会报错，只需要在package.json里配置下scripts就可以了

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.config.js --progress --display-modules --colors --display-reasons"
},
```
> 参数说明：(按需选择)   
1. --config 配置webpack配置文件
2. --progress 显示打包进度
3. --display-modules 显示模块
4. --color 显示颜色
5. --display-reasons
6. --watch 监听文件变化，进行自动打包

3. npm安装好后，需要配置下devServer服务
```json
{
    contentBase: path.resolve(__dirname,'dist'),
    host: '0.0.0.0',
    compress: true,
    port: '8080',
    overlay: {
        errors: true,
    },
    // open: true,
    // historyFallback: {},
    hot: true
}
```
4. 配置好后，在终端执行`npm run server`，到浏览器地址中输入127.0.0.1:8080，可看到效果，并实现热更新。

## 五、CSS文件打包
1. 在src目录下新建一个css文件，在css文件下新建common.css文件，输入以下代码
```css
body{
    background: red;
    color: green;
}
```
2. css文件新建好后，需要引入到入口文件app.js中
3. 在终端安装`cnpm i style-loader --save-dev` 、`cnpm i css-loader --save-dev`
4. 安装好后，在webpack.config.js中进行配置
```json
 module:{
    rules: [
        {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }
    ]
},
```
5. 在终端输入 `npm run server` ，在浏览器中输入地址即可看到效果。