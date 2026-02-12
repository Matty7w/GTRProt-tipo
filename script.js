// YouTube IFrame API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var isPlaying = false;
var currentTrackIndex = 0;

// Playlist
const playlist = [
    { id: '0YP5gIIRomM', title: 'PHONK MIX', artist: 'GTR VIBES' }
];

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: playlist[currentTrackIndex].id,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'iv_load_policy': 3,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0,
            'loop': 1, // Loop playlist handled manually for better control
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    updateTrackInfo();
    // Set initial volume
    player.setVolume(50);
    // Visual cue that system is ready
    const systemStatus = document.querySelector('.stat-item:first-child');
    systemStatus.innerHTML = '<i class="fa-solid fa-signal"></i> SYSTEM: READY';
    systemStatus.style.textShadow = '0 0 10px #fff';

    // Start progress loop
    setInterval(updateProgress, 1000);
}

function onPlayerStateChange(event) {
    const playBtnIcon = document.querySelector('#play-pause-btn i');
    if (event.data == YT.PlayerState.PLAYING) {
        isPlaying = true;
        playBtnIcon.className = 'fa-solid fa-pause';
    } else if (event.data == YT.PlayerState.PAUSED) {
        isPlaying = false;
        playBtnIcon.className = 'fa-solid fa-play';
    } else if (event.data == YT.PlayerState.ENDED) {
        nextTrack();
    }
}

// Progress Bar Logic
function updateProgress() {
    if (player && isPlaying) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();

        if (duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            document.getElementById('progress-fill').style.width = progressPercent + '%';

            document.getElementById('curr-time').innerText = formatTime(currentTime);
            document.getElementById('total-time').innerText = formatTime(duration);
        }
    }
}

