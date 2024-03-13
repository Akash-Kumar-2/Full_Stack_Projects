const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();
const app = express();


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "vsagfddvsdfj_ofaed_bvfgsbSAFD";

app.use(express.json());
app.use(cookieParser());
// to access uploads folder on browser so the we can add photos through link in accomodation
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(cors({
credentials: true,
origin:'http://localhost:5173',
}))
mongoose.connect(process.env.MONGO_URL);


app.get('/test',(req,res)=>{
    res.json('test ok');
});

app.post('/register',async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        const userDoc = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password,bcryptSalt)
        });
         res.json({name,email,password});
    }catch(e)
    {
        res.status(422).json(e);
    }
   
});

app.post('/login',async (req,res)=>{

    const {email,password} = req.body;
        const userDoc = await User.findOne({email});
        if(userDoc)
        {  const passOk = bcrypt.compareSync(password,userDoc.password);
            if(passOk)
            {  jwt.sign({email:userDoc.email,id:userDoc._id},jwtSecret,{},(err,token)=>{
                if(err)
                throw err;
                res.cookie('token',token).json(userDoc);

            })
            
        }
           else
           console.log("Not pass");
        }
        else{
            console.log("Not Found");
        }
});
app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    if(token)
    {
        jwt.verify(token,jwtSecret,{},async (err,userData)=>{
            if(err)
            throw err;
            const {name,email,_id} = await User.findById(userData.id);
        res.json({name,email,_id});
        })
    }else
    res.json(null);
});

app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
});

app.post('/upload-by-link',async (req,res)=>{
    const {link} = req.body;
    const newName ='photo'+ Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname+'/uploads/'+newName,
    });
    res.json(newName);
});
const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload',photosMiddleware.array('photos',100),(req,res)=>{
    const uploadFiles =[];
    for(let i = 0;i<req.files.length;i++)
    {
       const {path,originalname} = req.files[i];
       const parts = originalname.split('.');
       const ext = parts[parts.length-1];
       const newPath = path +'.'+ext;
       fs.renameSync(path,newPath);
       uploadFiles.push(newPath.replace("uploads\\",''));
    }
res.json(uploadFiles);
});
app.listen(4000);