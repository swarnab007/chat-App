import jwt from "jsonwebtoken";
import { Response } from "express";


const generateToken = (id: string, res: Response) => {
  // create token
  const token = jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  // send token in cookie
  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // MS,
    httpOnly: true, // prevent XSS cross site scripting
    sameSite: "strict", // CSRF attack cross-site request forgery
    secure: process.env.NODE_ENV !== "development", // HTTPS
  });

  return token;
};

export default generateToken;
