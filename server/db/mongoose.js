var mongoose = require('mongoose');
mongoose.plugin(require('./lastMod'));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

module.exports = {mongoose};
