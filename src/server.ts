import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '../', 'public')));
app.use(passport.initialize());
app.use(passport.session());
import passportConfig from './config/passport';

app.get('/auth/google', passport.authenticate('google', { scope: ['openid email profile'] }));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server listening http://localhost:${PORT}`));
