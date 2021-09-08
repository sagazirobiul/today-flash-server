const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5050;
const ObjectId = require('mongodb').ObjectId;

app.use(express.json());
app.use(cors());
require('dotenv').config(); 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cuolv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const newsCollection = client.db(`${process.env.DB_NAME}`).collection("newses");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");

    const handlePost = (route, collection) => {
        app.post(route, (req, res) => {
        const data = req.body;
        collection.insertOne(data)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
        })
    }
    handlePost('/addNews', newsCollection)
    handlePost('/addAdmin', adminCollection)

    
    app.get('/getNews', (req, res) => {
        newsCollection.find({category: req.query.category})
        .toArray((err, items) => {
            res.send(items)
        })
    })
    
    app.get('/newsDetails', (req, res) => {
        newsCollection.find({_id: ObjectId(req.query.id)})
        .toArray((err, items) => {
        res.send(items)
        })
    })

    app.get('/checkAdmin', (req, res) => {
        adminCollection.find({email: req.query.email})
        .toArray((err, items) => {
        res.send(items)
        })
    })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)