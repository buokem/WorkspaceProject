// auth.js
const jwt = require('jsonwebtoken');

/**
 * Role-aware auth middleware factory.
 * Usage: auth({ roles: ['admin'] }) or auth() for any logged-in user.
 */

//set roles to empty array and redirect to login as default parameters
function auth({ roles = [], redirectTo = '/authentication/login'}) {
    //return a middleware function
    return function (req, res, next) {
        try {
            
            let token = null;
            //get request authorization header
            const authHeader = req.headers.authorization;
            //if header is present and starts with Bearer
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7);//get the token portion
            }
            else if(req.cookies?.token){
                token = req.cookies.token
            }
            //if token is still null
            if (!token) {
                return redirect(res, redirectTo, 'no_token');//redirect to login page
            }

            //Verify token
            let payload;
            try {
                payload = jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                const reason = err.name === 'TokenExpiredError' ? 'expired' : 'invalid';
                return redirect(res, redirectTo, reason);
            }

            // 3) Attach user info to req for page personalization
            req.user = {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
            };

            // check if role isn't included in the roles array
            if (roles.length > 0 && !roles.includes(req.user.role)) {
                return redirect(res, redirectTo, 'forbidden');
            }

            //no issues
            return next();
        } catch (err) {
            console.error('Auth middleware error:', err);
            return redirect(res, redirectTo, 'error');
        }
    };
}

function redirect(res, to, reason) {
    const url = new URL(to, 'http://localhost:3000');
    //set reason and returnTo paths
    url.searchParams.set('reason', reason);
    // 302 redirect
    return res.redirect(url.pathname + '?' + url.searchParams.toString());
}

module.exports = { auth };
