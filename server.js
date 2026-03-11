const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/linksdb', {useNewUrlParser:true, useUnifiedTopology:true});
const LinkSchema = new mongoose.Schema({ url: String, user: String });
const UserSchema = new mongoose.Schema({ username: String, password: String });

const Link = mongoose.model('Link', LinkSchema);
const User = mongoose.model('User', UserSchema);

// ----------- Authentication -----------

// Password login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if(user) {
    req.session.user = username;
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

// Touch ID / WebAuthn placeholder
app.get('/webauthn/challenge', (req,res)=>{
  // Normally return a WebAuthn challenge; simplified for demo
  res.json({ challenge: 'demo-challenge' });
});

app.post('/webauthn/verify', (req,res)=>{
  // Normally verify Touch ID; simplified for demo
  if(req.session.user) return res.sendStatus(200);
  res.sendStatus(401);
});

// ----------- Links API -----------

app.post('/add-link', async (req, res) => {
  if(!req.session.user) return res.sendStatus(401);
  const link = new Link({ url: req.body.url, user: req.session.user });
  await link.save();
  res.sendStatus(200);
});

app.get('/links', async (req, res) => {
  if(!req.session.user) return res.sendStatus(401);
  const links = await Link.find({ user: req.session.user });
  res.json(links.map(l => l.url));
});

// ----------- Register user (for demo) -----------

app.post('/register', async (req,res)=>{
  const { username, password } = req.body;
  const exists = await User.findOne({username});
  if(exists) return res.status(400).send('User exists');
  const user = new User({username, password});
  await user.save();
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
