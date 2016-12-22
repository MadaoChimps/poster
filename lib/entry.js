var redis = require('redis');
var qs  = require("querystring");
var http = require('http');

module.exports = Entry;

function Entry(obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
}

//复制请求头的处理
var Option=Entry;

var options = {
  hostname: '10.11.52.238',
  port: 8089
};


Entry.prototype.save = function(flag,fn){

  var postData = qs.stringify(this);
  var optionz = new Option(options);
  optionz.path="/msg/addMessage";
  if(!flag)
    optionz.path="/msg/modMessage";
  optionz.method="POST";
  optionz.headers={
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': postData.length
  };
  var entriez="";
  var reqs = http.request(optionz,  function(ress) {
    ress.setEncoding('utf8');
    ress.on("data",function (chunk) {
      entriez+=chunk;
    })
    ress.on('end',fn);
  });
  reqs.on('error',fn);
  reqs.write(postData);
  reqs.end();
};

Entry.getMsg=function (id,fn) {
  var data = {
    id:id
  };
  var queryString = qs.stringify(data);
  var optionz = new Option(options);
  optionz.path="/msg/showMessage?"+queryString;
  optionz.method="GET";
  var reqs = http.request(optionz,function (ress) {
    var datas = "";
    ress.setEncoding("utf8");
    ress.on("data",function (chunk) {
      datas+=chunk;
    })
    ress.on("end",function () {
      var data = JSON.parse(datas);
      fn(null,data);
    });
  });
  reqs.on("error",fn);
  reqs.end();
}
Entry.del=function (id ,fn) {
  var data = {
    id:id
  };
  var queryString = qs.stringify(data);
  var optionz = new Option(options);
  optionz.path="/msg/delMessage?"+queryString;
  optionz.method="GET";
  var reqs = http.request(optionz,function (ress) {
      ress.on("end",fn);
      ress.on("data",function (data) {

      });
  });
  reqs.on("error",fn);
  reqs.end();
}

Entry.getRange = function(from, to, fn){
  var data = {
    page:from+1,
    pagesize:to
  };
  var queryString = qs.stringify(data);
  var optionz = new Option(options);
  optionz.path="/msg/showPage?"+queryString;
  optionz.method="GET";
  var entriez="";
  var reqs = http.request(optionz,function (ress) {
    ress.setEncoding("utf8");
    ress.on("data",function (chunk) {
      entriez+=chunk;
    })
    ress.on("end",function () {
      var entries = JSON.parse(entriez);
      fn(null, entries);
    })
  });
  reqs.on("error",fn);
  reqs.end();
};


