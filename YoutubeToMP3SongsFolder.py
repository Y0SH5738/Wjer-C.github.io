import os
import yt_dlp
from pathlib import Path
import json

folder = r"./Wjer-C.github.io/songs"
songNum = len(list(Path(folder).iterdir()))
files = sorted(Path(folder).iterdir())
newSong = True

def download_youtube(video_url, download_type):
    global newSong
    global files

    ydl_opts = {
        'outtmpl': os.path.join(folder, str(songNum + 1) + ' - ' + '%(title)s.%(ext)s'), 
    }

    if download_type == 'mp3':

        ydl_opts['format'] = 'bestaudio/best'
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192', 
        }]

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
        songAddData = ydl.extract_info(url, download=False)
        songAddWebm = ydl.prepare_filename(songAddData)
        songAdd = os.path.basename(songAddWebm.rsplit('.', 1)[0] + '.mp3')
        with open("Wjer-C.github.io/songs.json", "w") as songJson:
            fileList = []
            for file in files:
                fileList.append(os.path.basename(file))
            fileList.append(songAdd)
            json.dump(fileList, songJson)

while newSong:
    url = input("Enter YouTube URL: ").strip()
    
    print(f"\nDownloading {"mp3".upper()}")

    download_youtube(url, "mp3")
    newSong = False