const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const validator = require('validator');
const cors = require('cors')
const Url = require('./models/url');

const app = express();

app.use(express.json());
app.use(cors());

// Connect to mongodb
const dbURI = 'mongodb+srv://roxxouille:S2a9lRbqNGnNCU2k@url-shortener.kr0zd.mongodb.net/url-shortener?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('connected to db')
        app.listen(8080);
    })
    .catch((error) => {
        console.log(error)
    });

app.get('/get-urls/:userToken', (req, res) => {
    Url.find({userToken: req.params.userToken}).sort({createdAt: 'desc'}).exec((err, result) => {
        if (err) {
            return console.log(err)
        }

        if(result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json({
                message: "User not found"
            });
        }
    })
})

app.post('/add-url', async (req, res) => {

    if(!validator.isURL(req.body.url)) {
        return res.status(400).json({
            message: "Url is not valid"
        });
    }

    let userToken
    if (req.body.userToken !== undefined) {
        userToken = req.body.userToken;
    } else {
        userToken = nanoid(5);
    }

    let { hostname } = new URL(req.body.url);
    try {
        const newToken = await getNewToken();
        const url = new Url({
            url: req.body.url,
            userToken,
            token: newToken,
            hostname
        });
        url.save((err, result) => {
            if(err) {
                console.log(err);
            } else {
                res.status(201).json(result);
            }
        });
    } catch (error) {
        console.log('aloooooo', error);
    } 
});

app.get('/:token', (req, res) => {

    Url.findOne(({token: req.params.token}), (err, result) => {
        if(err) {
            return console.log(err);
        }
        if(result === null) {
            res.send("404");
        } else {
            res.redirect(result.url);
        }
    })

});

const getNewToken = async () => {
    let isAvailable = false;
    let newToken = nanoid(5);

    while(!isAvailable) {
        let res = await Url.exists({token : newToken});

        if(res) {
            newToken = nanoid(5);
        } else {
            isAvailable = true;
        }
    }

    return newToken;
}

