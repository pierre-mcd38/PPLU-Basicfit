/* =========================================================================
   POINT D'ENTRÉE PRINCIPAL — APPLICATION PPLU BASIC-FIT
   Initialisation DOM, IndexedDB, Chronomètre & Événements
   ========================================================================= */

import { restoreFromIndexedDBIfNewer } from "./store/storage.js";
import { setTimerToastCallback, initTimerListeners } from "./features/timer.js";
import { updateWorkoutProgressDOM } from "./features/workout.js";
import { render, bindDOMEvents, showToast, getActiveTab } from "./ui/render.js";

function initApp() {
    setTimerToastCallback(showToast);
    bindDOMEvents();
    initTimerListeners();
    render();
    restoreFromIndexedDBIfNewer(() => {
        render();
    });

    // Mise à jour périodique de la durée écoulée de la séance en cours
    setInterval(() => {
        const tab = getActiveTab();
        if (tab < 4) {
            updateWorkoutProgressDOM(tab);
        }
    }, 30000);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
