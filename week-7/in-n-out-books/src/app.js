//Name: Riley, Date:7/13/2025, File:app.js, Desc: Assignment for In-N-Out Books
//javascript

const booksDB = require('../database/books');
const express = require('express');
const path = require('path');
const users = require('../database/users');
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.static('public'));

app.use(express.json());
//GET/api/books
app.get('/api/books', async(req, res) => {
    try {
        const books = await booksDB.find();
        res.json(books.data);
    } catch(err) {
        res.status(500).json({error:'Failed to fetch books'});
    }
});

app.post('/api/books', async(req, res) => {
    try {
        if(req.body.title){
          await booksDB.insertOne({title: req.body.title, author: req.body.author});
          const books = await booksDB.find();
          res.status(201).json(books.data);
        } else {
          res.status(400).json({error:'Missing title'});
        }
    } catch(err) {
        console.log(err.message);
        res.status(500).json({error:'Failed to create book'});
    }
});

//POST/api/login
app.post('/api/login', async(req, res) => {
    try {
        if(req.body.email && req.body.password){
          const user = await users.findOne({email:req.body.email });
          if(bcrypt.compareSync(req.body.password, user.password)){
            res.status(200).json('Authentication successful');
          }else{
            res.status(401).json({error:'Unauthorized'})
          }
        }else{
          res.status(400).json({error:'Missing email or password'});
        }
    } catch(err) {
        console.log(err.message);
        res.status(500).json({error:'Failed to login user'});
    }
});

//GET/api/books/:id
app.get('/api/books/:id', async(req, res) => {
    try {
        const id = Number(req.params.id);
        if(isNaN(id)){
            return res.status(400).json({error:'Id must be a number'});
        }
        const book = await booksDB.findOne({id});
        if(!book){
            return res.status(404).json({error:'Book not found'});
        }
        res.json(book);
    } catch(err){
        res.status(500).json({error:'Failed to fetch book'});
    }
});

app.put('/api/books/:id', async(req, res) => {
    try {
        const id = Number(req.params.id);
        if(isNaN(id)){
            return res.status(400).json({error:'Id must be a number'});
        }
        if(req.body.title == ""){
          return res.status(400).json({error:'Book must have a title'});
        }
        await booksDB.updateOne({id}, req.body);
        res.status(204).end();
    } catch(err){
        res.status(500).json({error:'Failed to fetch book'});
    }
});

app.delete('/api/books/:id', async(req, res) => {
    try {
        const id = Number(req.params.id);
        if(isNaN(id)){
            return res.status(400).json({error:'Id must be a number'});
        }
        const book = await booksDB.deleteOne(id);
        res.status(204).end();
    } catch(err){
        console.log(err.message);
        res.status(500).json({error:'Failed to delete book'});
    }
});

module.exports = app; //Exports express application from app.js

//404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).send('<h1>404 - Page Not Found</h1><p>Sorry, the page you are looking for does not exist.</p>');
});

//500 Internal Server Error Middleware
app.use((err, req, res, next) => {
  res.status(500);
  const errorResponse = {
    message:"Internal Server Error",
    error:err.message
  };
  if(app.get('env') === 'development'){
    errorResponse.stack = err.stack;
  }
  res.json(errorResponse);
});


