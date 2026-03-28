"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API_v1 = void 0;
var _express = _interopRequireDefault(require("express"));
var _httpStatusCodes = require("http-status-codes");
var _boardRoute = require("./boardRoute");
var Router = _express["default"].Router();
Router.get('/status', function (req, res) {
  res.status(_httpStatusCodes.StatusCodes.OK).json({
    message: 'APIs v1 are ready to use!',
    Code: _httpStatusCodes.StatusCodes.OK
  });
});
Router.use('/boards', _boardRoute.boardRoute);
var API_v1 = Router;
exports.API_v1 = API_v1;