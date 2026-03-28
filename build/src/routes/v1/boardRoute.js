"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.boardRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _httpStatusCodes = require("http-status-codes");
var _boardValidation = require("../../validations/boardValidation.js");
var _boardController = require("../../controllers/boardController.js");
var Router = _express["default"].Router();
Router.route('/').get(function (req, res) {
  res.status(_httpStatusCodes.StatusCodes.OK).json({
    message: 'Get: API get list board'
  });
}).post(_boardValidation.boardValidation.creatNew, _boardController.boardController.creatNew);
var boardRoute = Router;
exports.boardRoute = boardRoute;