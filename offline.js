const songList = []
fetch('./songs.json')
    .then(res => res.json())
    .then(data => {
        songsJson = data
        for (x in songsJson) {
            songList.push(String(songsJson[x]))
        }
        init()
})
var songsList = songList
const SL = document.getElementById('songPrint');
const shuffleButton = document.getElementById('shuffle');
const songPlayer = document.getElementById('song');
const audio = document.getElementById('audio');
const collapsibleList = document.getElementById('all');


currentSong = songList[1]
audio.loop = false;





async function saveAudioToCache(audioUrl) {
  const cacheName = 'song-cache';
  const cache = await window.caches.open(cacheName);

  await cache.add(audioUrl); 
}

for (const song of songList) {
    saveAudioToCache('songs/' + song);
}

async function shuffle(currentSong) {
    const cache = await window.caches.open('song-cache');
    const cachedResponse = await cache.match('songs/' + currentSong);
    console.log(cachedResponse);
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
