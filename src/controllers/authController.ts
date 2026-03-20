import {Request, Response } from "express";
import User from "../models/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function registerUsers(req:Request, res:Response){
    console.log('Received registration request:', req.body);
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
            console.log('Error registering user:', error);
            res.status(500).json({message: 'Error registering user', error});
        }
    }


export async function loginUsers(req:Request, res:Response){
    // Implement login logic here
    try{
    const Dbuser= await User.findOne({email: req.body.email})
    if(!Dbuser){
        return res.status(400).json({message: 'Invalid email or password'});
    }
    const isPasswordvalid = await bcrypt.compare(req.body.password, Dbuser.password);
    if(!isPasswordvalid){
        return res.status(400).json({message: 'Invalid email or password'});
    }
    const token = jwt.sign({userId: Dbuser._id, email: Dbuser.email}, process.env.JWT_SECRET as string, {expiresIn: '15m'});
    const refreshToken = jwt.sign({userId: Dbuser._id, email: Dbuser.email}, process.env.REFRESH_TOKEN_SECRET as string, {expiresIn: '7d'});
    Dbuser.refreshToken = refreshToken;
    await Dbuser.save();
    const responseUser= Dbuser.toObject();
    delete responseUser.password// Exclude password from response
    delete responseUser.refreshToken// Exclude refresh token from response
    res.status(200).json({message: 'Login successful', user: responseUser, token, refreshToken});
}
catch(error){
    console.log('Error logging in user:', error);
    res.status(500).json({message: 'Error logging in user', error});
}
}

export async function refreshToken(req:Request, res:Response){
    const {refreshToken}= req.body;
    if(!refreshToken){
        return res.status(400).json({message: 'No refresh token provided'});
    }
    let errorc=0;
    try{
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
    errorc++;
    const user = await User.findOne({refreshToken: refreshToken});
    if(!user){
        return res.status(403).json({message: 'Invalid refresh token user not found'});
    }
    errorc++;
    const newToken = jwt.sign({userId: user._id, email: user.email}, process.env.JWT_SECRET as string, {expiresIn: '15m'});
    res.status(200).json({token: newToken});
    }catch(error){
        return res.status(403).json({message: 'Invalid refresh token'+ ` ${errorc}`});
    }
}

export async function logoutUsers(req:Request, res:Response){
    // Implement logout logic here (if using token-based authentication, you might want to handle token invalidation)
    const userId = req.user.userId;
    try{
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({message: 'User not found'});
    }
    user.refreshToken = undefined;
    await user.save();
    }
    catch(error){
        console.log('Error logging out user:', error);
        return res.status(500).json({message: 'Error logging out user', error});
    }
    res.status(200).json({message: 'Logout successful'});
}