document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('backgroundMusic');
    const volumeSlider = document.getElementById('musicVolume');

    if (!audio) return;

    let currentVolume = 0.3;
    audio.volume = currentVolume;

    const savedVolume = localStorage.getItem('tetris_music_volume');
    if (savedVolume) {
        currentVolume = parseFloat(savedVolume);
        audio.volume = currentVolume;
        if (volumeSlider) {
            volumeSlider.value = currentVolume * 100;
        }
    }

    function updateSliderBackground(value) {
        if (!volumeSlider) return;
        volumeSlider.style.setProperty('--slider-value', value + '%');

        const filledColor = '#1e88e5'; 
        const unfilledColor = '#bbdefb';

        volumeSlider.style.background = `linear-gradient(to right, 
            ${filledColor} 0%, 
            ${filledColor} ${value}%, 
            ${unfilledColor} ${value}%, 
            ${unfilledColor} 100%)`;
    }

    if (volumeSlider) {
        updateSliderBackground(volumeSlider.value);

        volumeSlider.addEventListener('input', function () {
            currentVolume = this.value / 100;
            audio.volume = currentVolume;
            localStorage.setItem('tetris_music_volume', currentVolume.toString());
            updateSliderBackground(this.value);
        });

        volumeSlider.addEventListener('focus', function () {
            this.style.boxShadow = '0 0 0 3px rgba(33, 150, 243, 0.4)';
            this.style.borderColor = '#2196f3';
        });

        volumeSlider.addEventListener('blur', function () {
            this.style.boxShadow = '';
            this.style.borderColor = '#90caf9';
        });

        volumeSlider.addEventListener('mouseenter', function () {
            const value = this.value;
            const filledColor = '#1565c0'; 
            const unfilledColor = '#90caf9'; 

            this.style.background = `linear-gradient(to right, 
                ${filledColor} 0%, 
                ${filledColor} ${value}%, 
                ${unfilledColor} ${value}%, 
                ${unfilledColor} 100%)`;
        });

        volumeSlider.addEventListener('mouseleave', function () {
            updateSliderBackground(this.value);
        });
    }

    setTimeout(() => {
        audio.play().catch(e => {
            console.log('Music failed to play:', e);
        });
    }, 500);

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            audio.pause();
        } else if (!audio.paused) {
            audio.play().catch(e => console.log('Music resume failed:', e));
        }
    });

    audio.addEventListener('error', function () {
        console.log('Music file not found');
        if (volumeSlider) {
            volumeSlider.disabled = true;
            volumeSlider.style.opacity = '0.5';
            volumeSlider.style.cursor = 'not-allowed';
            volumeSlider.style.background = '#b3e5fc';
        }
    });
});