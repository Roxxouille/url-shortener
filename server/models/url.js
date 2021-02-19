const mongoose = require('mongoose');
const schema = mongoose.Schema({
    url: {
        type: String,
        match: [/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/, 'Invalid url format'],
        required: [true, 'url is required']
    },
    hostname: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    userToken: {
        type: String,
        required: true
    }


}, {
    timestamps: true,
});

module.exports = mongoose.model('Url', schema);


