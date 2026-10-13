document.addEventListener('DOMContentLoaded', () => {
    let currentSongId = null;
    let colorIndex = 0;
    let colors = [];
    let colorTimeout;
    let isPlaying = false;

    const titleElement = document.getElementById('now-playing-title');
    const songNameElement = document.getElementById('song-name');
    const albumNameElement = document.getElementById('album-name');
    const artistNameElement = document.getElementById('artist-name');
    const animatedElements = [titleElement, songNameElement, albumNameElement, artistNameElement];

    function fetchCurrentlyPlaying() {
        fetch('/np')
            .then(response => {
                if (response.status === 401) {
                    window.location.href = '/login.html';
                    return;
                }
                if (!response.ok) {
                    throw new Error(`(0) error fetching currently playing song: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.item) {
                    // paused or nothing playing -> stop cycling colours
                    isPlaying = false;
                    clearTimeout(colorTimeout);
                    console.warn('(3) no song data available (paused?)');
                    return;
                }

                const wasPlaying = isPlaying;
                isPlaying = data.is_playing;
                if (data.item.id === currentSongId) {
                    if (isPlaying && !wasPlaying) {
                        updateBackgroundColor();
                    }
                    return;
                }

                const song = data.item;
                const albumArtUrl = song.album.images[0].url;
                currentSongId = song.id;

                // restart the slide-in animation
                animatedElements.forEach(element => element.classList.remove('slide-in'));
                void titleElement.offsetWidth;

                songNameElement.innerHTML = `<strong>🔊</strong> <a href="${song.external_urls.spotify}" target="_blank"><u>${song.name}</u></a>`;
                albumNameElement.innerHTML = `<strong>💿</strong> <a href="${song.album.external_urls.spotify}" target="_blank"><u>${song.album.name}</u></a>`;
                artistNameElement.innerHTML = `<strong>🎙️</strong> ${song.artists.map(artist => `<a href="${artist.external_urls.spotify}" target="_blank"><u>${artist.name}</u></a>`).join(', ')}`;

                animatedElements.forEach(element => element.classList.add('slide-in'));

                document.getElementById('album-art').src = albumArtUrl;
                document.title = song.name;

                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => {
                    try {
                        colors = new ColorThief().getPalette(img, 10);
                        colorIndex = 0;
                        updateBackgroundColor();
                    } catch (error) {
                        console.error('(1) error getting color:', error);
                    }
                };
                img.onerror = (error) => {
                    console.error('(2) error loading image:', error);
                };
                img.src = albumArtUrl;
            })
            .catch(error => {
                console.error('(4) error with current song:', error);
            });
    }

    function updateBackgroundColor() {
        clearTimeout(colorTimeout);
        if (colors.length > 0 && isPlaying) {
            const color = colors[colorIndex];
            document.documentElement.style.setProperty('--bg-color', `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
            const isLight = (0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]) / 255 > 0.5;
            document.body.style.color = isLight ? 'black' : 'white';
            document.getElementById('icon').classList.toggle('black', isLight);
            colorIndex = (colorIndex + 1) % colors.length;
            colorTimeout = setTimeout(updateBackgroundColor, 10000);
        }
    }

    setInterval(fetchCurrentlyPlaying, 1000);
    fetchCurrentlyPlaying();
});
