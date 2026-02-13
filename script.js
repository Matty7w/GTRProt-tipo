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
    { id: 'PAjD4GFi3Ko', title: 'NEON BLADE', artist: 'MOONDEITY', start: 49 }
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
            'loop': 1,
            'start': playlist[currentTrackIndex].start || 0 // Set start time for initial video
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
    const menuView = document.getElementById('menu-view');
    const driftView = document.getElementById('drift-view');
    const customView = document.getElementById('custom-view');
    const specsView = document.getElementById('specs-view');
    const versionsView = document.getElementById('versions-view');
    const r34View = document.getElementById('r34-view');
    const r33View = document.getElementById('r33-view');
    const root = document.documentElement;

    // Header elements
    const headerBrand = document.getElementById('header-brand');
    const headerModel = document.getElementById('header-model');
    const headerSpec = document.getElementById('header-spec');
    const headerId = document.getElementById('header-id');
    const mainHeader = document.getElementById('main-header');

    // Hide all first
    [homeView, menuView, driftView, customView, specsView, versionsView, r34View, r33View].forEach(view => {
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
        root.style.setProperty('--bg-filter', 'brightness(0.3) contrast(1.2)'); // Darker for neon pop
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

        if (viewName === 'menu') {
            menuView.classList.remove('hidden-view');
            menuView.classList.add('active-view');
        } else if (viewName === 'drift') {
            driftView.classList.remove('hidden-view');
            driftView.classList.add('active-view');
        } else if (viewName === 'custom') {
            customView.classList.remove('hidden-view');
            customView.classList.add('active-view');
        } else if (viewName === 'specs') {
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
        const track = playlist[index];
        player.loadVideoById({
            videoId: track.id,
            startSeconds: track.start || 0
        });
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

// Extra: Music Player Auto-start (optional)
// Removed ignite-btn listener as button now navigates to menu


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

/* ====================================
   IMAGE GALLERY LOGIC
   ==================================== */
/* ====================================
   IMAGE GALLERY LOGIC (DYNAMIC GENERATION)
   ==================================== */
const galleryImages = [
    // --- R35 (Modern & Nismo) ---
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_Nismo_(R35),_2022,_front.jpg', title: 'R35 Nismo 2022', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_Nismo_GT3_2018.jpg', title: 'R35 GT3 Nismo 2018', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_GT1_Sumo_Power_GT_20_Silverstone_FIA_GT1_2011.jpg', title: 'R35 GT1 Sumo Power', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_GT1_Oschersleben_2009.jpg', title: 'R35 GT1 Carbon Test', category: 'r35 bodykit' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Motul_Autech_GT-R_2011_Super_GT_Fuji_250km.jpg', title: 'R35 Motul Autech GT500', category: 'r35 bodykit' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/2019_Nissan_GT-R_50th_Anniversary_Edition.jpg', title: 'R35 50th Anniversary', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_Premium_Edition_(R35)_–_Frontansicht,_28._August_2012,_Düsseldorf.jpg', title: 'R35 Premium Edition', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_V_Spec_front_20090228.jpg', title: 'R35 V-Spec 2009', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_Egoist.jpg', title: 'R35 Egoist Edition', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_Nismo_(R35)_–_Frontansicht,_4._September_2014,_Düsseldorf.jpg', title: 'R35 Nismo 2014', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/2014_Nissan_GT-R_Black_Edition_Front.jpg', title: 'R35 Black Edition', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/2017_Nissan_GT-R_Premium_3.8_Front.jpg', title: 'R35 Premium 2017', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R50_by_Italdesign.jpg', title: 'Nissan GT-R50 Italdesign', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Goodwood_Festival_of_Speed_2019_(48243486391).jpg', title: 'R35 Nismo 2020 Track', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Concept_2020_Vision_Gran_Turismo_–_Frontansicht,_24._September_2015,_Frankfurt.jpg', title: 'GT-R 2020 Vision GT', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_LM_Nismo_Le_Mans_2015.jpg', title: 'GT-R LM Nismo Le Mans', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_Nismo_GT3_2015.jpg', title: 'R35 GT3 2015', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_Safety_Car.jpg', title: 'R35 Safety Car', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_Prestige_2017.jpg', title: 'R35 Prestige 2017', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/FoS20162016_0624_132444AA_(27812903332).jpg', title: 'R35 Nismo Record Breaker', category: 'r35 stock' },

    // --- R34 (Legend) ---
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_R34_V_Spec_II.jpg', title: 'R34 V-Spec II Stock', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_R34_V_Spec_II_rear.jpg', title: 'R34 V-Spec II Rear', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_(R34)_(6235066673).jpg', title: 'R34 Modified Blue', category: 'r34 bodykit' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Nissan_Skyline_R34_GT-R_Nür_001.jpg', title: 'R34 M-Spec Nür Front', category: 'r34 stock' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Nissan_Skyline_R34_GT-R_Nür_002.jpg', title: 'R34 M-Spec Nür Rear', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_R34_GT-R_GF-BNR34_White_(5).jpg', title: 'R34 GT-R White Profile', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_R34_GT-R_GF-BNR34_White_(6).jpg', title: 'R34 GT-R White Rear', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_R34_GT-R_GF-BNR34_White_(8).jpg', title: 'R34 GT-R White Detail', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_(R34)_M-Spec_Nür.jpg', title: 'R34 M-Spec Nür Ginza', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_R34_V-Spec_N1.jpg', title: 'R34 V-Spec N1 (Rare)', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Z-tune_Silver.jpg', title: 'R34 Nismo Z-Tune', category: 'r34 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_R34_GT-R_V-Spec_II_Nür.jpg', title: 'R34 V-Spec II Nür Millenium Jade', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_V_spec_II_Nur_(BNR34)_front.jpg', title: 'R34 V-Spec II Nür Front', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_V_spec_II_Nur_(BNR34)_rear.jpg', title: 'R34 V-Spec II Nür Rear', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tuned_Nissan_Skyline_GT-R_R34.jpg', title: 'R34 Time Attack', category: 'r34 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_R34_Police_Car_01.jpg', title: 'R34 Police Car Japan', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_R34_GT-R_V-Spec_Midnight_Purple_II.jpg', title: 'R34 Midnight Purple II', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_R34_GT-R_V-Spec_Midnight_Purple_III.jpg', title: 'R34 Midnight Purple III', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_R34_GT-R_M-Spec.jpg', title: 'R34 M-Spec Silica Breath', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mine\'s_R34_Skyline_GT-R.jpg', title: 'R34 Mine\'s Tuned', category: 'r34 bodykit' },

    // --- R33 (Classic) ---
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/1996_Nissan_Skyline_GT-R_(R33)_2.6_Front.jpg', title: 'R33 GT-R 1996 Front', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/1996_Nissan_Skyline_GT-R_(R33)_2.6_Rear.jpg', title: 'R33 GT-R 1996 Rear', category: 'r33 stock' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Skyline_GT-R_Autechversion_40thanniversary.jpg', title: 'R33 Autech 4-Door', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_BCNR33_Autech_Version_40th_Anniversary_Rear.jpg', title: 'R33 Autech Rear', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_R33_GT-R_LM_Limited.jpg', title: 'R33 LM Limited Champion Blue', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_R33_V-Spec.jpg', title: 'R33 V-Spec', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nismo_400R_pre-production.jpg', title: 'R33 Nismo 400R (Rare)', category: 'r33 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_LM_Road_Car_front-right_2016_Nissan_Global_Headquarters_Gallery.jpg', title: 'R33 GT-R LM Road Car', category: 'r33 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_LM_Road_Car_rear-left_2016_Nissan_Global_Headquarters_Gallery.jpg', title: 'R33 LM Road Car Rear', category: 'r33 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/1995_Nissan_Skyline_GT-R.jpg', title: 'R33 GT-R 1995', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_(BCNR33)_in_Tsukuba_Circuit.jpg', title: 'R33 Tsukuba Circuit', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/HKS_R33_GT-R_Drag_Car.jpg', title: 'R33 HKS Drag (Legend)', category: 'r33 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_R33_GT-R_V-Spec_Midnight_Purple.jpg', title: 'R33 V-Spec Midnight Purple', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Top_Secret_R33_GT-R.jpg', title: 'R33 Top Secret', category: 'r33 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_R33_Series_3.jpg', title: 'R33 Series 3', category: 'r33 stock' },

    // --- R32 (Godzilla) & Heritage ---
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_(BNR32)_front.jpg', title: 'R32 GT-R Godzilla', category: 'r33 stock' }, // Grouped for layout
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_(BNR32)_rear.jpg', title: 'R32 GT-R Rear', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_V-Spec_II_(BNR32)_front.jpg', title: 'R32 V-Spec II', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_V-Spec_II_(BNR32)_rear.jpg', title: 'R32 V-Spec II Rear', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_2000_GT-R_KPGC10.jpg', title: 'Hakosuka GT-R (First Gen)', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_2000_GT-R_KPGC110.jpg', title: 'Kenmeri GT-R (Second Gen)', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_R32_GT-R_Nismo.jpg', title: 'R32 Nismo', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/HKS_R32_GT-R_Group_A.jpg', title: 'R32 HKS Group A', category: 'r33 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Calsonic_Skyline_GT-R_(1990).jpg', title: 'Calsonic R32 Legend', category: 'r33 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Reebok_Skyline_R32_GT-R_Group_A.jpg', title: 'Reebok R32 Group A', category: 'r33 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/STP_Taisan_GT-R.jpg', title: 'STP Taisan R32', category: 'r33 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Castrol_Mugen_GT-R.jpg', title: 'Castrol R32 (Rare)', category: 'r33 bodykit' },

    // --- More Racing & Bodykits ---
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pennzoil_Nismo_GT-R_(1998).jpg', title: 'Pennzoil Nismo GT-R R33', category: 'r33 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Xanavi_Nismo_GT-R_(2003).jpg', title: 'Xanavi Nismo GT-R R34', category: 'r34 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Calsonic_Impul_GT-R_2008.jpg', title: 'R35 Calsonic Impul', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_GT500_2008_pre.jpg', title: 'R35 GT500 Test Car', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Blancpain_Endurance_Series_2012_-_Nürburgring_-_JRM_Nissan_GTR_GT3.jpg', title: 'R35 GT3 JRM', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/FIA_GT1_San_Luis_2011_Swiss_Nissan_1.jpg', title: 'R35 GT1 Swiss Racing', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Krumm_Nissan_GT-R_GT1_2010_Silverstone.jpg', title: 'R35 GT1 Michael Krumm', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sumo_Power_GT_Nissan_GT-R_GT1.jpg', title: 'Sumo Power GT1 Front', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_GT1_Schubert.jpg', title: 'R35 GT1 Schubert', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/JR_Motorsports_Nissan_GT-R_GT1.jpg', title: 'JRM GT1', category: 'r35 bodykit' },

    // --- Engines & Details ---
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Motors_RB26DETT_engine_001.jpg', title: 'RB26DETT R34 Engine', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/RB26DETT_R33_Engine.jpg', title: 'RB26DETT R33 Engine', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/VR38DETT.jpg', title: 'VR38DETT Hand-Built', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_R35_Interior.jpg', title: 'R35 Interior', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_R34_MFD.jpg', title: 'R34 MFD Screen', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_R35_GT-R_Badge.jpg', title: 'GT-R Badge Detail', category: 'r35 stock' }
];

