module.exports = function(perpage){
  var http = require('http');
  perpage = perpage || 10;
  return function(req, res, next){
    var page = Math.max(
      parseInt(req.param('page') || '1', 10),
      1
    ) - 1;

    //发HTTP请求去取得总共记录条数。
    var options = {
      hostname: '10.11.52.238',
      port: 8089,
      path:"/msg/countMessage",
      method:"GET"
    };
    var datas="";
    var reqs = http.request(options,function (ress) {
      ress.setEncoding("utf8");
      ress.on("data",function (chunk) {
        datas+=chunk;
      })
      ress.on("end",function () {
        var count = JSON.parse(datas);
        req.page=res.locals.page = {
          number: page,
          perpage: perpage,
          from: page,
          to: perpage,
          total: count.count ,
          count: Math.ceil(count.count / perpage)
        };
        next();
      })
    });
    reqs.on("error",next);
    reqs.end();
  }
};

