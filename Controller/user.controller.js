import userModel from "../Model/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

// Register a new user
export function registerUser(req, res) {
    const { username, email, password } = req.body;
    try {
        userModel.findOne({ email: email })
            .then(data => {
                const hashedPassword = bcrypt.hashSync(password, 10);
                if (!data) {
                    const newuser = new userModel({
                        username,
                        email,
                        password: hashedPassword
                    });
                    newuser.save()
                        .then(() => res.status(201).json({ message: "Successfully Registered", error: false }))
                        .catch(err => res.status(500).json({ error: true, message: err.message }));
                } else {
                    res.status(200).json({
                        message: "Email already registered",
                        error: true
                    });
                }
            })
            .catch(err => {
                res.status(500).json({ error: true, message: err.message });
            });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
}

// Login user and return JWT token
export function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        userModel.findOne({ email: email })
            .then(data => {
                if (!data) {
                    return res.status(404).json({ error: true, message: 'Create account before login' });
                }
                const ValidPassword = bcrypt.compareSync(password, data.password);
                if (ValidPassword) {
                    const accesstoken = jwt.sign({ email: email }, 'Secretkey', { expiresIn: '2h' });
                    return res.status(200).json({ token: accesstoken });
                }
                res.status(400).json({ error: true, message: 'Invalid Password' });
            })
            .catch(err => {
                res.status(500).json({ error: true, message: err.message });
            });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
}

// Return the currently logged-in user's data
export function fetchUser(req, res) {
    return res.status(200).json(req.user);
}