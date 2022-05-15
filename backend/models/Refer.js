const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReferSchema = new Schema({
   sender : String,
   receiver : String
});

module.exports  = mongoose.model('refer', ReferSchema);