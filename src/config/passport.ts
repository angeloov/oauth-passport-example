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
			async function (accessToken: string, _: string, profile: any, done: any) {
				// Find or create the user and then
				// call the `done` function

				let googleProfile = profile['_json'];

				// Find or create from the db
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
