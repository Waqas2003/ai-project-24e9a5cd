const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  await user.save();
  res.json({ message: 'User created successfully' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
  res.json({ token });
});

app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().populate('comments');
  res.json(posts);
});

app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content });
  await post.save();
  res.json({ message: 'Post created successfully' });
});

app.post('/api/comments', async (req, res) => {
  const { postId, content } = req.body;
  const comment = new Comment({ postId, content });
  await comment.save();
  res.json({ message: 'Comment created successfully' });
});

app.listen(3000, () => console.log('Server started on port 3000'));