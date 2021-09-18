const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mvf4b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("oxygenGym").collection("product");
  const checkInCollection = client.db("oxygenGym").collection("checkIn");
  
   app.post('/addProduct', (req, res) => {
     const newProduct = req.body;
     productCollection.insertOne(newProduct)
     .then(result => {
       res.send(result.insertedCount > 0)
     })
   })
   
   app.get('/getProduct', (req, res) => {
    productCollection.find({})
    .toArray((err, document) => {
      res.send(document);
    })
  })

  app.get('/singleProduct/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, document) => {
      res.send(document[0]);
    })

  })

  

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
     console.log(result)
    })
  })

  app.post('/productDetails', (req, res) => {
      const newProduct = req.body;
      checkInCollection.insertOne(newProduct)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/products', (req, res) => {
    checkInCollection.find({email: req.query.email})
    .toArray((err, document) => {
      res.send(document)
    })
  })



});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})