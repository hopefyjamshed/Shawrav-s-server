const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
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


    }
    finally {

    }
}
run().catch(err => console.error(err))

app.listen(port, () => {
    console.log(`port is running on port ${port}`)
})