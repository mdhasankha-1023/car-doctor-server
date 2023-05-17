const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middle-were
app.use(cors())
app.use(express.json())

// mongo ingo
// pass => 
// user => 


// mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kgqmoa1.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collection
    const serviceCollection = client.db('carServicesDB').collection('services');
    const orderCollection = client.db('serviceOrderDB').collection('order')

    // get services data
    app.get('/services', async(req, res)=> {
      const cursor = await serviceCollection.find().toArray();
      res.send(cursor)
    })

    // get specific data
    app.get('/services/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await serviceCollection.findOne(query);
      res.send(result)
    })

    // order post
    app.post('/orders', async(req, res)=> {
      const orderInfo = req.body;
      const result = await orderCollection.insertOne(orderInfo)
      res.send(result)
    })


    // get orders
    app.get('/orders', async(req, res)=> {
      const cursor = await orderCollection.find().toArray();
      res.send(cursor)
    })

    // get specific order
    app.get('/orders/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await orderCollection.findOne(query);
      res.send(result)
    })

    // delete order
    app.delete('/orders/:id', async(req, res)=> {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await orderCollection.deleteOne(filter)
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);


// first get for server testing
app.get('/', (req, res) => {
    res.send('This is car-doctor-server')
})

// listen
app.listen(port, () => {
    console.log(`This server is running on: ${port}`)
})