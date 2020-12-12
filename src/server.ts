import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import postgresSession from 'connect-pg-simple';

const app = express();
app.use(express.static(path.join(__dirname, '../', 'public')));

const pgSession = postgresSession(session);
app.use(
	session({
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
	})
);
app.use(cookieParser('keyboard cat'));

app.use(passport.initialize());
app.use(passport.session());
import passportConfig from './config/passport';
passportConfig(passport);

/*
 * GET /auth/google
 *
 * Redirect to Google Login.
 */
app.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'email', 'profile'] }));

/*
 * GET /auth/google/callback
 *
 * Callback redirect after user has logged into Google.
 */
app.get(
	'/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/protected.html' }),
	function (req, res) {
		// Successful authentication, redirect home.
		console.log(req.user);
		res.redirect('/');
	}
);

/*
 * GET /protected
 *
 * Get the user info object
 */
app.get('/protected', (req, res) => {
	console.log('request on protected route');
	res.json(req.user);
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server listening http://localhost:${PORT}`));
