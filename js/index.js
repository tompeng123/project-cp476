window.onload = function () {


    var musicAudio = document.querySelector('#mic_audio'); // Audio tag
    var channel = document.querySelector('.channel'); // Channel label node
    var songTitle = document.querySelector('.song-title'); // Song name tag node
    var singer = document.querySelector('.singer'); // Singer tag node
    var recordImg = document.querySelector('.record-pic img'); // Album picture
    var recordPic = document.querySelector('.record-pic'); // Album picture outer div node
    var recordWrap = document.querySelector('.record-wrapper'); // Album area
    var playBtn = document.querySelector('.play'); // Play button
    var nextBtn = document.querySelector('.next'); // Next button
    var modeBtn = document.querySelector('.mode'); // Switch playback mode
    var progressBar = document.querySelector('.progress-bar'); // Progress bar outer div
    var progress = document.querySelector('.progress');  // Progress bar length
    var progressBtn = document.querySelector('.progress-btn'); // Progress bar drag button
    var lyricBtn = document.querySelector('.show-lyrics'); // Show lyrics button
    var lyrics = document.querySelector('.lyrics'); // Wrapped node of lyrics
    var bigBg = document.querySelector('.glass img'); //background picture
    var lyricsLiArr = null;

    var num = 1;
    

    

    getChannel();

    // Add an event to the play button
    playBtn.onclick = function () {
        musicAudio.onplaying = null;  
        if (musicAudio.paused) {
            playBtn.style.backgroundImage = 'url(img/play.png)';
            musicAudio.play();
        } else {
            playBtn.style.backgroundImage = 'url(img/pause.png)';
            musicAudio.pause();
        }
    };

    // Next button
    nextBtn.onclick = function () {
        getMusic();
    };


    // Mode button
    modeBtn.onclick = function () {
        if (musicAudio.loop) {
            musicAudio.loop = false;
            this.style.backgroundImage = 'url(img/random.png)';
        } else {
            musicAudio.loop = true;
            this.style.backgroundImage = 'url(img/circle.png)';
        }
    };

    // Show lyrics button
    lyricBtn.onclick = function () {
        if (recordWrap.style.display == 'block') {
            recordWrap.style.display = 'none';
            channel.style.fontSize = 0;
            if (!lyricsLiArr) {
                getlyric();
            }
        } else {
            recordWrap.style.display = 'block';
            channel.style.fontSize = '0.5rem';
        }
    };



    var isLoading = false;
    var progressTimer = setInterval(activeProgressBar, 300);

    // Activation progress bar
    function activeProgressBar () {
        var percentNum = Math.floor((musicAudio.currentTime / musicAudio.duration) * 10000) / 100 + '%';
        progress.style.width = percentNum;
        progressBtn.style.left = percentNum;

        if (percentNum == '100%' && !isLoading && !musicAudio.loop) {
            isLoading = true;
            getMusic();
        }
        if (musicAudio.paused && recordPic.className != 'record-pic mid') {
            recordPic.className = 'record-pic mid';
            playBtn.style.backgroundImage = 'url(img/pause.png)';
            return;
        } else if (recordPic.className != 'record-pic mid rotate' && !musicAudio.paused) {
            recordPic.className = 'record-pic mid rotate';
            playBtn.style.backgroundImage = 'url(img/play.png)';
        }

        // Control lyrics dynamic scrolling
        if (lyricsLiArr) {
            for (var i = 0, len = lyricsLiArr.length-1; i < len; i++) {
                var curT = lyricsLiArr[i].getAttribute('data-time');
                var nexT = lyricsLiArr[i+1].getAttribute('data-time');
                var curtTime = musicAudio.currentTime;
                if ((curtTime > curT) && (curtTime < nexT)) {
                    lyricsLiArr[i].className = 'active';
                    lyrics.style.top = (100 - lyricsLiArr[i].offsetTop) + 'px';
                } else {
                    lyricsLiArr[i].className = '';
                }
            }
        }
    }

    // Progress bar operation music playback progress
    progressBtn.addEventListener('mouseenter', function (e) {
        var percentNum = (e.clientX - progressBar.offsetLeft) / progressBar.offsetWidth;
        if (percentNum > 1) {
            percentNum = 1;
        } else if (percentNum < 0){
            percentNum = 0;
        }
        this.style.left = percentNum * 100 + '%';
        progress.style.width = percentNum * 100 + '%';
    });
    progressBtn.addEventListener('mouseleave', function (e) {
        var percentNum = (e.clientX  - progressBar.offsetLeft) / progressBar.offsetWidth;
        musicAudio.currentTime = musicAudio.duration * percentNum;
        progressTimer = setInterval(activeProgressBar, 300);
    });

    // Get allchannel
    function getChannel () {
        ajax({
            method: 'GET',
            async: false,
            url: 'http://api.jirengu.com/fm/getChannels.php',
            success: function (response) {
                var jsonObj = JSON.parse(response);
                channelArr = jsonObj['channels'];
                getspecificChannel(channelArr);
                getMusic();
            }
        });
    }

    // Get specificChannel
    function getspecificChannel (channelArr) {
        var channelNum = 36;
        var specificChannel = channelArr[channelNum];

        
        channel.setAttribute('data-channel-id', specificChannel.channel_id);
    }

    // get music
    function getMusic () {
        ajax({
            method: 'GET',
            url: 'http://api.jirengu.com/fm/getSong.php',
            data: {
                "channel": channel.getAttribute("data-channel-id")
            },
            success: function (response) {
                var jsonObj = JSON.parse(response);
                var songObj = jsonObj['song'][0];

                songTitle.innerHTML = songObj.title;
                singer.innerHTML = songObj.artist;
                recordImg.src = songObj.picture;
                bigBg.src = songObj.picture;
                musicAudio.src = songObj.url;
                musicAudio.setAttribute('data-sid', songObj.sid);
                musicAudio.setAttribute('data-ssid', songObj.ssid);
                musicAudio.play();
                isLoading = false;
                getlyric();

                
                if (num === 1) {
                    musicAudio.onplaying = function () {
                        this.pause();
                        musicAudio.onplaying = null;
                    };
                    num++;
                }
            }
        });
    }
    
    
    function getlyric () {
        var sid = musicAudio.getAttribute('data-sid');
        var ssid = musicAudio.getAttribute('data-ssid');
        ajax({
            url: 'http://api.jirengu.com/fm/getLyric.php',
            method: 'POST',
            data: {
                sid: sid,
                ssid: ssid
            },
            success: function (response) {
                var lyricsObj = JSON.parse(response);

                if (lyricsObj.lyric) {
                    lyrics.innerHTML = ''; 
                    var lineArr = lyricsObj.lyric.split('\n'); 
                    var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;
                    var result = [];

                    for (var i in lineArr) {
                        var time = lineArr[i].match(timeReg);
                        if (!time) continue;
                        var curStr = lineArr[i].replace(timeReg, '');
                        for (var j in time) {
                            var t = time[j].slice(1, -1).split(':'); 
                            var curSecond = parseInt(t[0], 10) * 60 + parseFloat(t[1]);
                            result.push([curSecond, curStr]);
                        }
                    }

                    result.sort(function (a, b) {
                        return a[0] - b[0];
                    });

                    // Render lyrics to the interface
                    renderLyrics(result);
                }
            }
        })
    }

    // Add lyrics to the page
    function renderLyrics (lyricArr) {
        var str = '';
        for (var i = 0, len = lyricArr.length; i < len; i++) {
            str += '<li data-time="' + lyricArr[i][0] + '">' + lyricArr[i][1] + '</li>';
        }
        lyrics.innerHTML = str;
        lyricsLiArr = lyrics.getElementsByTagName('li');
    }
};