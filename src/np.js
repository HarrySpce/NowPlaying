import { parse } from 'cookie';
import { requestToken } from './token.js';

function getCurrentlyPlaying(accessToken) {
    return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
}

export async function nowplaying(request, env) {
    const cookies = parse(request.headers.get('Cookie') || '');
    if (!cookies.main) {
        return Response.json({ error: '(7) not authenticated' }, { status: 401 });
    }

    const headers = new Headers();
    let response = await getCurrentlyPlaying(cookies.main);

    if (response.status === 401 && cookies.refresh) {
        const data = await requestToken(env, {
            grant_type: 'refresh_token',
            refresh_token: cookies.refresh,
        });
        if (!data.access_token) {
            return Response.json({ error: '(9) token refresh failed' }, { status: 401 });
        }
        headers.append('Set-Cookie', `main=${data.access_token}; Path=/; HttpOnly; SameSite=Lax`);
        response = await getCurrentlyPlaying(data.access_token);
    }

    if (!response.ok) {
        return new Response('(10) error fetching currently playing song', { status: 500 });
    }

    // 204 = nothing (paused)
    const song = response.status === 204 ? null : await response.json();
    if (!song || song.is_playing === false) {
        return Response.json({ message: '(11) no song / paused' }, { headers });
    }

    return Response.json(song, { headers });
}
