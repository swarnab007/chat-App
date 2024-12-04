import express, { Request, Response } from "express"
import dotenv from "dotenv"
import authRouter from "./routes/authRoutes.js"
import messageRouter from "./routes/messageRoutes.js"

dotenv.config({ path: './.env' });

const app = express();

app.use(express.json());
app.use("api/v1/auth", authRouter)
app.use("api/v1/messages", messageRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});