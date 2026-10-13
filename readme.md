# Now Playing

had to make a new repo for this as i hardcoded some api keys in the prev one 😭😭😭

#### after logging in with spotify, the site shows whatever you're currently listening to. details include song, artist, album and the album cover with links to spotify

#### background cycles through colours pulled from the album cover, stops changing if song is paused

live at [np.harry.report](https://np.harry.report)<br>
(logging in will shouldn't work as spotify apps are private and only allow for [5 extra users](https://developer.spotify.com/documentation/web-api/concepts/quota-modes))

## the method

- `/` checks for token, redirects to `/login`
- `/auth` sends you to spotify to log in
- `/callback` swaps the login code for tokens, main and refresh
- `/np` returns the current song (and refreshes the token if it's expired)
- `/` -> `/login` -> `/auth` -> `/callback` -> `/` -> `/np`

## setup

get your own credentials by making an app in the [spotify developer dashboard](https://developer.spotify.com/dashboard)

`.env`
```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=http://127.0.0.1:8787/callback
# wrangler default port is 8787
```
`terminal`

```
npm install
npx wrangler dev
```
