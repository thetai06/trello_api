"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _express = _interopRequireDefault(require("express"));
var _asyncExitHook = _interopRequireDefault(require("async-exit-hook"));
var _mongodb = require("./config/mongodb.js");
var _environment = require("./config/environment");
var _v = require("./routes/v1");
var _errorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware");
var START_SERVER = function START_SERVER() {
  var app = (0, _express["default"])();

  // Enabla req.body json data
  app.use(_express["default"].json());

  // use API v1
  app.use('/v1', _v.API_v1);

  // Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
  // Lưu ý: Middleware xử lý lỗi tập trung phải được đặt ở cuối cùng sau tất cả các route và middleware khác để đảm bảo rằng
  // nó có thể bắt được tất cả các lỗi phát sinh trong quá trình xử lý request
  app.use(_errorHandlingMiddleware.errorHandlingMiddleware);
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
      message: 'Internal Server Error'
    });
  });
  app.listen(_environment.env.APP_PORT, _environment.env.APP_HOST, function () {
    // eslint-disable-next-line no-console
    console.log("3. Hi ".concat(_environment.env.AUTHOR, ", Back-end server is running successfully at host: ").concat(_environment.env.APP_HOST, " and port: ").concat(_environment.env.APP_PORT, "/"));
  });
  //thực hiện các tác vụ clean up trước khi dừng server, ví dụ như đóng kết nối đến MongoDB
  (0, _asyncExitHook["default"])(function () {
    console.log('4. Disconnecting from MongoDB Cloud Atlas...');
    (0, _mongodb.CLOSE_DB)();
    console.log('5. Disconnected from MongoDB Cloud Atlas successfully! Server is shutting down...');
  });
};
//cach 1: sử dụng Promise chaining để kết nối đến MongoDB và sau đó khởi động server
// console.log('1. connecting to MONGODB clound Atlas...')

// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error)
//     process.exit(0) // Exit the process with an error code
//   })

//cach 2: sử dụng async/await để kết nối đến MongoDB và sau đó khởi động server
(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.prev = 0;
        console.log('1. connecting to MONGODB clound Atlas...');
        _context.next = 4;
        return (0, _mongodb.CONNECT_DB)();
      case 4:
        console.log('2. Connected to MongoDB Cloud Atlas!');
        START_SERVER();
        _context.next = 12;
        break;
      case 8:
        _context.prev = 8;
        _context.t0 = _context["catch"](0);
        console.error(_context.t0);
        process.exit(0);
      case 12:
      case "end":
        return _context.stop();
    }
  }, _callee, null, [[0, 8]]);
}))();