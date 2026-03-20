import express from 'express';
import { Dbconnection } from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

Dbconnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
 