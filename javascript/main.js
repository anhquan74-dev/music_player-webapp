// Feature

// 1. Render songs
// 2. Scroll top
// 3. Play / pause / seek
// 4. CD rotate
// 5. Next / prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $(".cd-thumb")
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $(".btn-toggle-play")
const player = $(".app")
const progress = $(".progress")
const prev = $(".btn-prev")
const next = $(".btn-next")
const random = $(".btn-random")
const repeat = $(".btn-repeat")
const appBlock = $(".app")
const playlist = $('.playlist')
const dashboard = $(".dashboard")

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [{
            name: 'matchanah',
            singer: 'híu x bâu',
            audio: './audio/matchanah.mp3',
            image: './image/matchanah.jpg'
        },
        {
            name: 'Thích quá rùi nà',
            singer: 'tlinh ft. Trung Trần',
            audio: './audio/thichquaruina.mp3',
            image: './image/thichquaruina.jpg'
        },
        {
            name: 'Yêu 5',
            singer: 'Rhymastic',
            audio: './audio/yeu5.mp3',
            image: './image/yeu5.jpg'
        },
        {
            name: 'Thích em hơi nhiều',
            singer: 'Wren Evans',
            audio: './audio/thichemhoinhieu.mp3',
            image: './image/thichemhoinhieu.jpg'
        },
        {
            name: 'Em là hoàng hôn',
            singer: 'Vang x Cloud 5',
            audio: './audio/emlahoanghon.mp3',
            image: './image/emlahoanghon.jpg'
        },
        {
            name: 'Your Smile',
            singer: 'Obito ft. hnhngan',
            audio: './audio/yoursmile.mp3',
            image: './image/yoursmile.jpg'
        },
        {
            name: 'LoveYou',
            singer: 'Dxvn',
            audio: './audio/loveyoudxvn.mp3',
            image: './image/loveyoudxvn.jpg'
        },
        {
            name: 'tiny love',
            singer: 'Thịnh Suy',
            audio: './audio/tinylove.mp3',
            image: './image/tinylove.jpg'
        },
        {
            name: 'Tình Yêu Xanh Lá',
            singer: 'Thịnh Suy',
            audio: './audio/tinhyeuxanhla.mp3',
            image: './image/tinhyeuxanhla.jpg'
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="avatar" style="background-image: url(${song.image})">
                </div>
                <div class="info">
                    <h3>${song.name}</h3>
                    <p>${song.singer}</p>
                </div>  
                <div class="options">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth
        const playlistHeight = playlist.offsetHeight

        // xu ly cd quay / dung
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 15000, // 10s
            iterations: Infinity, //
        })
        cdThumbAnimate.pause()

        // xu ly phong to / thu nho cd
        playlist.onscroll = function () {
            const scrollTop = playlist.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
            const newPlaylistHeight = playlistHeight + scrollTop
            playlist.style.height = 40 + newPlaylistHeight > 510 ? 510 : newPlaylistHeight + 'px'
            console.log(playlist.style.height)
            var cdHeight = cd.style.height
            cd.style.height = cdHeight < 277 ? 277 : cd.style.height + 'px'
        }

        // xu ly click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
                cdThumbAnimate.pause()
            } else {
                audio.play();
                cdThumbAnimate.play()
            }

        }

        //song current time
        audio.addEventListener('timeupdate', function () {
            var curtime = audio.currentTime
            var min = Math.floor(curtime / 60)
            var sec = Math.floor(curtime % 60)
            document.querySelector('.currentTime').innerText = (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)
        })

        //Song duration time
        audio.onloadedmetadata = function () {
            duration = audio.duration
            var min = Math.floor(duration / 60)
            var sec = Math.floor(duration % 60)
            document.querySelector('.durationTime').innerText = (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)
        }

        // khi bai hat duoc playlist
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
        }

        // khi bai hat pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
        }

        // khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 1000)
                progress.value = progressPercent
            }
        }

        // xu ly khi tua bai 
        progress.onchange = function (e) {
            const seekTime = e.target.value * audio.duration / 1000
            audio.currentTime = seekTime
        }

        // xu ly next/ pre
        next.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.currentIndex++
                if (_this.currentIndex >= _this.songs.length) {
                    _this.currentIndex = 0
                }
                _this.loadCurrentSong()
                audio.play()
            }
            _this.render()
            _this.scrollToActiveSong()
        }

        prev.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.currentIndex--
                if (_this.currentIndex < 0) {
                    _this.currentIndex = _this.songs.length - 1
                }
                _this.loadCurrentSong()
                audio.play()
            }
            _this.render()
            _this.scrollToActiveSong()
        }

        // xu ly random 
        random.onclick = function () {
            _this.isRandom = !_this.isRandom
            random.classList.toggle("active", _this.isRandom)

        }

        // xu ly repeat song 
        repeat.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeat.classList.toggle("active", _this.isRepeat)
        }

        // xu ly bai hat khi no ket thuc
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                next.click()
            }
            _this.render()
        }
        
        // Lắng nghe hành vi click vào playlist
        // Listen to playlist clicks
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                // Handle when clicking on the song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào song option
                // Handle when clicking on the song option
                if (e.target.closest(".option")) {}
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 300);
    },
    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image}`
        audio.src = this.currentSong.audio
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * app.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;

        this.loadCurrentSong()
        audio.play()
    },
    start: function () {
        // định nghĩa các thuộc tính cho object
        this.defineProperties('')

        // lắng nghe / xử lý các sự kiện DOME events
        this.handleEvents()

        // tải thông tin bài hát đầu tiên
        this.loadCurrentSong()



        //render playlist
        this.render()
    }
}

app.start()

console.log(audio.duration)