function formatTime(time) {
    time = Math.round(time);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

// Seek Functionality (Updated for new player structure)
document.querySelector('.progress-track').addEventListener('click', function (e) {
    if (player) {
        const rect = this.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const duration = player.getDuration();

        const newTime = (clickX / width) * duration;
        player.seekTo(newTime, true);
    }
});

// Controls matches new IDs, no change needed there except ensuring icons update correctly which is handled in state change
document.getElementById('play-pause-btn').addEventListener('click', function () {
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

// View Switching Logic (SPA)
function switchView(viewName) {
    const homeView = document.getElementById('home-view');
    const specsView = document.getElementById('specs-view');
    const versionsView = document.getElementById('versions-view');
    const r33View = document.getElementById('r33-view');
    const root = document.documentElement;

    // Header elements
    const headerBrand = document.getElementById('header-brand');
    const headerModel = document.getElementById('header-model');
    const headerSpec = document.getElementById('header-spec');
    const headerId = document.getElementById('header-id');
    const mainHeader = document.getElementById('main-header');

    // Hide all first
    [homeView, specsView, versionsView, r34View, r33View].forEach(view => {
        if (view) {
            view.classList.remove('active-view');
            view.classList.add('hidden-view');
        }
    });

    // Theme Logic based on car
    if (viewName === 'r34') {
        // Theme for R34 - Bayside Blue
        root.style.setProperty('--bg-image', "url('https://r4.wallpaperflare.com/wallpaper/50/292/927/nissan-skyline-gt-r-r34-nissan-skyline-jdm-car-wallpaper-096008ed61facdfba697f80fd051566d.jpg')");
        root.style.setProperty('--bg-filter', 'brightness(0.7)'); // Slight darken, keep colors
        root.style.setProperty('--accent-color', '#00bfff'); // Bayside Blue
        root.style.setProperty('--accent-glow', 'rgba(0, 191, 255, 0.6)');

        // Update Header for R34
        headerBrand.textContent = 'SKYLINE';
        headerModel.innerHTML = 'GTR <span class="spec" id="header-spec">R34</span>';
        headerId.innerHTML = '<i class="fa-solid fa-fingerprint"></i> ID: BAYSIDE-034';
        mainHeader.classList.add('r34-theme');
        mainHeader.classList.remove('r35-theme');
        mainHeader.style.borderBottomColor = 'rgba(0, 191, 255, 0.4)';

        r34View.classList.remove('hidden-view');
        r34View.classList.add('active-view');
    } else if (viewName === 'r33') {
        // Theme for R33 - Midnight Purple (based on user request wallpaper)
        root.style.setProperty('--bg-image', "url('https://wallpapercave.com/wp/wp2727869.jpg')");
        root.style.setProperty('--bg-filter', 'brightness(0.6) contrast(1.1)');
        root.style.setProperty('--accent-color', '#c71585'); // Medium Violet Red / Magenta
        root.style.setProperty('--accent-glow', 'rgba(199, 21, 133, 0.6)');

        // Update Header for R33
        headerBrand.textContent = 'SKYLINE';
        headerModel.innerHTML = 'GTR <span class="spec" id="header-spec" style="color: #c71585;">R33</span>';
        headerId.innerHTML = '<i class="fa-solid fa-fingerprint"></i> ID: MIDNIGHT-033';
        mainHeader.classList.remove('r34-theme');
        mainHeader.classList.remove('r35-theme');
        mainHeader.style.borderBottomColor = 'rgba(199, 21, 133, 0.4)';

        r33View.classList.remove('hidden-view');
        r33View.classList.add('active-view');
    } else {
        // Default / Home / R35 Theme - B&W Monstrous
        root.style.setProperty('--bg-image', "url('https://r4.wallpaperflare.com/wallpaper/1022/53/128/ultra-wide-car-nissan-skyline-gt-r-wallpaper-8f61950fe7a12fb68eb61849ff9cb606.jpg')");
        root.style.setProperty('--bg-filter', 'grayscale(100%) contrast(1.2) brightness(0.6)');
        root.style.setProperty('--accent-color', '#fff');
        root.style.setProperty('--accent-glow', 'rgba(255, 255, 255, 0.5)');

        // Update Header for R35/Home
        headerBrand.textContent = 'NISSAN';
        headerModel.innerHTML = 'GTR <span class="spec" id="header-spec">R35</span>';
        headerId.innerHTML = '<i class="fa-solid fa-fingerprint"></i> ID: VEILSIDE-001';
        mainHeader.classList.add('r35-theme');
        mainHeader.classList.remove('r34-theme');
        mainHeader.style.borderBottomColor = ''; // Reset inline style

        if (viewName === 'specs') {
            specsView.classList.remove('hidden-view');
            specsView.classList.add('active-view');
        } else if (viewName === 'versions') {
            versionsView.classList.remove('hidden-view');
            versionsView.classList.add('active-view');
        } else {
            homeView.classList.remove('hidden-view');
            homeView.classList.add('active-view');
        }
    }
}
// Expose function globally if needed (Vite modules usually scope it, but basic script tag is global)
window.switchView = switchView;

document.getElementById('next-btn').addEventListener('click', nextTrack);
document.getElementById('prev-btn').addEventListener('click', prevTrack);

// Track Navigation
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
}

function loadTrack(index) {
    if (player) {
        player.loadVideoById(playlist[index].id);
        updateTrackInfo();
        player.playVideo(); // Auto play next track
    }
}

function updateTrackInfo() {
    const track = playlist[currentTrackIndex];
    const titleElement = document.getElementById('track-name');
    const artistElement = document.getElementById('artist-name');
    const albumImg = document.getElementById('album-img');
    const albumPlaceholder = document.getElementById('album-placeholder');

    titleElement.innerText = track.title;
    artistElement.innerText = track.artist;

    // Set YouTube thumbnail as album art
    const thumbnailUrl = `https://img.youtube.com/vi/${track.id}/mqdefault.jpg`;
    albumImg.src = thumbnailUrl;
    albumImg.style.display = 'block';
    albumPlaceholder.style.display = 'none';
}

// Extra: CTA Button Sound / Effect
document.getElementById('ignite-btn').addEventListener('click', () => {
    if (player) {
        player.playVideo();
        document.body.classList.add('ignited');
    }
});

// Like button toggle (cosmetic)
document.getElementById('like-btn').addEventListener('click', function () {
    this.classList.toggle('active');
    const icon = this.querySelector('i');
    if (this.classList.contains('active')) {
        icon.className = 'fa-solid fa-heart';
    } else {
        icon.className = 'fa-regular fa-heart';
    }
});

// Volume icon update based on level
function updateVolumeIcon() {
    const vol = document.getElementById('volume-slider').value;
    const icon = document.getElementById('vol-icon');
    if (vol == 0) {
        icon.className = 'fa-solid fa-volume-xmark';
    } else if (vol < 50) {
        icon.className = 'fa-solid fa-volume-low';
    } else {
        icon.className = 'fa-solid fa-volume-high';
    }
}

// Update volume slider to also update icon
const volumeSlider = document.getElementById('volume-slider');
volumeSlider.addEventListener('input', function () {
    if (player) {
        player.setVolume(this.value);
    }
    this.style.setProperty('--volume-level', this.value + '%');
    updateVolumeIcon();
});
volumeSlider.style.setProperty('--volume-level', '50%');

// Click on volume icon to mute/unmute
let savedVolume = 50;
document.getElementById('vol-icon-btn').addEventListener('click', function () {
    const slider = document.getElementById('volume-slider');
    if (slider.value > 0) {
        savedVolume = slider.value;
        slider.value = 0;
    } else {
        slider.value = savedVolume;
    }
    if (player) player.setVolume(slider.value);
    slider.style.setProperty('--volume-level', slider.value + '%');
    updateVolumeIcon();
});

// Explicitly expose onYouTubeIframeAPIReady to window so YouTube API can find it
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
