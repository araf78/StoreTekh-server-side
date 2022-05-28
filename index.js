const express = require('express');
const app = express();

const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const port  = process.env.PORT || 5000;

const cors = require('cors');
require('dotenv').config();
app.use(express.json());

 app.use(cors());
app.use(express.json());
// dbuser78
// yYaY7G3raA1sNFEe

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ialqa.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const toolCollection = client.db("StoreTekh").collection("tools");
        const orderCollection = client.db('StoreTekh').collection('orders');
        const userCollection = client.db('StoreTekh').collection('users');

         // set server  and get client all data 
         app.get('/tools', async (req, res)=>{
            const query = {};
            const cursor = toolCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        });

        // click this button and it get client by it's id
          // get data and  detail info 
          app.get('/tool/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const tool = await toolCollection.findOne(query);
            res.send(tool);
        }) 

        // post data in orders 
        app.post('/addorder', async (req, res) =>{
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.send(result);
        });
            // put 

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
              $set: user,
            };
            const result = await userCollection.updateOne( filter, updateDoc, options);
            res.send(result );
          });
    }
    finally{

    }
}
run().catch(console.dir())

app.get("/", (req, res) => {
    res.send("StoreTekh project is Running")
})

app.listen(port, ()=>{
    console.log('StoreTekh project is Listening')
})