function populateGallery() {
    // Unique check to ensure NO DUPLICATES based on src
    const uniqueImages = [...new Map(galleryImages.map(item => [item.src, item])).values()];

    // Safety: Populate ONLY unique images found
    const container = document.getElementById('gtr-gallery');
    if (!container) return;
    container.innerHTML = '';

    uniqueImages.forEach((imgData, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item';
        // Add minimal animation delay for staggered appearance
        itemDiv.style.animationDelay = `${index * 0.05}s`;
        itemDiv.setAttribute('data-category', imgData.category);

        itemDiv.innerHTML = `
            <img src="${imgData.src}" 
                 data-full="${imgData.src}" 
                 loading="lazy" 
                 alt="${imgData.title}">
            <div class="gallery-overlay">
                <div class="overlay-content">
                    <i class="fa-solid fa-expand"></i>
                    <span class="image-title">${imgData.title}</span>
                </div>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    initLightbox();
}

function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('close-lightbox');
    const lightboxDownload = document.getElementById('download-image');
    const prevBtn = document.getElementById('prev-image');
    const nextBtn = document.getElementById('next-image');

    let currentImages = Array.from(galleryItems);
    let currentIndex = 0;

    // Filter Logic
    filterBtns.forEach(btn => {
        // Clone button to remove old listeners if re-running
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active')); // Note: re-query if needed or use parent delegation
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            newBtn.classList.add('active');

            const filter = newBtn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category.includes(filter)) {
                    item.style.display = 'block'; // Better than class hidden for layout reflow
                    setTimeout(() => item.classList.remove('hidden'), 10);
                } else {
                    item.classList.add('hidden');
                    setTimeout(() => item.style.display = 'none', 300); // Wait for fade out
                }
            });

            // Update visible images list
            currentImages = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
        });
    });

    // Delegate Click for Gallery Items (Performance)
    const galleryContainer = document.getElementById('gtr-gallery');
    galleryContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            // Update filtered list just in case
            currentImages = Array.from(document.querySelectorAll('.gallery-item')).filter(i => i.style.display !== 'none');
            currentIndex = currentImages.indexOf(item);
            openLightbox(item);
        }
    });

    function openLightbox(item) {
        if (!item) return;
        const img = item.querySelector('img');
        const fullSrc = img.getAttribute('data-full');
        const title = item.querySelector('.image-title').textContent;

        lightboxImg.src = fullSrc;
        lightboxTitle.textContent = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }

    function navigateLightbox(direction) {
        if (currentImages.length === 0) return;
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = currentImages.length - 1;
        if (currentIndex >= currentImages.length) currentIndex = 0;

        const nextItem = currentImages[currentIndex];
        const img = nextItem.querySelector('img');
        const fullSrc = img.getAttribute('data-full');
        const title = nextItem.querySelector('.image-title').textContent;

        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = fullSrc;
            lightboxTitle.textContent = title;
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    // Lightbox Controls
    // Remove old listeners by cloning elements
    const newClose = lightboxClose.cloneNode(true);
    lightboxClose.parentNode.replaceChild(newClose, lightboxClose);
    newClose.addEventListener('click', closeLightbox);

    const newPrev = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    newPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });

    const newNext = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    newNext.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    populateGallery(100); // Generate 100 images
});
