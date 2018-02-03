var mongoose = require('mongoose');
var datasSchema = require('../schemas/data');

module.exports = mongoose.model('Data',datasSchema);