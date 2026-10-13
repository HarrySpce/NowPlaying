export async function requestToken(env, params) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams(params),
    });
    return response.json();
}

// now seperated instead of being defined twice