import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default function (passport: any) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: 'http://localhost:4000/auth/google/callback',
			},
			async function (accessToken: string, refreshToken: string, profile: any, done: any) {
				// Typically you would query the database to find the user record
				// associated with this Google profile, then pass that object to the `done`
				// callback.

				let googleProfile = profile['_json'];

				// Find or Create
				let user = await prisma.users.upsert({
					where: {
						googleid: profile.id,
					},
					update: {},
					create: {
						googleid: googleProfile.sub,
						firstname: googleProfile.given_name,
						lastname: googleProfile.family_name,
						lang: googleProfile.locale,
						email: googleProfile.email,
					},
				});

				if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			}
		)
	);

	passport.serializeUser((user: any, done: any) => {
		done(null, user.googleid);
	});

	passport.deserializeUser(async (obj: any, done: any) => {
		let user = await prisma.users.findUnique({
			where: {
				googleid: obj,
			},
		});
		done(null, user);
	});
}
