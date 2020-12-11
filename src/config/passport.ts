import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

export default function (passport: any) {
	console.log(process.env.GOOGLE_CLIENT_ID);
	passport.serializeUser(function (user: any, done: any) {
		// done(null, user.id);
		done(null, user);
	});

	passport.deserializeUser(function (obj: any, done: any) {
		// Users.findById(obj, done);
		done(null, obj);
	});

	passport.use(
		new GoogleStrategy(
			{
				google: {
					clientID: process.env.GOOGLE_CLIENT_ID,
					clientSecret: process.env.GOOGLE_CLIENT_SECRET,
					callbackURL: 'http://localhost:4000/auth/callback',
				},
			},
			function (accessToken: string, refreshToken: string, profile: any, done: any) {
				// Typically you would query the database to find the user record
				// associated with this Google profile, then pass that object to the `done`
				// callback.
				return done(null, profile);
			}
		)
	);
}
