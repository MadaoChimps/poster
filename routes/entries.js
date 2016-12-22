var Entry = require('../lib/entry');

exports.list = function(req, res, next){
  var page = req.page;
  Entry.getRange(page.from, page.to, function(err, entries) {
    if (err) return next(err);
    res.render('entries', {
      title: 'Entries',
      entries: entries,
    });
  });
};

exports.update1 = function(req,res,next){
  var id = req.param('id');
  Entry.getMsg(id,fnupdate1(req,res,next));
}
var fnupdate1 = function (req,res,next) {
  return function(err,entry) {
    if (err) return next(err);
    else {
      res.render('update',{title:"Update Entry", entry:entry})
    }
  }
}
exports.del = function(req,res,next){
  var id = req.param('id');
  Entry.del(id,fndel(req,res,next));
}
var fndel =function (req,res,next) {
  return function(err) {
    if (err) return next(err);
    else {
      res.redirect('/');
    }
  }
}

exports.form = function(req, res){
  res.render('post', { title: 'Post' });
};

exports.submit = function(req, res, next){
  var data = req.body.entry;

  var entry = new Entry({
    "username": res.locals.user.name,
    "title": data.title,
    "body": data.body
  });

  entry.save(true,fnsave(req,res,next));
};

exports.update2 = function(req, res, next){
  var data = req.body.entry;

  var entry = new Entry({
    "username": res.locals.user.name,
    "title": data.title,
    "body": data.body,
    "id":data.id
  });

  entry.save(false,fnupdate2(req,res,next));
};

var fnupdate2 = function(req,res,next) {
  return function(err){
    if(err) next(err);
    if (req.remoteUser) {
      res.json({message: 'Entry added.'});
      res.redirect('/');
    }else{
      res.redirect('/');
    }
  }
}

var fnsave = function(req,res,next) {
  return function(err){
    if(err) next(err);
    if (req.remoteUser) {
      res.json({message: 'Entry added.'});
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  }
}