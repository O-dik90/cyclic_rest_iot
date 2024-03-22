
const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000

const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri);

app.all('*', (req,res) => {
  res.json({"every thing":"is awesome"})
})

client.connect(err => {
    if(err){ console.error(err); return false;}
    // connection to mongo is successful, listen for requests
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
});
