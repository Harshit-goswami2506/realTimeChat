import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
export const signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ userName,email, password: hashedPassword });

        const token = await genToken(user._id);
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 2 * 24 * 60 * 60 * 1000 });
        return res.status(201).json(user);
        
        
    } catch (error) {
        return res.status(500).json({ message: "Error while creating user", error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "User does not exists" });
        }
       const isPasswordValid = await bcrypt.compare(password, user.password);
       if(!isPasswordValid){
        return res.status(400).json({ message: "Invalid credentials" });
       }

        const token = await genToken(user._id);
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 2 * 24 * 60 * 60 * 1000 });
        return res.status(200).json(user);

        
        
    } catch (error) {
        return res.status(500).json({ message: "Error while login user", error: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "None"
}); 
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: "Error while logout user", error: error.message });
    }
}
