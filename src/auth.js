export function auth(env) {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: env.SPOTIFY_CLIENT_ID,
        scope: 'user-read-currently-playing',
        redirect_uri: env.SPOTIFY_REDIRECT_URI,
    });
    return Response.redirect(`https://accounts.spotify.com/authorize?${params}`, 302);
}
