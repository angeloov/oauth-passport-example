"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var passport_1 = __importDefault(require("passport"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'public')));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['openid email profile'] }));
var PORT = process.env.PORT;
app.listen(PORT, function () { return console.log("\uD83D\uDE80 Server listening http://localhost:" + PORT); });
