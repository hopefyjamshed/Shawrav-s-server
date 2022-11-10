const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// middlewere 
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('service server is runnign successfully')
});

// mongodb connection 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jle6tre.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db('shawravsDbUser').collection('services')
        const reviewCollection = client.db('shawravsDbUser').collection('review')

        app.get('/services', async (req, res) => {
            const query = {}

            const cursor = serviceCollection.find(query)
            const services = await cursor.limit(3).toArray()

            res.send(services)

        })
        app.get('/allservices', async (req, res) => {
            const query = {}

            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()

            res.send(services)

        })
        app.get('/allservices/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)

            res.send(service)

        })

        // review api 

        app.post('/review', async (req, res) => {
            const order = req.body
            const result = await reviewCollection.insertOne(order)
            res.send(result)
        })

        app.get('/review', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })


    }
    finally {

    }
}
run().catch(err => console.error(err))

app.listen(port, () => {
    console.log(`port is running on port ${port}`)
})