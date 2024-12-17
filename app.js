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
const http         = require("http").Server(app);
const io           = require("socket.io")(http, { cors: { origin: "*" } });
const port         = process.env.PORT || 3100;

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

io.on("connection", (socket) => {
  console.log("join new client", socket);

  socket.on("connecting", (info) => {
    console.log("join ::", info);

    socket.join("" + info.key);

    io.to("" + info.key).emit("connected", "success 1234");
  });

  socket.on("send_notif", (to) => {
    console.log("send_notif : ", to);
    to = "" + to;
    io.to(to).emit(to, "success notif_to_" + to);
  });

  socket.on("disconnect", (msg) => {
    console.log("@on : logout", msg);
    // io.emit('logout', msg);
  });
});

http.listen(port, () => {
  console.clear();
  console.log(`Socket.IO server running at http://localhost:${port}`);
});

// module.exports = app;
