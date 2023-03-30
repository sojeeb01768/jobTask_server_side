const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kvqywrf.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const usersInfoCollection = client.db('jobTask').collection('userInfo');

        // get all users
        app.get('/users', async (req, res) => {
            const query = {};
            const userInfo = await usersInfoCollection.find(query).toArray();
            res.send(userInfo);
        })
        // delete user
        app.delete("/user/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await usersInfoCollection.deleteOne(filter);
            res.send(result);
        });


        // post userInfo data to db
        app.post('/users', async (req, res) => {
            const userInfo = req.body;
            const result = await usersInfoCollection.insertOne(userInfo);
            res.send(result)
        });
    }
    finally {

    }

}
run().catch(console.log);


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})