import express from "express";
import cors from "cors";
import "dotenv/config";
import connectdb from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import jobRouter from "./routes/jobRoute.js";
import postRouter from "./routes/postRoute.js";
import companyRouter from "./routes/companyRoute.js";
import exploreRouter from "./routes/exploreRoute.js";
import connectionRouter from "./routes/connectionRoute.js";
import searchRouter from "./routes/searchRoute.js";
import messageRoute from "./routes/messageRoute.js";
import authRoutes from "./routes/authRoute.js";
import passport from "passport";
import "./config/passport.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { populateTries } from "./config/populateTrie.js";
import { app, server } from "./config/socket.js";
import { Server } from "socket.io";
import chatRoute from "./routes/chatRoute.js"
import ExperienceRouter from './routes/ExperienceRoute.js'
import signupEmailRoute from './routes/signupEmailRoute.js'
// App config
const port = process.env.PORT || 8000;
connectdb();
populateTries();

const io = new Server(4000,{
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  //console.log(`Socket Connected`, socket.id);

  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("text:update", ({ text, to }) => {
    io.to(to).emit("text:update", { text });
  });

  socket.on("disconnect", () => {
    const email = socketidToEmailMap.get(socket.id);
    emailToSocketIdMap.delete(email);
    socketidToEmailMap.delete(socket.id);
    //console.log(`Socket Disconnected`, socket.id);
  });
});

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// cors({
//   origin: "*",
//   credentials: true,
// })


app.use(cookieParser());

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: { secure: false, httpOnly: true },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/user", userRouter);
app.use("/api/explore", exploreRouter);
app.use("/api/job", jobRouter);
app.use("/api/company", companyRouter);
app.use("/api/posts", postRouter);
app.use("/api/connections", connectionRouter);
app.use("/api", searchRouter);
app.use("/auth", authRoutes);
app.use("/api/message", messageRoute);
 app.use("/api/chat",chatRoute);
 app.use('/api/experienceshare', ExperienceRouter);
 app.use("/api/send",signupEmailRoute);
// Test Route
app.get("/", (req, res) => {
  res.send("Backend Running.");
});

// Start the server
server.listen(port, '0.0.0.0', () => {
  console.log(` Listening on port: ${port}`);
});
