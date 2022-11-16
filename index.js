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

        app.post('/services', async (req, res) => {
            const service = req.body
            const result = await serviceCollection.insertOne(service)
            res.send(result)
        })


        app.get('/allservices', async (req, res) => {
            const search = req.query.search

            let query = {}
            if (search.length) {
                query = {
                    $text: {
                        $search: search
                    }
                }
            }
            const sort = { _id: -1 }

            const cursor = serviceCollection.find(query).sort(sort)
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
            const sort = { _id: -1 }

            const cursor = reviewCollection.find(query).sort(sort)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
        app.put('/review/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const user = req.body
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    message: user.message
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedUser, option)
            res.send(result)
        })

        app.get('/review/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }

            const result = await reviewCollection.findOne(query)
            res.send(result)
        })

        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })


    }
    finally {

    }
}
run().catch(err => console.error(err))

app.listen(port, () => {
    console.log(`port is running on port ${port}`)
})