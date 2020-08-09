/**
 * @Description:    自定义配置
 * @Author:         wengr
 * @CreateDate:     2020/8/9 0:17
 */
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'? './': '/',
  /* 输出文件目录：在npm run build时，生成文件的目录名称 */
  outputDir: "dist",
  /* 放置生成的静态资源 (json、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: "static",
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },
  //修改或新增html-webpack-plugin的值，在index.html里面能读取htmlWebpackPlugin.options.title
  chainWebpack: config =>{
    config.plugin('html')
      .tap(args => {
        args[0].title = "POS-炸鸡店结账";
        return args;
      })
  },
  /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
  productionSourceMap: false,
  lintOnSave: false,
};