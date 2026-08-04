require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://task4-ml-bench-task-management-syst-three.vercel.app'
    ],
    credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;