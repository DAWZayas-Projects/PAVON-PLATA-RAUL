const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
   author: {
       type: Schema.Types.ObjectId,
       ref: 'users',
       required: true
   },
   category: {
       type: Schema.Types.ObjectId,
       ref: 'categories',
       required: true
   },
   title: {
       type: String,
       required: true
   },
   status: {
       type: String,
       default: 'public'
   },
   allowComments: {
        type: Boolean,
        required: true
   },
   body: {
        type: String,
        required: true
   },
    file: {
       type: String
    },
    date: {
       type: Date,
       default: Date.now()
    },
    comments: [{
       type: Schema.Types.ObjectId,
       ref: 'comments'
    }]
    }
);

module.exports = mongoose.model('posts', PostSchema);