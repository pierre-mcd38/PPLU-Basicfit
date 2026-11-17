/* =========================================================================
   POINT D'ENTRÉE PRINCIPAL — APPLICATION PPLU BASIC-FIT
   Initialisation DOM, IndexedDB, Chronomètre & Événements
   ========================================================================= */

import { restoreFromIndexedDBIfNewer } from "./store/storage.js";
import { setTimerToastCallback, initTimerListeners } from "./features/timer.js";
import { render, bindDOMEvents, showToast } from "./ui/render.js";

function initApp() {
    setTimerToastCallback(showToast);
    bindDOMEvents();
    initTimerListeners();
    render();
    restoreFromIndexedDBIfNewer(() => {
        render();
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
