import passport from 'passport';
import { OIDCStrategy } from 'passport-azure-ad';

passport.use(new OIDCStrategy({
    // identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
    identityMetadata: `https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration`,
    clientID: process.env.CLIENT_ID as string,
    responseType: 'code',
    responseMode: 'query',
    // redirectUrl: 'http://localhost:3000/Auth/callback',
    redirectUrl: process.env.REDIRECT_URL || 'http://localhost:3000/Auth/callback',
    clientSecret: process.env.CLIENT_SECRET,
    scope: ['profile', 'email', 'openid', 'User.Read'],
    allowHttpForRedirectUrl: true,
    passReqToCallback: true,
    validateIssuer: false, 
    loggingLevel: 'info'
  },
  (req:any,iss: any, sub: any, profile: any, accessToken: any, refreshToken: any, done: any) => {
    const normalizedProfile = {
        oid: profile.oid,
        userName: profile.displayName || profile.name || "Usuário Sem Nome",
        email: profile.emails || [profile._json.email],
        preferred_username: profile._json.preferred_username,
        accessToken: accessToken
      }; 
    // console.log(profile)
    // console.log(`\n\n\n ${normalizedProfile.email} \n${normalizedProfile.userName}\n${normalizedProfile.preferred_username}\n${normalizedProfile.oid}\n\n\n`)
    return done(null, normalizedProfile);
    // return done(null, profile);
    
  }
));

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));