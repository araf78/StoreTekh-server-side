const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
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

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: 'Forbidden access' })
      }
      req.decoded = decoded;
      next();
    });
  }

async function run() {
    try{
        await client.connect();
        const toolCollection = client.db("StoreTekh").collection("tools");
        const orderCollection = client.db('StoreTekh').collection('orders');
        const userCollection = client.db('StoreTekh').collection('users');
        const reviewCollection = client.db('StoreTekh').collection('reviews');
        const myProfileCollection = client.db('StoreTekh').collection('myprofile');

         // set server  and get client all data 
         app.get('/tools', async (req, res)=>{
            const query = {};
            const cursor = toolCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        });
         app.get('/review', async (req, res)=>{
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        });
         app.get('/myprofile', async (req, res)=>{
            const query = {};
            const cursor = myProfileCollection.find(query);
            const myProfile = await cursor.toArray();
            res.send(myProfile)
        });
         app.get('/user', async (req, res)=>{
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        });

        // click this button and it get client by it's id
          // get data and  detail info 
          app.get('/tool/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const tool = await toolCollection.findOne(query);
            res.send(tool);
        }) 

        app.get('/orders', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if(email === decodedEmail){
                const query = { email: email };
                const orders = await orderCollection.find(query).toArray();
                return res.send(orders);
            }
            else {
                return res.status(403).send({ message: 'forbidden access' });
              }
            
          });

        // post data in orders 
        app.post('/order', async (req, res) =>{
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.send(result);
        });
        // post data in reviews 
        app.post('/review', async (req, res) =>{
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews);
            res.send(result);
        });
        app.post('/myprofile', async (req, res) =>{
            const myProfile = req.body;
            const result = await myProfileCollection.insertOne(myProfile);
            res.send(result);
        });

        // all users load 
        // app.get('/user', (req, res) =>{
        //   const users = userCollection.find().toArray();
        //   res.send(users)
        // })

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
            const token = jwt.sign({email : email}, process.env.ACCESS_TOKEN_SECRET,  { expiresIn: 60 * 60 })
            res.send({result, token} );
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