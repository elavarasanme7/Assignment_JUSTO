const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5000;
const SALT_ROUNDS = 10;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const  jwtSecret = 'ela@994444';
const jwtExpiration =  '1h'

//DB Connection 
const pool = new Pool({
  user: 'postgres', 
  host: 'localhost', 
  database: 'postgres', 
  password: 'Ela@994444', 
  port: 5432, 
});
app.use(cors());

app.use(bodyParser.json());

// Signup 
app.post('/api/auth/signup', async (req, res) => {
  const { username, password, email, phone } = req.body;

  
  if (!username || !password || password.length < 5) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  try {
    
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

  
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

   
    await pool.query('INSERT INTO users (username, password, email, phone) VALUES ($1, $2, $3, $4)', [username, hashedPassword, email, phone]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (user.rows.length === 0) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      const token = jwt.sign({ username: user.rows[0].username }, jwtSecret, { expiresIn: jwtExpiration });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/onetime', async (req, res) => {
    const { emailOrPhone } = req.body;
  
    try {
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1 OR phone = $2', [emailOrPhone, emailOrPhone]);
      const user = userResult.rows[0];
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  
      await pool.query('INSERT INTO tokens (token, user_id, expires_at) VALUES ($1, $2, $3)', [token, user.id, expiresAt]);
  
      res.json({ link: `http://localhost:3000/api/auth/validate?token=${token}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/auth/validate', async (req, res) => {
    const { token } = req.query;
  
    try {
      const tokenResult = await pool.query('SELECT * FROM tokens WHERE token = $1', [token]);
      const tokenData = tokenResult.rows[0];
  
      if (!tokenData || tokenData.used || new Date(tokenData.expires_at) < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      await pool.query('UPDATE tokens SET used = true WHERE id = $1', [tokenData.id]);
  
      const authToken = jwt.sign({ userId: tokenData.user_id }, jwtSecret, { expiresIn:jwtExpiration });
  
      res.json({ token: authToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/time', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }
  
    try {
      const payload = jwt.verify(token, jwtSecret);
      res.json({ currentTime: new Date().toISOString() });
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  });

  app.post('/api/kickout', async (req, res) => {
    const { username } = req.body;
  
    try {
      const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = userResult.rows[0];
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await pool.query('DELETE FROM tokens WHERE user_id = $1', [user.id]);
  
      res.json({ message: 'User kicked out successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
