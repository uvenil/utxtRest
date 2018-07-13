var mongoose = require('mongoose');
const extend = require('mongoose-schema-extend');
mongoose.plugin(require('./basePlugin'));


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports = {mongoose};
