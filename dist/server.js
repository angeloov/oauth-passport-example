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
var express_session_1 = __importDefault(require("express-session"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
var app = express_1.default();
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'public')));
var pgSession = connect_pg_simple_1.default(express_session_1.default);
app.use(express_session_1.default({
    store: new pgSession({
        conString: process.env.conString,
        tableName: 'user_session',
    }),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
}));
app.use(cookie_parser_1.default('keyboard cat'));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
var passport_2 = __importDefault(require("./config/passport"));
passport_2.default(passport_1.default);
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['openid', 'email', 'profile'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/protected.html' }), function (req, res) {
    // Successful authentication, redirect home.
    console.log(req.user);
    res.redirect('/');
});
app.get('/protected', function (req, res) {
    console.log('request on protected route');
    res.json(req.user);
});
var PORT = process.env.PORT;
app.listen(PORT, function () { return console.log("\uD83D\uDE80 Server listening http://localhost:" + PORT); });
