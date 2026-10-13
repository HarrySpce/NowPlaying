import { auth } from './auth.js';
import { callback } from './callback.js';
import { nowplaying } from './np.js';

export default {
    fetch(request, env) {
        switch (new URL(request.url).pathname) {
            case '/auth':
                return auth(env);
            case '/callback':
                return callback(request, env);
            case '/np':
                return nowplaying(request, env);
            default:
                return Response.redirect('https://harry.report/404', 303);
        }
    },
};
