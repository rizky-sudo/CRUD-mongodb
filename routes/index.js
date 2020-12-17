var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var moment = require('moment');
const { Db } = require('mongodb');
const { route } = require('./users');
const ObjectId = require('mongodb').ObjectID;
moment().format();

module.exports = (db) => {
  const collection = db.collection('data')

  // home
  router.get('/', (req, res, next) => {
    const result = {};
    let FilterData = false;

    if (req.query.check_string && req.query.string) {
      result.string = req.query.string;
    }
    if (req.query.check_integer && req.query.integer) {
      result.integer = parseInt(req.query, integer)
    }
    if (req.query.check_float && req.query.float) {
      result.float = parseFloat(req.query.floa)
    }
    if (req.query.check_date && req.query.startDate && req.query.endDate) {
      result.date = {};
      result.date.$gte = new Date(`${req.query.startDate}`)
      if (req.query.endDate)
        result.date.$gte = new date(`${req.query.endDate}`);
    }
    if (req.query.check_boolean && req.query.boolean) {
      result.boolean = req.query.boolean;
    }

    const page = req.query.page || 1;
    const limit = 3;
    const offset = (page - 1) * limit;
    const url = req.url === '/' ? '/?page1' : req.url;

    collection.find(result).limit(limit).skip(offset).toArray().then(row => {
      collection.find(result).count().then(count => {
        res.render('index', {
          data: row,
          moment,
          page,
          pages: Math.ceil(count / limit),
          query: req.query,
          url
        })
      })
    })
  })

  // menampilkan add
  router.get('/add', (req, res, next) => {
    res.render('add');
  });

  router.post('/add', (req, res, next) => {
    collection.insertOne({
      string: req.body.string,
      integer: parseInt(req.body.integer),
      float: parseFloat(req.body.float),
      date: new Date(req.body.date),
      boolean: req.body.boolean
    })
    res.redirect('/');
  });

  // menampilkan edit
  router.get('/edit/:id', (req, res, next) => {
    collection.findOne({
      _id: ObjectId(req.params.id)
    }, (err, data) => {
      if (err) throw err;
      console.log(data);
      res.render('edit', { model: data, moment })
    })
  });

  router.post('/edit/:id', (req, res, next) => {
    collection.updateMany({ _id: ObjectId(req.params.id) }, {
      $set: {
        string: req.body.string,
        integer: parseInt(req.body.integer),
        float: parseFloat(req.body.float),
        date: new Date(req.body.date),
        boolean: req.body.boolean
      }
    }, (err, row) => {
      if (err) throw err;
      console.log('update sukses');
      res.redirect('/');
    })
  })

  // menampilkan delete
  router.get('/delete/:id', (req, res, next) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) },
      (err) => {
        if (err) throw err;
        res.redirect('/');
      })
    console.log('delete sukses')
  })
  return router;
}

