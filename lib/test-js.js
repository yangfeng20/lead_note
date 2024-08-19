const express = require('express');
const mysql = require('mysql');
const cors = require('cors');  // 首先，我们需要引入 cors 包

const app = express();

// 使用 cors 中间件
app.use(cors());

// 如果你只想允许特定的源，可以这样配置：
// app.use(cors({
//     origin: 'http://yourfrontendomain.com'
// }));

const connection = mysql.createConnection({
    host: 'rm-bp1p9v37124x7eg9e.mysql.rds.aliyuncs.com',
    user: 'root',
    password: 'ejOj@izj5jtbbDyDJ6F97YjQZST4w18v',
    database: 'jingrobot-test'
});

app.get('/api/getData', (req, res) => {
    const query = 'select DATE_FORMAT(NOW(), \'%Y-%m-%d %H:%i:%s\') as time, count(1) as value from call_job_channel where call_job_id = 110010434  and status  in (1,2,8);';
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);  // 使用 console.error 来记录错误
            res.status(500).json({ error: 'An error occurred' });  // 发送错误响应
            return;
        }
        res.json(results[0]);
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));