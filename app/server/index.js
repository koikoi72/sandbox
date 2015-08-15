/**
 * Created by kashiharaakira on 15/08/14.
 */

var http = require('http'),
    express = require('express');

var app = express();

app.use(express.static('app/public'));

http.createServer(app).listen(3000);