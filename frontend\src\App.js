import React, { useState, useEffect } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState({ postId: '', content: '' });

  useEffect(() => {
    axios.get('http://localhost:3000/api/posts')
      .then(response => setPosts(response.data));
  }, []);

  const handleLogin = async (email, password) => {
    const response = await axios.post('http://localhost:3000/api/login', { email, password });
    setToken(response.data.token);
  };

  const handleSignup = async (username, email, password) => {
    const response = await axios.post('http://localhost:3000/api/signup', { username, email, password });
    setToken(response.data.token);
  };

  const handleCreatePost = async () => {
    const response = await axios.post('http://localhost:3000/api/posts', newPost);
    setPosts([...posts, response.data]);
    setNewPost({ title: '', content: '' });
  };

  const handleCreateComment = async () => {
    const response = await axios.post('http://localhost:3000/api/comments', newComment);
    setPosts(posts.map(post => {
      if (post._id === newComment.postId) {
        return { ...post, comments: [...post.comments, response.data] };
      }
      return post;
    }));
    setNewComment({ postId: '', content: '' });
  };

  return (
    <div>
      <h1>Blog App</h1>
      <Switch>
        <Route path="/" exact>
          <h2>Home</h2>
          <ul>
            {posts.map(post => (
              <li key={post._id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <ul>
                  {post.comments.map(comment => (
                    <li key={comment._id}>{comment.content}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Route>
        <Route path="/login">
          <h2>Login</h2>
          <form onSubmit={e => {
            e.preventDefault();
            handleLogin(e.target.email.value, e.target.password.value);
          }}>
            <input type="email" name="email" />
            <input type="password" name="password" />
            <button type="submit">Login</button>
          </form>
        </Route>
        <Route path="/signup">
          <h2>Signup</h2>
          <form onSubmit={e => {
            e.preventDefault();
            handleSignup(e.target.username.value, e.target.email.value, e.target.password.value);
          }}>
            <input type="text" name="username" />
            <input type="email" name="email" />
            <input type="password" name="password" />
            <button type="submit">Signup</button>
          </form>
        </Route>
        <Route path="/create-post">
          <h2>Create Post</h2>
          <form onSubmit={e => {
            e.preventDefault();
            handleCreatePost();
          }}>
            <input type="text" name="title" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
            <textarea name="content" value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} />
            <button type="submit">Create Post</button>
          </form>
        </Route>
        <Route path="/create-comment">
          <h2>Create Comment</h2>
          <form onSubmit={e => {
            e.preventDefault();
            handleCreateComment();
          }}>
            <input type="text" name="postId" value={newComment.postId} onChange={e => setNewComment({ ...newComment, postId: e.target.value })} />
            <textarea name="content" value={newComment.content} onChange={e => setNewComment({ ...newComment, content: e.target.value })} />
            <button type="submit">Create Comment</button>
          </form>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
```

**Deployment (Vercel)**

Create a `vercel.json` file with the following content: