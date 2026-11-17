/* =========================================================================
   CHRONOMÈTRE DE REPOS FLOTTANT, WAKE LOCK API, AUDIO WEBAPI & VIBRATION
   ========================================================================= */

let wakeLockSentinel = null;
let wakeLockEnabled = false;

let timerInterval = null;
let timerEndTime = 0;
let timerRem = 0;
let timerTot = 0;
let isRunning = false;
let toastCallback = null;

export function setTimerToastCallback(fn) {
    toastCallback = fn;
}

function notify(msg) {
    if (typeof toastCallback === "function") {
        toastCallback(msg);
    }
}

export function hapticTap(ms = 10) {
    if (navigator.vibrate) {
        try {
            navigator.vibrate(ms);
        } catch (e) {}
    }
}

/* =========================================================================
   WAKE LOCK API (MAINTIEN DE L'ÉCRAN ALLUMÉ EN SÉANCE)
   ========================================================================= */
export async function toggleWakeLock() {
    hapticTap(10);
    if (!("wakeLock" in navigator)) {
        notify("ℹ️ Maintien d'écran géré par les paramètres Android");
        return;
    }
    try {
        if (!wakeLockEnabled) {
            wakeLockSentinel = await navigator.wakeLock.request("screen");
            wakeLockEnabled = true;
            wakeLockSentinel.addEventListener("release", () => {
                updateWakeLockUI();
            });
            updateWakeLockUI();
            notify("🔒 Écran maintenu allumé pour la séance");
        } else {
            if (wakeLockSentinel) await wakeLockSentinel.release();
            wakeLockSentinel = null;
            wakeLockEnabled = false;
            updateWakeLockUI();
            notify("🔓 Extinction automatique d'écran rétablie");
        }
    } catch (e) {
        notify("⚠️ Impossible d'activer le maintien d'écran ici");
    }
}

export function updateWakeLockUI() {
    const btn = document.getElementById("wakelock-btn");
    const icn = document.getElementById("wakelock-icon");
    const txt = document.getElementById("wakelock-text");
    if (!btn || !icn || !txt) return;
    if (wakeLockEnabled) {
        btn.className = "btn-wakelock active";
        icn.textContent = "🔒";
        txt.textContent = "Écran actif";
    } else {
        btn.className = "btn-wakelock";
        icn.textContent = "🔓";
        txt.textContent = "Écran auto";
    }
}

/* =========================================================================
   CHRONOMÈTRE DE REPOS (TIMESTAMP DELTA + AUDIO WEBAPI + VIBRATION)
   ========================================================================= */
export function playBeepAlert() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            const ctx = new AudioCtx();
            [0, 0.22, 0.44].forEach(delay => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
                gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.16);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + 0.17);
            });
        }
    } catch (e) {}
    if (navigator.vibrate) {
        try {
            navigator.vibrate([220, 100, 220]);
        } catch (e) {}
    }
}

export function updateTimerUI() {
    const displayEl = document.getElementById("timer-display");
    const progressEl = document.getElementById("timer-progress");
    const playBtn = document.getElementById("timer-play-btn");
    const pillBox = document.getElementById("timer-pill-box");

    const m = String(Math.floor(timerRem / 60)).padStart(2, "0");
    const s = String(timerRem % 60).padStart(2, "0");
    if (displayEl) displayEl.textContent = `${m}:${s}`;
    if (progressEl) {
        progressEl.style.width = timerTot > 0
            ? `${Math.min(100, ((timerTot - timerRem) / timerTot) * 100)}%`
            : "0%";
    }
    if (playBtn) playBtn.textContent = isRunning ? "⏸" : "▶";
    if (pillBox) {
        pillBox.className = isRunning ? "timer-pill running" : "timer-pill";
    }
}

export function tickTimer() {
    if (!isRunning) return;
    const diffSec = Math.ceil((timerEndTime - Date.now()) / 1000);
    timerRem = Math.max(0, diffSec);
    updateTimerUI();

    if (timerRem <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        updateTimerUI();
        const lbl = document.getElementById("timer-label");
        if (lbl) lbl.textContent = "🔥 Prêt !";
        playBeepAlert();
        notify("⏱️ Temps de repos terminé !");
    }
}

export function startRestTimer(secs) {
    hapticTap(12);
    clearInterval(timerInterval);
    timerTot = secs;
    timerRem = secs;
    timerEndTime = Date.now() + secs * 1000;
    isRunning = true;
    const lbl = document.getElementById("timer-label");
    if (lbl) lbl.textContent = "Repos actif";
    updateTimerUI();
    timerInterval = setInterval(tickTimer, 250);
}

export function adjustRestTimer(deltaSecs) {
    hapticTap(8);
    if (timerTot <= 0 && !isRunning) {
        if (deltaSecs > 0) startRestTimer(deltaSecs);
        return;
    }
    timerRem = Math.max(0, timerRem + deltaSecs);
    timerTot = Math.max(timerTot, timerRem);
    if (isRunning) {
        timerEndTime = Date.now() + timerRem * 1000;
    }
    updateTimerUI();
}

export function toggleTimerPlayPause() {
    hapticTap(10);
    if (timerRem <= 0) {
        startRestTimer(120);
        return;
    }
    const lbl = document.getElementById("timer-label");
    if (isRunning) {
        isRunning = false;
        if (lbl) lbl.textContent = "En pause";
    } else {
        isRunning = true;
        timerEndTime = Date.now() + timerRem * 1000;
        if (lbl) lbl.textContent = "Repos actif";
    }
    updateTimerUI();
}

export function resetRestTimer() {
    hapticTap(10);
    clearInterval(timerInterval);
    isRunning = false;
    timerRem = 0;
    timerTot = 0;
    timerEndTime = 0;
    const lbl = document.getElementById("timer-label");
    if (lbl) lbl.textContent = "Chrono Repos";
    updateTimerUI();
}

export function initTimerListeners() {
    document.addEventListener("visibilitychange", async () => {
        if (!document.hidden) {
            if (isRunning) tickTimer();
            if (wakeLockEnabled && "wakeLock" in navigator) {
                try {
                    wakeLockSentinel = await navigator.wakeLock.request("screen");
                } catch (e) {}
            }
        }
    });
}
