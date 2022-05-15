const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountSchema = new Schema({
   account : String,
   count : Number
});

module.exports  = mongoose.model('count', CountSchema);