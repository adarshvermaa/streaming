import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ENV } from '../config/env';
import express, { Request } from 'express';
import { isValidUser, loginWithGoogle } from '../main/services/user_services/user.services';
import { GoogleProfile } from '../main/type/users/users.type';


// Initialize Passport Middleware
export const googleAuthMiddleware = (app: express.Application) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new GoogleStrategy(
            {
                clientID: ENV.GOOGLE_CLIENT_ID!,
                clientSecret: ENV.GOOGLE_CLIENT_SECRET!,
                callbackURL: ENV.GOOGLE_CALLBACK_URL!,
                scope: ['profile', 'email', 'openid'],
                accessType: 'offline', // Required for refresh token
                prompt: 'consent', // Ensures refresh token is received every time
            },
            async (accessToken, refreshToken, profile, done) => {
                // Save refreshToken securely (e.g., in DB)
                return done(null, { profile, accessToken, refreshToken });
            }
        )
    );
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user: any, done) => {
        done(null, user);
    });
};

// Create Router for Google Authentication
const router = express.Router();

// Route to initiate Google login
router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// Google OAuth Callback Route
router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: ENV.FRONTEND_URL_LIVE_FAILURE }),
    async (req, res) => {
        const { user } = req as Request & { user: GoogleProfile };
        const userResponse = await isValidUser({ email: user.profile._json.email });
        if (userResponse) {
            res.redirect(`${ENV.FRONTEND_URL_LIVE}?token=${user.accessToken}`);
        } else {
            await loginWithGoogle(user);
            res.redirect(`${ENV.FRONTEND_URL_LIVE_FAILURE}?token=${user
                .accessToken}`);
        }
    }
);

export default router;
