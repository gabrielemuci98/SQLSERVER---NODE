var express = require('express');
var router = express.Router();
const sql = require('mssql');
var createError = require('http-errors');
const config = {
  user: '4DD_09',  //Vostro user name
  password: 'xxx123##', //Vostra password
  server: "213.140.22.237",  //Stringa di connessione
  database: '4DD_09', //(Nome del DB)
}

let executeQuery = function (res, query, next, pagina) {
  sql.connect(config, function (err) {
    if (err) { //Display error page
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    }
    var request = new sql.Request(); // create Request object
    request.query(query, function (err, result) { //Display error page
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();
        return;
      }
      //res.render('unita', {unit : result.recordset}); //Il vettore con i dati è nel campo recordset (puoi loggare result per verificare)
      console.log(result.recordset);
      renderizza(pagina, res, result.recordset)
      sql.close();
    });

  });
}

renderizza = function(pagina,res, dati){
    res.render(pagina, {
        unita : dati
    })
}

router.get('/index', function(req,res,next){
    res.render('index');
});

router.get('/', function (req, res, next) {
  let sqlQuery = "select * from dbo.[cr-unit-attributes]";
  executeQuery(res, sqlQuery, next, "unita");
});

router.get('/unit/:name', function(req, res, next){
    let sqlQuery = `select * from dbo.[cr-unit-attributes] WHERE Unit ='${req.params.name}'`;
    executeQuery(res, sqlQuery, next, "link");
});

module.exports = router;

