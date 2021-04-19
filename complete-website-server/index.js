const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dwn45.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const bookingList = client.db(`${process.env.DB_NAME}`).collection("orders")
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders"); 
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");
  

  // verify
const isAdmin = client.db(`${process.env.DB_NAME}`).collection("admin");
app.post('/dashboard/isAdmin', (req, res) => {
  const email = req.body.email;
  console.log(email);
  isAdmin.find({ email: email })
      .toArray((err, admin) => {
          res.send(admin.length > 0);
      })
})
//add order to db
app.post('/dashboard/addorder', (req, res) => {
  const addorder = req.body;
  // console.log('adding new event: ', addorder)

  ordersCollection.insertOne(addorder)
  .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
  })
})


//show orders
 app.get('/dashboard/bookinglist', (req, res) => {
  bookingList.find()
   .toArray((err, docs) => {
       res.send(docs)
   })
 })

  
  //Add reviews
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
  app.post('/dashboard/addreviews', (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review)
    .then(result =>{
        res.send(result.insertedCount>0)
    })
  })
  app.get('/reviews', (req, res) => {
      reviewCollection.find()
     .toArray((err, docs) => {
         res.send(docs)
     })
   })
     //Add orders
     const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
  app.post('/dashboard/addservice', (req, res) => {
    const review = req.body;
    serviceCollection.insertOne(review)
    .then(result =>{
        res.send(result.insertedCount>0)
    })
  })
  app.get('/services', (req, res) => {
    serviceCollection.find()
     .toArray((err, docs) => {
         res.send(docs)
     })
   })
   //add a admin
   app.post('/dashboard/addAdmin', (req, res) => {
    const {email} = req.body
    console.log(req.body);
    adminCollection.insertOne({email})
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})

//    //delete order
app.delete('/dashboard/delete/:id', (req, res) => {
  console.log('Data Delete');
  // const id = ObjectId(req.params.id);
  // console.log('Delete This', id);

  bookingList.findOneAndDelete({_id: req.params.id})
  .then(data => res.json({success: !!data.value}));
})

   app.get('/dashboard/book/:id', (req, res) => {
      //  const id = ObjectId(req.params.id)
      //  console.log('server',id);
    serviceCollection.findOne({_id:ObjectId(req.params.id)})
    .then(service=>{
      res.json(service)
    })
   })

 console.log('database conneted ')
});







app.get('/', (req, res) => {
  res.send('Im working')
})

app.listen(`${port}`)