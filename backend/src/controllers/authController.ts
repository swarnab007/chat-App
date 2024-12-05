import { Request, RequestHandler, Response } from "express";
import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Register a new user
export const Register: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fullname, email, username, password, confirmPassword, gender } =
      req.body;

    // Validate input fields
    if (
      !fullname ||
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    // Check if the username already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Set profile picture based on gender
    const profilePic = gender === "male"
      ? `https://avatar.iran.liara.run/public/boy?username=${username}`
      : `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        username,
        password: passwordHash,
        gender,
        profilePic,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        username: true,
        gender: true,
        profilePic: true,
      },
    });

    // Generate authentication token
    generateToken(newUser.id, res);

    // Respond with the created user
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User login
export const Login: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;

    // Validate input fields
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    // Generate authentication token
    generateToken(user.id, res);

    // Exclude the password field from the response
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    console.error("Error in loginUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User logout
export const Logout: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error: any) {
    console.error("Error in logoutUser:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user profile
export const getProfile: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.body.userId;

    // Fetch the user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
        email: true,
        username: true,
        gender: true,
        profilePic: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error in getUserProfile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
