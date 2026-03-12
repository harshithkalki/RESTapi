import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

if(!process.env.DB_URL){
    throw new Error('DB_URL environment variable is not set');
}

const dbUrl = process.env.DB_URL;

export const Dbconnection= async() =>{
    try{
        await mongoose.connect(dbUrl);
        console.log('Database connected successfully');
    }
    catch(error){
        console.error('Database connection error:', error);
    }
}