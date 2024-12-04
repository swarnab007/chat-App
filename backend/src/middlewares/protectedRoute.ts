import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

interface decoded extends jwt.JwtPayload {
  userId: string;
}

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.body.userId = (decoded as decoded).userId;

    next();
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

export default authCheck;
