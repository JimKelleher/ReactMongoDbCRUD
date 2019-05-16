var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, "./dist");
var APP_DIR   = path.resolve(__dirname, "./app");

module.exports = {

    entry: APP_DIR + "/index.js",
    mode: "development",
    output: {
        path: BUILD_DIR,
        filename: "bundle.js"
    },

    module: {
        rules: [
            {  
                test:/\.(js|jsx)$/,
                use:"babel-loader",
                exclude:/(node_modules)/
             },

            // CSS loader takes a CSS file and returns the CSS with imports and url(...) resolved via webpack's require
            // functionality.  It doesn't actually do anything with the returned CSS.  Style loader takes CSS and inserts
            // it into the page so that the styles are active:          
            {  
                test:/\.(css)$/,
                use:[  
                   "style-loader",
                   "css-loader"
                ]
             },

            { test: /\.(png|ico)$/,
                use: [
                  {
                    loader: "file-loader",
                    options: {name: '[name].[ext]'},
                  },
                ]
            }
        ]
    },
    
    plugins: [
        new HtmlWebpackPlugin({template: APP_DIR + "/index.html"})
    ]
        
}