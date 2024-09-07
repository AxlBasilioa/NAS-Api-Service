/*****************************************************************************/
//						this is an API for my personal NAS server
//				  the porpuse of this code is be able to upload any file
//				    remotely between devices in the same local network
//			for example, switching files between pc and laptop or even mobile
//					this API might be consume by an APP or web page
//				soon this part will be able in my github repos /axlbasilioa/
/*****************************************************************************/

const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const nasDirectory = process.env.NAS_DIRECTORY || '/home/';//you must use .env, in case of required directory is required directly
const jwtSecret = process.env.JWT_SECRET; // this is my super mega hyper key, you must have the same

app.use(express.json());
app.use(cors({origin:true})); //just for everyone in the local network

const users = [
	{
		username:process.env.USERNAME,
		password:bcrypt.hashSync(process.env.PASSWORD, 8)
	}
];


function generateToken(user){
	return jwt.sign({username:user.username}, jwtSecret, {expiresIn:'1h'}); //expires in one hour, i think in 1 hour any file can be upload or download
}
function authenticateToken(req, res, next){
	const token = req.headers['authorization'];
	if(!token) return res.status(401).send('access denied');
	jwt.verify(token.split(' ')[1], jwtSecret, (err, user)=>{
		if(err) return res.status(403).send('Invalid Token');
		req.user = user;
		next();
	});
};

//this is just for testing if server is running while turning on localhost:3000/api/test
app.get('/api/test',(req,res)=>{
	res.status(200).send('api is working!');
});


app.post('/api/login',(req,res)=>{
	const username = req.body.username;
	const password = req.body.password;
	if (!username || !password) {
		return res.status(400).send('Username and password are required');
	}	
	const user = users.find(u => u.username === username);
	if(!user) return res.status(404).send('User not found');
	const validPassword = bcrypt.compareSync(password, user.password);
	if(!validPassword) return res.status(401).send('Invalid Password');
	const token = generateToken(user);
	res.json({token});
});
app.get('/api/files/', authenticateToken, (req,res)=>{
	fs.readdir(nasDirectory, (err,files)=>{
		if(err){
			return res.status(500).send('Error listing files');
		}
		res.json(files);
	});
});
//multer for upload files

const storage = multer.diskStorage({
	destination:nasDirectory,
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}	
});
const upload = multer({storage});
//any file can be upload in case if i required fast uploads a single file of code between pc and laptop or mobile
app.post('/api/upload', authenticateToken, upload.single('file'), (req,res)=>{
	res.send('file upload successfully');
});

app.get('/api/files/:filename', authenticateToken, (req,res)=>{
	const filePath = path.join(nasDirectory, req.params.filename);
	res.download(filePath);
});
app.listen(port,()=>{
	console.log(`Api working at http:localhost:${port}`);
});
