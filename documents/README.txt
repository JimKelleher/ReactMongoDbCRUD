
compile warning: 

[BABEL] Note: The code generator has deoptimised the styling of "C:/a_dev/NodeJS/artistmaint/node_modules/react-dom/cjs/react-dom.development.js" as it exceeds the max of "500KB".

---------------------

https://stackoverflow.com/questions/42060243/invalid-configuration-object-webpack-has-been-initialised-using-a-configuration

fix in webpack.config.js:

Added "exclude" portion:

{ test: /\.(jsx?)$/, use: "babel-loader", exclude: /(node_modules)/ },


ddddddd

npm install --save-dev babel-core babel-loader babel-preset-env babel-preset-react css-loader style-loader html-webpack-plugin webpack webpack


npm install --save-dev 
babel-core
babel-loader 
babel-preset-env 
babel-preset-react
css-loader 
style-loader
html-webpack-plugin 
webpack 

ddddd

dependencies
babel-core
babel-preset-es2015
babel-preset-react
babel-preset-stage-0
path
react
react-dom
webpack
webpack-dev-server

devDependencies": {
webpack": "^3.12.0",
webpack-cli": "^2.1.3"

ddddddddddd

ddddd

dependencies

react
react-dom

devDependencies

babel-core
babel-preset-es2015
babel-preset-react
babel-preset-stage-0
path
webpack
webpack-cli
webpack-dev-server


dddddddd

npm install --save react react-dom

npm install --save-dev babel-core babel-preset-es2015 babel-preset-react babel-preset-stage-0 path webpack webpack-cli webpack-dev-server

npm install --save-dev html-webpack-plugin

npm install --save-dev babel babel-loader

npm install --save-dev babel-preset-env

ddddddddd

error:

Cannot find module 'html-webpack-plugin'

dddddd

error:

ERROR in Entry module not found: Error: Can't resolve 'babel-loader'

https://stackoverflow.com/questions/34538466/error-cannot-resolve-module-babel-loader

ddddddddddddd

babel
babel-core
babel-loader

ddddddddd

error:

 Couldn't find preset "env" relative to directory

https://stackoverflow.com/questions/48848249/couldnt-find-preset-env-relative-to-directory

dddddd

error: Unexpected token "..." spread operator

https://stackoverflow.com/questions/38490804/spread-operator-in-react-throwing-error-of-unexpected-token

BEFORE:

  "babel": {
    "presets": [
      "env",
      "react"
    ]

stack overflow:

{ "presets":[ "es2015", "react", "stage-0" ] }

AFTER:

  "babel": {
    "presets": [
      "env",
      "es2015",
      "react",
      "stage-0"
    ]

ddddddd

SUCCESS.  APP RAN PERFECTLY.  I AM VERY HAPPY.

dddddd

NOTE: I could not get multiple .CSS files that are in different directories to load via multiple Webpack CSS loaders























































































