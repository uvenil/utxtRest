var mongoose = require('mongoose');
mongoose.plugin(require('./../models/basePlugin'));
const extend = require('mongoose-schema-extend');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports = {mongoose};
