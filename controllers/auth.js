const db = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connection = db.createConnection({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    multipleStatements: true
});

connection.connect(error => {
    if(error) throw error;
    console.log('Database connected.')
});

exports.createUser = (req, res, next) => {
    const password = req.body.password;
    const username = req.body.username;
    const commandCreateUser = 'insert into users set username=?, password=?';
    const commandCreateInfo = 'insert into userinfo set username=?, user=?';
    bcrypt.hash(password, 10, (error, hash) => {
        
        if(error) throw error;
        
        connection.query(commandCreateUser, [username, hash], (error, response) => {
            
            if(error){

                if(error.code === 'ER_DUP_ENTRY'){
                    res.status(404).json({message:'Username already exists.'});
                    return;
                }

                throw error;
            }

            connection.query(commandCreateInfo, [username, response.insertId], (error, response) => {
                res.status(201).json('User added succesfully');
            });

        });
    });
};

exports.loginUser = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const command = 'select * from users where username=?';
    connection.query(command, username, (error, response) => {
        if(error) throw error;

        if(!response[0]){
            return res.status(404).json({message: 'Username or password is incorrect!'});
        }

        const user = response[0];

        bcrypt.compare(password, user.password, (error, response) => {
            if(error) throw error;
            if(!response){
                return res.status(404).json({message: 'Username or password is incorrect!'});
            }

            let token = jwt.sign({username: user.username, id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});

            res.status(201).json({
                token: token,
                expTime: '3600'
            });
        });
    });
};