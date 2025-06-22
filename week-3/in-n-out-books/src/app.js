//Name: Riley, Date:6/22/2025, File:app.js, Desc: Assignment for In-N-Out Books
javascript

app.use(express.static('public'));
const express = require('express');
const path = require('path');
const app = express();

module.exports = app; //Exports express application from app.js

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'landing.html'));
});

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

//app.listen(3000, () => {
//  console.log('server running on port 3000');
//});
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});

