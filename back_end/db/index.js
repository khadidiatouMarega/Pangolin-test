const mongoose = require('mongoose'); 
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/pangolin");
mongoose.connect('mongodb://localhost:27017/pangolin', {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, function (err) {
    if (err) {
        throw err;
    } else
    console.log('db connected');
})
 
const db = mongoose.connection 

module.exports = db  