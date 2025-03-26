"use strict"

const createError  = require('http-errors');
const express      = require('express');
const path         = require('path');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const mongoose     = require('mongoose');
const app          = express();
const routes       = require('./routes/index');
const https        = require('https');
const fs           = require('fs');
const config       = require('./config.json');
const port         = config.port || 3100;
const sdk          = require("./src/libraries");

// Load SSL certificates
const options = {
  key: fs.readFileSync('localhost+2-key.pem'),
  cert: fs.readFileSync('localhost+2.pem'),
};

mongoose.connect(
  "mongodb://localhost:27017/new-pos",
  (_, __) => console.log('mongodb connected!'),
);

// view engine setup
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// main-router
app.use('/', routes);

app.post("/push", (req, res) => {
  try {
    console.log("post ::", req.body);

    io.to(req.body.key).emit(req.body.key, req.body);

    return res.send("sended");
  } catch (error) {
    console.log(error);

    return res.send(String(error));
  }
});
// catch 404 and forward to error handler
app.use((_, __, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Create HTTPS server correctly
const httpsServer = https.createServer(options, app);

// Initialize Socket.IO with the HTTPS server
const io = require("socket.io")(httpsServer, {
  cors: { 
    origin: ["http://0.0.0.0:4000", "http://localhost:4000", "http://127.0.0.1:4000"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["*"],
    transports: ['websocket', 'polling']
  }
});

io.on("connection", (socket) => {
  console.log("join new client", socket);

  socket.on("connecting", (info) => {
    console.log("join ::", info);
    console.log("join ::", info.key);

    socket.join("" + info.key);

    // io.emit("connected", "you're connected, " + info.key);
    io.to("" + info.key).emit("connected", "success 1234");
  });

  socket.on("send_notif", (to) => {
    console.log("send_notif : ", to);
    to = "" + to;
    // io.emit(to, "notif")
    io.to(to).emit(to, "haai");
    io.to(to).emit(to, "success notif_to_" + to);

    console.log(emit, "emit");
  });

  socket.on("disconnect", (msg) => {
    console.log("@on : logout", msg);
    // io.emit('logout', msg);
  });
});

httpsServer.listen(port, '0.0.0.0', () => {
  const { io: ioClient } = require("socket.io-client");
  const socket = ioClient("https://fem-socket.sebaris.link", {
  // const socket = ioClient("https://fem-socket.sebaris.link", {
    jsonp: true,
    reconnection: true,
    reconnectionDelay: 5000,
    reconnectionDelayMax: 85000,
    useSSL: false,
    transports: ['polling'], // Explicitly specify transport methods
  });
  // Debug connection status
  socket.on("connect", () => {
    console.log("Connected to fem-socket.sebaris.link");
    // Emit a join or authentication event if required by the server
    socket.emit('connecting', { key: 'customer-order' });
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
  });

  socket.on("customer-order", async (data) => {
    console.log("Received customer-order event:", data);
    // Add more specific handling of the data
    try {
      // You might want to emit this to your local socket.io server
      await generate_notification(data);
      io.emit('customer-order', data);
      // io.to("customer-order").emit("customer-order", data);
    } catch (error) {
      console.error("Error handling customer-order:", error);
    }
  });
  console.clear();
  console.log(`Server running at https://localhost:${port}/`);
});

async function generate_notification(data) {
  try {
    // Get today's start and end dates in local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Log the query parameters for debugging
    console.log("Query date range:", {
      start: today.toISOString(),
      end: tomorrow.toISOString()
    });

    // Count open_bill for today
    const open_bill_count = await sdk.db.open_bill.countDocuments({
      created_at: {
        $gte: today.toISOString(),
        $lt: tomorrow.toISOString()
      }
    });

    // Count transaction for today
    const transaction_count = await sdk.db.transaction.countDocuments({
      created_at: {
        $gte: today.toISOString(),
        $lt: tomorrow.toISOString()
      }
    });

    const todayCount = open_bill_count + transaction_count;

    console.log("Today's transaction count:", todayCount);
    const formatted_number = String(todayCount + 1).padStart(6, '0');

    sdk.db.notification.insertMany({
      ...data.data,
      order_number: formatted_number,
      created_by: "customer",
      status: "need_attention",
    });

    return formatted_number;
  } catch (error) {
    console.log("Error get_order_number", error);
    return null;
  }
}

// module.exports = app;


