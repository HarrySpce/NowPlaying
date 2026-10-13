import { requestToken } from './token.js';

export async function callback(request, env) {
    const code = new URL(request.url).searchParams.get('code');
    if (!code) {
        return new Response('(5) missing code in callback', { status: 400 });
    }

    const data = await requestToken(env, {
        grant_type: 'authorization_code',
        code,
        redirect_uri: env.SPOTIFY_REDIRECT_URI,
    });
    if (!data.access_token || !data.refresh_token) {
        return new Response('(6) failed to retrieve tokens from Spotify', { status: 500 });
    }

    const headers = new Headers({ Location: '/' });
    headers.append('Set-Cookie', `main=${data.access_token}; Path=/; HttpOnly; SameSite=Lax`);
    headers.append('Set-Cookie', `refresh=${data.refresh_token}; Path=/; HttpOnly; SameSite=Lax`);
    return new Response(null, { status: 302, headers });
}
