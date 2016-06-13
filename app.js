
var express = require('express'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    app = module.exports = express.createServer(); /* зачем здесь это? "module.exports" ты ничего не экспортишь */

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');   /* раз уж это написал, тогда в срт. 40 res.render('./public/index'); */
  app.use(express.bodyParser()); /* не используется нигде, пока что)) */
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/node_modules')); /* не хорошо что у тебя все зависимости в одном, для фронта нужно ставить отдельно, в publick'е */
});

/**
 *  Заварачивать весь сервак в коллбек монги плохая идея, тк. если нет соединения, сервер просто не стартонет, а должен сохранить весь функционал, просто не отображать никаких данных
 *  в идеале отправлять ошибку, при запросе, типа "нет соединения с БД".
 */

MongoClient.connect('mongodb://localhost:27017/TravelList', function(err, db){
  if (err){
    throw err;
  }else

    var collection = db.collection('travelTask'),
        tasks; /* обьявил, но не инициализировал, непонятно что за тип данных */

    collection.find().toArray(function(err, docs){
      if (err) {
        throw err;
      }else{
        tasks = docs; /* этот запрос в базу должен быть при запросе с клиента коллекции тасок, а не при старте приложения */
      }
    });

    app.configure('development', function(){
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function(){
      app.use(express.errorHandler());
    });
 
    app.get('/', function(req, res){
      res.sendfile('./public/index.html'); /* см 1й коммент) */
    });
  
    app.post('/travelTask', function(req, res){
      res.json(tasks); /* post отправляет коллекцию на клиент?? не годиться */
    });

    app.get('/taskCondition', function(req, res){
      /* запрос get, а внутри делает апдейт, так нельзя */
      collection.update({
        task: req.query.task /* не хорошо передевать ID таски в query, это не REST получается, ID должны быть в params */
      }, 
      {
        $set: {
          condition: req.query.condition /* данные нужно в body передавать */
        }
      }); /* нет обработчиков ошибок на все запросы в базу */
    });

    app.get('/editTask', function(req, res){
      /* запрос get, а внутри делает апдейт, put нужен 
        + все что писал выше про query
      */
      collection.update({task:req.query.oldTask}, {$set:{task:req.query.newTask}});
    });

    app.get('/deleteTask', function(req, res){
      /* нужен delete вместо get, id таски в params + все что выше написано */
      collection.remove({task:req.query.task});
    });

    app.get('/addTask', function(req, res){
      /* тут нужен post, + все что выше написано */
      collection.insert({task:req.query.task, condition:req.query.condition});
    });

    app.listen(3000, function(){
      console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    });    
  
});
