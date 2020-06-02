const express = require('express');
const app = express();
const parser = require('body-parser');
const db = require('mysql');
const authRouter = require('./routes/authRoutes');
const settingsRouter = require('./routes/settingsRoutes');
const cors = require('cors');

app.use(cors());
app.use(parser.json());
app.use("/images", express.static('images'));

const connection = db.createConnection({
    database: 'pockethealth',
    user: 'mesic',
    password: 'tibor123',
    host: 'localhost'
});

connection.connect(error => {
    if(error) throw error;
    console.log('Database connected.')
});

app.use('/api/users', authRouter);
app.use('/api/settings', settingsRouter);

module.exports = app;