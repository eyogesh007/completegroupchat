const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Register=require('./regschema.js');
const jwt=require('jsonwebtoken');
const checktoken=require('./checktoken');
//const msgschema=require('./msgschema.js');
const cors = require('cors');


app.use(express.json());
app.use(cors({
    origin: '*'
}))

let msgschemas=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register'
    },
    username:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }

})

mongoose.connect("mongodb+srv://yogesh:yoge111@cluster0.grmrsyh.mongodb.net/?retryWrites=true&w=majority").then(()=>console.log("db connected"))
var db = mongoose.connection;

app.get('/',(req,res)=>{
    res.send('chat app')
})




app.post('/register',async(req,res)=>{
    console.log(req)
    const {username,email,password,confirmpassword} = req.body;
    let exist = await Register.findOne({username})
    if(exist){
        return res.send('User Already Exist')
    }
    if(password !== confirmpassword){
        return res.send('Passwords are not matching');
    }
    let newUser = new Register({
        username,
        email,
        password,
        confirmpassword
    })
    await newUser.save();
    res.send('Registered Successfully')
})

app.post('/login',async (req, res) => {
        const {username,password} = req.body;
        let exist = await Register.findOne({username});
        if(!exist) {
              res.json(null);
         }
    else if(exist.password !== password) {
              res.json(null);
         }
        else{
        let auth={user:{id:exist._id} }
        jwt.sign(auth,'key',{expiresIn:3600000},(err,token)=> { res.json(token)})}
    }
    )

app.post('/chat/:name',checktoken,async(req,res)=>{
    const {message} = req.body;
    const mschema= mongoose.model(`${req.params.name}`,msgschemas,`${req.params.name}`);
    let exist1 =await Register.findById(req.user.id)
    let newmessage= mschema({
        user:req.user.id,
        username:exist1.username,
        message
    })
    await newmessage.save();
    let exist =await mschema.find();
    res.send(exist)

})

app.get('/chat/:name',checktoken,async(req,res)=>{
    let name=req.params.name
    const mschema= mongoose.model(`${req.params.name}`,msgschemas,`${req.params.name}`);
    let exist =await mschema.find();
    res.send(exist)
})  

app.get('/username',checktoken,async(req,res)=>{
    let exist=await Register.findById(req.user.id);
    res.send(exist.username);
})


/*
const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://shrouded-journey-38552.heroku...']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const path = require('path');
if (process.env.NODE_ENV === 'production') {
 // Serve any static files
 app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
 app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
 });
}
*/


app.listen(5000,()=>{
    console.log('server running')
})