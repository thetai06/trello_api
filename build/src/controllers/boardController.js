"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.boardController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var creatNew = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          try {
            // console.log('req.body:', req.body)
            // console.log('req.query:', req.query)
            // console.log('req.params:', req.params)
            // console.log('req.cookies:', req.cookies)
            // console.log('req.jwtDecoded:', req.jwtDecoded)

            //Điều hướng dữ liệu sang tầng service để xử lý logic nghiệp vụ, sau đó trả về response cho client
            res.status(_httpStatusCodes.StatusCodes.CREATED).json({
              message: 'Post from controller: API create new board'
            });

            // throw new ApiError(StatusCodes.BAD_GATEWAY, 'Letai error test')
          } catch (error) {
            next(error);
          }
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function creatNew(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var boardController = {
  creatNew: creatNew
};
exports.boardController = boardController;