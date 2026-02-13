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
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_Nismo_(R35),_2022,_front.jpg', title: 'R35 Nismo 2022', category: 'r35 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_R34_V_Spec_II.jpg', title: 'R34 V-Spec II', category: 'r34 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/1996_Nissan_Skyline_GT-R_(R33)_2.6_Front.jpg', title: 'R33 GT-R 1996', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_GT1_Sumo_Power_GT_20_Silverstone_FIA_GT1_2011.jpg', title: 'R35 GT1 Widebody', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_(R34)_(6235066673).jpg', title: 'R34 Tuned Spec', category: 'r34 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/1996_Nissan_Skyline_GT-R_(R33)_2.6_Rear.jpg', title: 'R33 GT-R Rear', category: 'r33 stock' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_GT-R_GT1_Oschersleben_2009.jpg', title: 'R35 GT1 Carbon', category: 'r35 bodykit' },
    { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nissan_Skyline_GT-R_R34_V_Spec_II_rear.jpg', title: 'R34 V-Spec Rear', category: 'r34 stock' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Motul_Autech_GT-R_2011_Super_GT_Fuji_250km.jpg', title: 'R35 Super GT', category: 'r35 bodykit' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Nissan_Skyline_R34_GT-R_Nür_001.jpg', title: 'R34 M-Spec Nür', category: 'r34 stock' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Skyline_GT-R_Autechversion_40thanniversary.jpg', title: 'R33 Autech 4-Door', category: 'r33 stock' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/2019_Nissan_GT-R_50th_Anniversary_Edition.jpg', title: 'R35 50th Anniversary', category: 'r35 stock' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Nissan_Skyline_R34_GT-R_Nür_002.jpg', title: 'R34 Nür Rear', category: 'r34 stock' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Nissan_GT-R_Nismo_GT3_2018.jpg', title: 'R35 GT3 Nismo', category: 'r35 bodykit' }
];

function populateGallery(totalImages = 100) {
    const galleryContainer = document.getElementById('gtr-gallery');
    if (!galleryContainer) return;

    galleryContainer.innerHTML = ''; // Clear container

    for (let i = 0; i < totalImages; i++) {
        // Cycle through the curated list securely
        const imgData = galleryImages[i % galleryImages.length];

        // Generate minor variations in default title to make it feel less repetitive
        const displayTitle = `${imgData.title} #${Math.floor(i / galleryImages.length) + 1}`;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item';
        itemDiv.setAttribute('data-category', imgData.category);

        // HTML Structure
        itemDiv.innerHTML = `
            <img src="${imgData.src}" 
                 data-full="${imgData.src}" 
                 loading="lazy" 
                 alt="${displayTitle}">
            <div class="gallery-overlay">
                <div class="overlay-content">
                    <i class="fa-solid fa-expand"></i>
                    <span class="image-title">${displayTitle}</span>
                </div>
            </div>
        `;

        // Add click event for standard functionality (opening custom lightbox if needed, but we'll use a delegate)
        galleryContainer.appendChild(itemDiv);
    }

    // Re-initialize lightbox logic after population
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
