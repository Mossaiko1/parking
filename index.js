import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/cellRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/cells', routes); 

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_CNN)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });



