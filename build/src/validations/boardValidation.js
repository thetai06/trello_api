"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.boardValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _httpStatusCodes = require("http-status-codes");
var _boardController = require("../controllers/boardController.js");
var _ApiError = _interopRequireDefault(require("../utils/ApiError.js"));
var creatNew = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var correctCondition;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          /*
          Quan trọng: Việc validate dữ liệu bắt buộc phải có ở phía backend vì đây là điểm cuối để lưu trữ dữ liệu vào database,
          nếu không có validation ở backend thì dù có validate ở frontend đi chăng nữa thì vẫn có thể bị tấn công bằng cách gửi trực tiếp
          request đến API mà không thông qua frontend, điều này có thể dẫn đến việc lưu trữ dữ liệu không hợp lệ hoặc thậm chí là dữ liệu độc hại vào
          */
          correctCondition = _joi["default"].object({
            title: _joi["default"].string().required().min(3).max(50).trim().strict().messages({
              'any.required': 'Title is required (letai)',
              'string.base': 'Title must be a string (letai)',
              'string.empty': 'Title cannot be empty (letai)',
              'string.min': 'Title must be at least 3 characters long (letai)',
              'string.max': 'Title must be at most 50 characters long (letai)'
            }),
            description: _joi["default"].string().required().min(3).max(256).trim().strict()
          });
          _context.prev = 1;
          _context.next = 4;
          return correctCondition.validateAsync(req.body, {
            abortEarly: false
          });
        case 4:
          next();
          _context.next = 10;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_GATEWAY, _context.t0.message));
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 7]]);
  }));
  return function creatNew(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var boardValidation = {
  creatNew: creatNew
};
exports.boardValidation = boardValidation;