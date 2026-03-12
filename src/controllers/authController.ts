import {Request, Response } from "express";
import User from "../models/User";
import bcrypt from 'bcrypt';

export async function registerUsers(req:Request, res:Response){
    try{
    const existingUser = await User.findOne(({email: req.body.email}))
        if(existingUser){
            return res.status(400).json({message: 'Email already exists'});
        }
         
        const hashedPassword = await bcrypt.hash(req.body.password, 10)// In production, hash the password before saving
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword
        });
        
            const savedUser = await newUser.save();
            const responseUser= savedUser.toObject();
            delete responseUser.password// Exclude password from response
            res.status(201).json({message: 'User registered successfully', user: responseUser});
        }
        catch(error) {
            res.status(500).json({message: 'Error registering user', error});
        }
    }