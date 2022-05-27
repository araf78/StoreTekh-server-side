const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

         // set server  and get client all data 
         app.get('/tools', async (req, res)=>{
            const query = {};
            const cursor = toolCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        });

        // click this button and it get client by it's id
          // get data and  detail info 
          app.get('/item/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const tool = await toolCollection.findOne(query);
            res.send(tool);
        }) 
    }
    finally{

    }
}
run().catch(console.log())

app.get("/", (req, res) => {
    res.send("StoreTekh project is Running")
})

app.listen(port, ()=>{
    console.log('StoreTekh project is Listening')
})