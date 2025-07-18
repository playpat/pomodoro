class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.totalTime = 25 * 60;
        this.isRunning = false;
        this.interval = null;
        this.currentMode = 'work';
        this.sessionNumber = 1;
        this.completedSessions = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.timeDisplay = document.getElementById('time');
        this.timerLabel = document.getElementById('timer-label');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.skipBtn = document.getElementById('skip-btn');
        this.progressFill = document.getElementById('progress-fill');
        this.sessionNumberEl = document.getElementById('session-number');
        this.completedCountEl = document.getElementById('completed-count');
        this.notification = document.getElementById('notification');
        this.notificationText = document.getElementById('notification-text');
        this.notificationClose = document.getElementById('notification-close');
        this.modeButtons = document.querySelectorAll('.mode-btn');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.skipBtn.addEventListener('click', () => this.skip());
        this.notificationClose.addEventListener('click', () => this.hideNotification());
        
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn));
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            
            this.interval = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft <= 0) {
                    this.complete();
                }
            }, 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            clearInterval(this.interval);
        }
    }

    reset() {
        this.pause();
        this.timeLeft = this.totalTime;
        this.updateDisplay();
    }

    skip() {
        this.complete();
    }

    complete() {
        this.pause();
        
        // Add completion animation
        this.timeDisplay.classList.add('complete');
        setTimeout(() => {
            this.timeDisplay.classList.remove('complete');
        }, 500);

        // Show notification
        this.showNotification();

        // Update session tracking
        if (this.currentMode === 'work') {
            this.completedSessions++;
            this.completedCountEl.textContent = this.completedSessions;
        }

        // Auto-switch to next mode
        this.autoSwitchMode();
    }

    autoSwitchMode() {
        if (this.currentMode === 'work') {
            // After work session, switch to break
            if (this.completedSessions % 4 === 0) {
                this.switchToMode('long-break');
            } else {
                this.switchToMode('short-break');
            }
        } else {
            // After break, switch back to work
            this.switchToMode('work');
            this.sessionNumber++;
            this.sessionNumberEl.textContent = this.sessionNumber;
        }
    }

    switchMode(button) {
        const mode = button.dataset.mode;
        const time = parseInt(button.dataset.time);
        
        this.switchToMode(mode, time);
    }

    switchToMode(mode, time = null) {
        // Update active button
        this.modeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });

        this.currentMode = mode;
        
        // Set time based on mode
        if (time) {
            this.totalTime = time * 60;
        } else {
            switch (mode) {
                case 'work':
                    this.totalTime = 25 * 60;
                    break;
                case 'short-break':
                    this.totalTime = 5 * 60;
                    break;
                case 'long-break':
                    this.totalTime = 15 * 60;
                    break;
            }
        }
        
        this.timeLeft = this.totalTime;
        this.updateDisplay();
        this.reset();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress bar
        const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Update timer label
        switch (this.currentMode) {
            case 'work':
                this.timerLabel.textContent = 'Work Time';
                break;
            case 'short-break':
                this.timerLabel.textContent = 'Short Break';
                break;
            case 'long-break':
                this.timerLabel.textContent = 'Long Break';
                break;
        }
    }

    showNotification() {
        let message = '';
        switch (this.currentMode) {
            case 'work':
                message = 'Work session completed! Time for a break.';
                break;
            case 'short-break':
                message = 'Short break completed! Ready to work?';
                break;
            case 'long-break':
                message = 'Long break completed! Great job!';
                break;
        }
        
        this.notificationText.textContent = message;
        this.notification.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }

    hideNotification() {
        this.notification.classList.remove('show');
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 