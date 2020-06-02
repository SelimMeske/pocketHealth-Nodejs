const db = require('mysql');

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

exports.updateSettings = (req, res, next) => {
    let command = 'update userinfo set gender=?, profileImg=?, age=?, height=?, weight=?, goalweight=?, activitylevel=? where user=?';
    let imagePath = req.body.profileImage;
    if(req.file){
        imagePath = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
    }
    let userInfo = [req.body.gender, imagePath, req.body.age, req.body.height, req.body.weight, req.body.goalWeight, req.body.activityLevel, req.userInfo.userId]
    
    connection.query(command, userInfo, (error, response) => {
        if(error) throw error;
        res.status(201).json(
            {message: 'Settings saved successfully!'}
            );
        
    });
};

exports.getSettings = (req, res, next) => {
    let command = 'select * from userinfo where user=? AND username=?';
    let userId = req.userInfo.userId;
    let userName = req.userInfo.username;
    connection.query(command, [userId, userName], (error, response) => {
        if(error) throw error;
        res.status(201).json({
            userInfo: response[0]
        })
    });
};