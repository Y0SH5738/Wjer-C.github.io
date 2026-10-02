const songList = []
fetch('./songs.json')
    .then(res => res.json())
    .then(data => {
        var songsJson = data
        for (x in songsJson) {
            songList.push(String(songsJson[x]));
        }
        saveAudioToCache(songList);
        init();
})
var songsList = songList
const SL = document.getElementById('songPrint');
const shuffleButton = document.getElementById('shuffle');
const songPlayer = document.getElementById('song');
const audio = document.getElementById('audio');
const collapsibleList = document.getElementById('all');
audio.loop = false;

async function saveAudioToCache(songs) {
    const cacheName = 'song-cache';
    const cache = await window.caches.open(cacheName);
    for (const song of songs) {
        try{
            await cache.add('songs/' + song); 
        } catch (error) {
            console.error("no song cache", song, error)
        }
    }
}

async function shuffle(currentSong) {
    const cache = await window.caches.open('song-cache');
    const cachedResponse = await cache.match('songs/' + String(currentSong));
    const songBlob = await cachedResponse.blob();
    const localUrl = URL.createObjectURL(songBlob);

    songPlayer.src = localUrl;
    audio.load();
    audio.play();

    songsList = songList.filter(item => item !== currentSong);
}

function repeatSongs(){
    currentSong = getRandomItem(songsList);
    SL.textContent = currentSong;
    shuffle(currentSong);
}

function getRandomItem(arr) {
    if (arr.length <= 0) {
        songsList = songList
    }

    var song = arr[Math.floor(Math.random() * arr.length)];

    if (song == undefined) {
        repeatSongs()
    }
    return song
};

function setSong(song) {
    currentSong = song
    shuffle(currentSong)
}


audio.addEventListener('ended', () => {
    currentSong = getRandomItem(songsList);
    SL.textContent = currentSong;
    shuffle(currentSong);
});

shuffleButton.addEventListener("click", function() {
    currentSong = getRandomItem(songsList);
    SL.textContent = currentSong;
    SL.onclick = () => setSong(currentSong);
    shuffle(currentSong);
});


function init() {
    currentSong = getRandomItem(songsList);
    SL.textContent = currentSong;

    collapsibleList.innerHTML = songList
        .map(songList => `<li onclick='setSong("${songList}")'>${songList}</li><div class="divide"></div>`)
        .join('');

    shuffle(currentSong);
    init = false
}
