import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const Register = async (req: Request, res: Response) => {
  try {
    const { fullname, email, username, password, confirmPassword, gender } =
      req.body;

    if (
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      !gender ||
      !fullname
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password does not match" });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // https://avatar-placeholder.iran.liara.run/
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await prisma.user.create({
      data: {
        username,
        fullname,
        email,
        password: passwordHash,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
      },
    });

    // generate token
    generateToken(newUser.id, res);

    return res.status(201).json(newUser);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    generateToken(user.id, res);

    return res.status(200).json(user);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

export const Logout = async (req: Request, res: Response) => {
  try {
    // clear cookie
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out" });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

export const getProflie = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.body.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};
