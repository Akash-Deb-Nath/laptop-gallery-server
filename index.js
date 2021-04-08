const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rhzwj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("laptops").collection("merchandise");
    const ordersCollection = client.db("laptops").collection("orders");
    console.log("Database connected successfully");

    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })

    app.get('/checkout/:productName', (req, res) => {
        productCollection.find({ productName: req.params.productName })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.get('/order/:productName', (req, res) => {
        ordersCollection.find({ productName: req.params.productName})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        productCollection.insertOne(newProduct)
            .then(result => {
                console.log('insertedCount', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        productCollection.deleteOne({_id : id})
        .then(result => {
            res.send(result.insertedCount > 0)
        }) 
    })

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})