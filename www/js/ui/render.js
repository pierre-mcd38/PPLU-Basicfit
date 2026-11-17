/* =========================================================================
   RENDU DOM & GESTION DES ÉVÉNEMENTS — INTERFACE MOBILE-FIRST PPLU
   ========================================================================= */

import { WORKOUTS, VOLUME_DATA, BIOMECHANICS_RULES } from "../data/program.js";
import {
    getDB,
    saveDatabase,
    shareOrDownloadJSON,
    importDatabaseFromJSONString,
    handleJSONFileInput,
    copyBackupToClipboard,
    isCapacitorNative
} from "../store/storage.js";
import {
    hapticTap,
    toggleWakeLock,
    startRestTimer,
    adjustRestTimer,
    toggleTimerPlayPause,
    resetRestTimer
} from "../features/timer.js";
import {
    getVarIdx,
    setVariant,
    getWorkoutOrder,
    isCustomOrder,
    moveExerciseOrder,
    resetWorkoutOrder,
    getRecord,
    formatSetsSummary,
    hasAnySetData,
    getScreenModePerfString,
    handleSetInput,
    handleNoteInput,
    prefillFromLastSession,
    clearCurrentExerciseSets,
    isHistoryDrawerOpen,
    toggleHistoryDrawer,
    restoreHistoryEntry,
    deleteHistoryEntry,
    archiveWorkoutSession,
    toggleScreenMode
} from "../features/workout.js";
import {
    getCurrentStoryIdx,
    openStoryModal,
    closeStoryModal,
    selectStoryTab,
    shareCurrentStoryPNG,
    downloadSinglePNG,
    downloadAllPNGs
} from "../features/shareCard.js";

let activeTab = 0;
let toastTimeout = null;

export function getActiveTab() {
    return activeTab;
}

export function showToast(msg) {
    const t = document.getElementById("toast");
    const msgEl = document.getElementById("toast-message");
    if (!t || !msgEl) return;
    msgEl.textContent = msg;
    t.classList.add("visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        t.classList.remove("visible");
    }, 2400);
}

export function switchTab(idx) {
    if (activeTab !== idx) {
        hapticTap(10);
        activeTab = idx;
        window.scrollTo({ top: 0, behavior: "smooth" });
        render();
    }
}

function iLabel(vIdx) {
    return vIdx === 0 ? "Principal" : `V${vIdx}`;
}

function escapeAttr(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/* =========================================================================
   MODALE DE RESTAURATION PRESSE-PAPIERS (COLLER CODE JSON)
   ========================================================================= */
export function openPasteModal() {
    hapticTap(8);
    const modal = document.getElementById("pasteModal");
    const ta = document.getElementById("pasteTextarea");
    if (ta) ta.value = "";
    if (modal) modal.classList.remove("hidden");
    if (ta) setTimeout(() => ta.focus(), 80);
}

export function closePasteModal() {
    const modal = document.getElementById("pasteModal");
    if (modal) modal.classList.add("hidden");
}

export function confirmPasteRestore() {
    const ta = document.getElementById("pasteTextarea");
    const raw = ta ? ta.value : "";
    const ok = importDatabaseFromJSONString(raw, () => render(), showToast);
    if (ok) {
        closePasteModal();
    }
}

export function triggerJSONImport() {
    hapticTap(8);
    const inp = document.getElementById("json-file-input");
    if (inp) inp.click();
}

/* =========================================================================
   EXPORT DE FICHIERS DE CONFIGURATION (.ZIP / CONFIGS)
   ========================================================================= */
function getConfigFileContent(type) {
    if (type === "package.json") {
        return JSON.stringify(
            {
                name: "pplu-basicfit-app",
                version: "2.0.0",
                description: "Application Android PPLU Basic-Fit Hypertrophie & Tracker (Architecture Modulaire)",
                scripts: {
                    "cap:init": "npx cap add android",
                    "cap:sync": "npx cap sync android",
                    "cap:open": "npx cap open android"
                },
                dependencies: {
                    "@capacitor/android": "^6.0.0",
                    "@capacitor/cli": "^6.0.0",
                    "@capacitor/core": "^6.0.0",
                    "@capacitor/filesystem": "^6.0.0",
                    "@capacitor/share": "^6.0.0"
                }
            },
            null,
            2
        );
    } else if (type === "capacitor.config.json") {
        return JSON.stringify(
            {
                appId: "com.basicfit.pplu",
                appName: "PPLU Basic-Fit",
                webDir: "www",
                backgroundColor: "#0b0d11",
                android: {
                    allowMixedContent: true
                }
            },
            null,
            2
        );
    } else if (type === "build-apk.yml") {
        return [
            "name: Build Android APK",
            "on:",
            "  push:",
            "    branches: [ main, master ]",
            "  workflow_dispatch:",
            "jobs:",
            "  build:",
            "    runs-on: ubuntu-latest",
            "    steps:",
            "      - name: Checkout code",
            "        uses: actions/checkout@v4",
            "      - name: Setup Node.js",
            "        uses: actions/setup-node@v4",
            "        with:",
            "          node-version: 20",
            "      - name: Setup Java 17",
            "        uses: actions/setup-java@v4",
            "        with:",
            "          distribution: 'temurin'",
            "          java-version: 17",
            "      - name: Install Dependencies & Sync Capacitor",
            "        run: |",
            "          npm install",
            "          if [ ! -d \"android\" ]; then npx cap add android; fi",
            "          npx cap sync android",
            "      - name: Compile Debug APK with Gradle",
            "        run: |",
            "          cd android",
            "          chmod +x gradlew",
            "          ./gradlew assembleDebug",
            "      - name: Upload Ready-to-Install APK",
            "        uses: actions/upload-artifact@v4",
            "        with:",
            "          name: PPLU-BasicFit-APK",
            "          path: android/app/build/outputs/apk/debug/app-debug.apk"
        ].join("\n");
    }
    return "";
}

export async function downloadConfigFile(type) {
    const content = getConfigFileContent(type);
    if (!content) return;

    const capPlugins = window.Capacitor?.Plugins;
    if (isCapacitorNative() && capPlugins?.Filesystem && capPlugins?.Share) {
        try {
            const writeRes = await capPlugins.Filesystem.writeFile({
                path: type,
                data: content,
                directory: "CACHE",
                encoding: "utf8"
            });
            await capPlugins.Share.share({
                title: `Fichier ${type}`,
                url: writeRes.uri,
                files: [writeRes.uri],
                dialogTitle: `Partager ${type}`
            });
            showToast(`📤 ${type} prêt à partager !`);
            return;
        } catch (err) {
            if (err && /cancel/i.test(String(err.message || err))) return;
        }
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = type;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    showToast(`📥 ${type} téléchargé !`);
}

function createZipBlob(files) {
    const crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        crcTable[n] = c >>> 0;
    }
    function crc32(bytes) {
        let crc = 0xffffffff;
        for (let i = 0; i < bytes.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xff];
        }
        return (crc ^ 0xffffffff) >>> 0;
    }

    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    files.forEach(f => {
        const nameBytes = encoder.encode(f.name);
        const dataBytes = encoder.encode(f.content);
        const crc = crc32(dataBytes);
        const size = dataBytes.length;

        const localHeader = new Uint8Array(30 + nameBytes.length);
        const lv = new DataView(localHeader.buffer);
        lv.setUint32(0, 0x04034b50, true);
        lv.setUint16(4, 20, true);
        lv.setUint16(6, 0x0800, true);
        lv.setUint16(8, 0, true);
        lv.setUint16(10, 0, true);
        lv.setUint16(12, 0, true);
        lv.setUint32(14, crc, true);
        lv.setUint32(18, size, true);
        lv.setUint32(22, size, true);
        lv.setUint16(26, nameBytes.length, true);
        lv.setUint16(28, 0, true);
        localHeader.set(nameBytes, 30);

        const centralHeader = new Uint8Array(46 + nameBytes.length);
        const cv = new DataView(centralHeader.buffer);
        cv.setUint32(0, 0x02014b50, true);
        cv.setUint16(4, 20, true);
        cv.setUint16(6, 20, true);
        cv.setUint16(8, 0x0800, true);
        cv.setUint16(10, 0, true);
        cv.setUint16(12, 0, true);
        cv.setUint16(14, crc, true);
        cv.setUint32(16, crc, true);
        cv.setUint32(20, size, true);
        cv.setUint32(24, size, true);
        cv.setUint16(28, nameBytes.length, true);
        cv.setUint16(30, 0, true);
        cv.setUint16(32, 0, true);
        cv.setUint16(34, 0, true);
        cv.setUint16(36, 0, true);
        cv.setUint32(38, 0, true);
        cv.setUint32(42, offset, true);
        centralHeader.set(nameBytes, 46);

        localParts.push(localHeader, dataBytes);
        centralParts.push(centralHeader);
        offset += localHeader.length + size;
    });

    let centralSize = 0;
    centralParts.forEach(p => {
        centralSize += p.length;
    });

    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);
    ev.setUint16(20, 0, true);

    return new Blob([...localParts, ...centralParts, eocd], { type: "application/zip" });
}

function uint8ToBase64(bytes) {
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export async function downloadProjectZip() {
    saveDatabase(true);
    const db = getDB();
    const dateTag = new Date().toISOString().slice(0, 10);
    const zipFileName = `pplu-basicfit-backup-${dateTag}.zip`;

    const files = [
        { name: `pplu-performances-${dateTag}.json`, content: JSON.stringify(db, null, 2) },
        { name: "package.json", content: getConfigFileContent("package.json") },
        { name: "capacitor.config.json", content: getConfigFileContent("capacitor.config.json") },
        { name: ".github/workflows/build-apk.yml", content: getConfigFileContent("build-apk.yml") }
    ];
    const zipBlob = createZipBlob(files);

    const capPlugins = window.Capacitor?.Plugins;
    if (isCapacitorNative() && capPlugins?.Filesystem && capPlugins?.Share) {
        try {
            const arrayBuf = await zipBlob.arrayBuffer();
            const base64Zip = uint8ToBase64(new Uint8Array(arrayBuf));
            const writeRes = await capPlugins.Filesystem.writeFile({
                path: zipFileName,
                data: base64Zip,
                directory: "CACHE"
            });
            await capPlugins.Share.share({
                title: "Archive ZIP PPLU Basic-Fit",
                text: `Archive complète PPLU (${dateTag})`,
                url: writeRes.uri,
                files: [writeRes.uri],
                dialogTitle: "Partager l'archive .ZIP"
            });
            showToast("📦 Archive .ZIP prête à partager !");
            return;
        } catch (err) {
            if (err && /cancel/i.test(String(err.message || err))) return;
        }
    }

    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = zipFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    showToast("📦 Archive .ZIP téléchargée !");
}

/* =========================================================================
   FONCTION PRINCIPALE DE RENDU DOM
   ========================================================================= */
export function render() {
    // 1. Mise à jour du Header Compact
    const headerTitle = document.getElementById("header-screen-title");
    if (headerTitle) {
        if (activeTab < 4) {
            const w = WORKOUTS[activeTab];
            headerTitle.textContent = `${activeTab + 1}. ${w.shortTab}`;
        } else {
            headerTitle.textContent = "⚙️ SYSTÈME";
        }
    }

    // 2. Mise à jour de la Barre de Navigation Basse
    const bottomNav = document.getElementById("bottomNav");
    if (bottomNav) {
        bottomNav.innerHTML = `
            <div class="bottom-nav-grid">
                ${WORKOUTS.map(
                    (w, i) => `
                    <button data-action="switch-tab" data-tab="${i}" class="nav-item ${activeTab === i ? "active" : ""}">
                        <span class="nav-icon">${w.icon}</span>
                        <span class="nav-lbl">${i + 1}. ${w.shortTab}</span>
                        <span class="nav-sub">${w.subTab}</span>
                    </button>
                `
                ).join("")}
                <button data-action="switch-tab" data-tab="4" class="nav-item ${activeTab === 4 ? "active" : ""}">
                    <span class="nav-icon">⚙️</span>
                    <span class="nav-lbl">SYSTÈME</span>
                    <span class="nav-sub">JSON & Sauv.</span>
                </button>
            </div>
        `;
    }

    const mainEl = document.getElementById("mainContent");
    if (!mainEl) return;

    // 3. ÉCRAN 5 : SYSTÈME, SAUVEGARDE JSON, VOLUME & RÈGLES BIOMÉCANIQUES
    if (activeTab === 4) {
        mainEl.innerHTML = `
            <div class="sys-grid">
                <!-- CARTE 1 : SAUVEGARDE HYBRIDE & PARTAGE NATIF ANDROID -->
                <div class="sys-card">
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <h3 style="font-size:14px; font-weight:900; color:var(--accent);">💾 Sauvegarde & Transfert Android</h3>
                        <span style="font-size:10px; font-weight:800; padding:2px 8px; border-radius:99px; background:rgba(16,185,129,0.15); color:#34d399;">LocalStorage + IndexedDB</span>
                    </div>
                    <p style="font-size:11.5px; color:var(--text-muted);">
                        Vos performances sont doublement sauvegardées hors-ligne en temps réel dans la mémoire de l'application.
                    </p>

                    <div class="sys-block">
                        <div style="font-size:12px; font-weight:800; color:#7dd3fc; margin-bottom:4px;">1. Base de Données (.JSON) & Partage Natif Android</div>
                        <p style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">Partagez votre sauvegarde vers Google Drive / Fichiers (via Capacitor Share) ou importez-la en 1 clic.</p>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                            <button data-action="export-json" class="btn-block sky">📤 Exporter / Partager</button>
                            <button data-action="import-json" class="btn-block emerald">📥 Importer .JSON</button>
                        </div>
                    </div>

                    <div class="sys-block">
                        <div style="font-size:12px; font-weight:800; color:#fcd34d; margin-bottom:4px;">2. Presse-papiers Rapide (Copier / Coller)</div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:6px;">
                            <button data-action="copy-backup" class="btn-block">📋 Copier Code</button>
                            <button data-action="open-paste-modal" class="btn-block">📥 Coller Code</button>
                        </div>
                    </div>

                    <div class="sys-block">
                        <div style="font-size:12px; font-weight:800; color:#fde68a; margin-bottom:4px;">3. Archive Complète (.ZIP)</div>
                        <p style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">Génère une archive .ZIP contenant votre base JSON et les fichiers de configuration Capacitor/GitHub.</p>
                        <button data-action="download-zip" class="btn-block amber">📦 Exporter l'Archive .ZIP</button>
                    </div>
                </div>

                <!-- CARTE 2 : VOLUME HEBDOMADAIRE & RÈGLES BIOMÉCANIQUES -->
                <div class="sys-card">
                    <h3 style="font-size:14px; font-weight:900; color:var(--accent);">📈 Volume Hebdomadaire Scientifique</h3>
                    <div style="display:flex; flex-direction:column; gap:9px;">
                        ${VOLUME_DATA.map(
                            v => `
                            <div>
                                <div style="display:flex; justify-content:space-between; font-size:11.5px;">
                                    <strong style="color:#e5e7eb;">${v.muscle}</strong>
                                    <span style="color:var(--accent); font-family:var(--font-mono); font-weight:800;">${v.sets} séries (${v.target})</span>
                                </div>
                                <div class="vol-bar-bg">
                                    <div class="vol-bar-fill" style="width:${Math.min(100, (v.sets / 16) * 100)}%"></div>
                                </div>
                            </div>
                        `
                        ).join("")}
                    </div>

                    <div class="sys-block" style="margin-top:4px;">
                        <div style="font-size:11px; font-weight:900; color:#34d399; text-transform:uppercase; margin-bottom:6px;">🛡️ Sécurité Biomécanique Long Biceps</div>
                        <ul style="list-style:none; display:flex; flex-direction:column; gap:5px; font-size:11.5px; color:#cbd5e1;">
                            ${BIOMECHANICS_RULES.map(
                                r => `
                                <li style="padding-left:8px; border-left:2px solid var(--safe);">
                                    <strong>${r.title} :</strong> ${r.desc}
                                </li>
                            `
                            ).join("")}
                        </ul>
                    </div>
                </div>

                <!-- CARTE 3 : FICHIERS INDIVIDUELS CAPACITOR + GITHUB ACTIONS -->
                <div class="sys-card" style="grid-column: 1 / -1;">
                    <div>
                        <h3 style="font-size:14px; font-weight:900; color:#7dd3fc;">🛠️ Fichiers de configuration individuels (Capacitor & CI/CD)</h3>
                        <p style="font-size:11.5px; color:var(--text-muted);">
                            Exportez ou partagez chaque fichier de configuration séparément si besoin :
                        </p>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:8px;">
                        <button data-action="download-config" data-file="package.json" class="btn-block">📄 1. package.json</button>
                        <button data-action="download-config" data-file="capacitor.config.json" class="btn-block">⚙️ 2. capacitor.config.json</button>
                        <button data-action="download-config" data-file="build-apk.yml" class="btn-block sky">🚀 3. .github/workflows/build-apk.yml</button>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // 4. ÉCRANS SÉANCES (PUSH, PULL, LEGS, UPPER)
    const w = WORKOUTS[activeTab];
    const order = getWorkoutOrder(activeTab);
    const hasCustomOrd = isCustomOrder(activeTab);

    mainEl.innerHTML = `
        <!-- SOUS-EN-TÊTE SÉANCE AVEC BOUTON VALIDER & ARCHIVER -->
        <div class="workout-subheader">
            <div>
                <h1 class="workout-subheader-title">${w.title}</h1>
                <p class="workout-subheader-sub">${w.subtitle}</p>
            </div>
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;" class="hide-on-screen">
                ${
                    hasCustomOrd
                        ? `
                    <button data-action="reset-order" data-widx="${activeTab}" class="btn-reset-order">
                        ↺ Ordre initial
                    </button>
                `
                        : ""
                }
                <button data-action="archive-session" data-widx="${activeTab}" class="btn-top-action archive" style="padding:0 12px; height:32px;">
                    ✅ Valider & Archiver
                </button>
            </div>
        </div>

        <!-- PILE DES CARTES EXERCICES -->
        <div class="exercises-stack">
            ${order
                .map((origIdx, posIdx) => {
                    const ex = w.exercises[origIdx];
                    const vIdx = getVarIdx(activeTab, origIdx);
                    const curVar = ex.variants[vIdx];
                    const rec = getRecord(activeTab, origIdx, vIdx);
                    const lastSummary = formatSetsSummary(rec.lastSets);
                    const hasCurData = hasAnySetData(rec.currentSets);
                    const screenPerfStr = getScreenModePerfString(activeTab, origIdx, vIdx);
                    const isHistoryOpen = isHistoryDrawerOpen(activeTab, origIdx, vIdx);

                    return `
                    <article class="card-ex">
                        <!-- EN-TÊTE EXERCICE -->
                        <div class="card-top">
                            <div class="ex-identity">
                                <span class="ex-badge-num">${posIdx + 1}</span>
                                <h2 class="ex-title">${curVar.name}</h2>
                                <span class="ex-muscle-pill">${ex.muscle}</span>
                            </div>

                            <div class="card-actions-right">
                                <div class="swap-group hide-on-screen">
                                    <button data-action="move-order" data-widx="${activeTab}" data-pos="${posIdx}" data-dir="-1" class="btn-swap" ${posIdx === 0 ? "disabled" : ""} title="Monter">↑</button>
                                    <button data-action="move-order" data-widx="${activeTab}" data-pos="${posIdx}" data-dir="1" class="btn-swap" ${posIdx === order.length - 1 ? "disabled" : ""} title="Descendre">↓</button>
                                </div>
                                <div class="seg-variants">
                                    ${ex.variants
                                        .map(
                                            (_, i) => `
                                        <button data-action="set-variant" data-widx="${activeTab}" data-orig="${origIdx}" data-vidx="${i}" class="btn-seg ${i === vIdx ? "active" : ""}">
                                            ${i === 0 ? "Principal" : "V" + i}
                                        </button>
                                    `
                                        )
                                        .join("")}
                                </div>
                            </div>
                        </div>

                        <!-- SPECS : SÉRIES / RIR / REPOS CLIQUABLE -->
                        <div class="specs-bar">
                            <span class="spec-sets">${ex.sets}</span>
                            <span class="spec-rir">${ex.rir}</span>
                            <button data-action="start-timer" data-secs="${ex.restSec}" class="spec-rest-btn">
                                ⏱️ Repos ${ex.rest}
                            </button>
                        </div>

                        <!-- ENCADRÉ BLEU : PRISE EXACTE -->
                        <div class="grip-callout">
                            ✋ Prise : <strong>${curVar.grip}</strong>
                        </div>

                        <!-- BLOC DE SUIVI DES CHARGES (MASQUÉ EN MODE SCREEN) -->
                        <div class="hide-on-screen perf-panel">
                            <div class="perf-header">
                                <div class="perf-ref">
                                    ${
                                        lastSummary
                                            ? `🎯 <span style="color:var(--text-muted);">Dernière (${rec.lastDate || "Arch."}) :</span> <span class="perf-ref-mono">${lastSummary}</span>`
                                            : `🎯 <span style="color:var(--text-dim);">Aucune séance archivée (${iLabel(vIdx)})</span>`
                                    }
                                </div>
                                <div class="perf-QuickBtns">
                                    ${
                                        lastSummary
                                            ? `<button data-action="prefill-sets" data-widx="${activeTab}" data-orig="${origIdx}" data-vidx="${vIdx}" class="chip-btn amber">⚡ Pré-remplir</button>`
                                            : ""
                                    }
                                    ${
                                        rec.history && rec.history.length > 0
                                            ? `<button data-action="toggle-history" data-widx="${activeTab}" data-orig="${origIdx}" data-vidx="${vIdx}" class="chip-btn sky">📜 Historique (${rec.history.length})</button>`
                                            : ""
                                    }
                                    ${
                                        hasCurData
                                            ? `<button data-action="clear-sets" data-widx="${activeTab}" data-orig="${origIdx}" data-vidx="${vIdx}" class="chip-btn danger">🗑️ Vider</button>`
                                            : ""
                                    }
                                </div>
                            </div>

                            <!-- GRILLE DES SÉRIES -->
                            <div class="sets-grid ${ex.numSets === 4 ? "cols-4" : ""}">
                                ${Array.from({ length: ex.numSets })
                                    .map((_, sIdx) => {
                                        const curSet = rec.currentSets[sIdx] || { kg: "", reps: "" };
                                        const lastSet = rec.lastSets[sIdx] || { kg: "", reps: "" };
                                        const kgPh = lastSet.kg ? `${lastSet.kg}` : "kg";
                                        const repsPh = lastSet.reps ? `${lastSet.reps}` : "reps";
                                        return `
                                        <div class="set-box">
                                            <div class="set-box-top">
                                                <span>S${sIdx + 1}</span>
                                                ${lastSet.kg || lastSet.reps ? `<span class="set-last-hint">${lastSet.kg || 0}×${lastSet.reps || 0}</span>` : ""}
                                            </div>
                                            <div class="set-pair">
                                                <div>
                                                    <input
                                                        type="text"
                                                        inputmode="decimal"
                                                        value="${escapeAttr(curSet.kg)}"
                                                        placeholder="${escapeAttr(kgPh)}"
                                                        data-input="set-metric"
                                                        data-widx="${activeTab}"
                                                        data-orig="${origIdx}"
                                                        data-vidx="${vIdx}"
                                                        data-sidx="${sIdx}"
                                                        data-field="kg"
                                                        class="inp-metric"
                                                    />
                                                    <span class="inp-lbl">KG</span>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        inputmode="decimal"
                                                        value="${escapeAttr(curSet.reps)}"
                                                        placeholder="${escapeAttr(repsPh)}"
                                                        data-input="set-metric"
                                                        data-widx="${activeTab}"
                                                        data-orig="${origIdx}"
                                                        data-vidx="${vIdx}"
                                                        data-sidx="${sIdx}"
                                                        data-field="reps"
                                                        class="inp-metric reps"
                                                    />
                                                    <span class="inp-lbl">REPS</span>
                                                </div>
                                            </div>
                                        </div>
                                        `;
                                    })
                                    .join("")}
                            </div>

                            <!-- CHAMP RÉGLAGES MACHINE / NOTE -->
                            <div class="note-bar">
                                <span class="note-bar-lbl">📝 Réglages machine / Note :</span>
                                <input
                                    type="text"
                                    value="${escapeAttr(rec.note)}"
                                    placeholder="Siège cran 4, poulie hauteur 3..."
                                    data-input="exercise-note"
                                    data-widx="${activeTab}"
                                    data-orig="${origIdx}"
                                    data-vidx="${vIdx}"
                                    class="inp-note"
                                />
                            </div>

                            <!-- TIROIR HISTORIQUE MULTI-DATES -->
                            ${
                                isHistoryOpen && rec.history.length > 0
                                    ? `
                                <div class="history-list">
                                    <div style="font-weight:800; color:#7dd3fc;">📜 Historique (${curVar.name}) :</div>
                                    ${rec.history
                                        .map(
                                            (h, hIdx) => `
                                        <div class="history-row">
                                            <div>
                                                <strong style="color:var(--amber); font-family:var(--font-mono);">${h.date}</strong> :
                                                <span style="color:#e2e8f0; font-family:var(--font-mono);">${formatSetsSummary(h.sets)}</span>
                                            </div>
                                            <div style="display:flex; gap:4px;">
                                                <button data-action="restore-history" data-widx="${activeTab}" data-orig="${origIdx}" data-vidx="${vIdx}" data-hidx="${hIdx}" class="chip-btn amber">Copier</button>
                                                <button data-action="delete-history" data-widx="${activeTab}" data-orig="${origIdx}" data-vidx="${vIdx}" data-hidx="${hIdx}" class="chip-btn danger">✕</button>
                                            </div>
                                        </div>
                                    `
                                        )
                                        .join("")}
                                </div>
                            `
                                    : ""
                            }
                        </div>

                        <!-- BANDEAU MODE SCREEN (1 SEUL ÉCRAN) -->
                        <div class="show-on-screen screen-perf-banner">
                            <div id="sc-summary-${activeTab}-${origIdx}">${screenPerfStr}</div>
                            <div id="sc-note-${activeTab}-${origIdx}" style="color:#7dd3fc; font-size:10.5px; display:${rec.note && rec.note.trim() ? "block" : "none"};">
                                ${rec.note && rec.note.trim() ? `📝 Réglage : ${rec.note.trim()}` : ""}
                            </div>
                        </div>

                        <!-- CONSIGNE BIOMÉCANIQUE -->
                        <div class="hide-on-screen bio-callout">
                            ${ex.bio}
                        </div>
                    </article>
                    `;
                })
                .join("")}
        </div>

        <!-- BOUTON DE FIN DE SÉANCE EN BAS DU FLUX -->
        <div class="hide-on-screen" style="margin-top:14px;">
            <button data-action="archive-session" data-widx="${activeTab}" class="btn-block emerald" style="padding:12px; font-size:13px; font-weight:900;">
                ✅ Valider & Archiver la séance ${w.shortTab}
            </button>
        </div>
    `;
}

/* =========================================================================
   DÉLÉGATION D'ÉVÉNEMENTS GLOBALE (CLICK, INPUT, CHANGE)
   ========================================================================= */
export function bindDOMEvents() {
    document.addEventListener("click", e => {
        // Fermeture modale en cliquant sur l'arrière-plan
        if (e.target && e.target.id === "storyModal") {
            closeStoryModal();
            return;
        }
        if (e.target && e.target.id === "pasteModal") {
            closePasteModal();
            return;
        }

        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const action = btn.dataset.action;

        switch (action) {
            case "switch-tab":
                switchTab(Number(btn.dataset.tab));
                break;
            case "toggle-wakelock":
                toggleWakeLock();
                break;
            case "toggle-screen-mode":
                toggleScreenMode(showToast);
                break;
            case "open-story-modal":
                openStoryModal(activeTab < 4 ? activeTab : 0);
                break;
            case "close-story-modal":
                closeStoryModal();
                break;
            case "select-story-tab":
                selectStoryTab(Number(btn.dataset.idx));
                break;
            case "share-current-story":
                shareCurrentStoryPNG(showToast);
                break;
            case "download-current-story":
                downloadSinglePNG(getCurrentStoryIdx(), showToast);
                break;
            case "download-all-pngs":
                downloadAllPNGs(showToast);
                break;
            case "download-zip":
                downloadProjectZip();
                break;
            case "export-json":
                shareOrDownloadJSON(showToast);
                break;
            case "import-json":
                triggerJSONImport();
                break;
            case "copy-backup":
                copyBackupToClipboard(showToast);
                break;
            case "open-paste-modal":
                openPasteModal();
                break;
            case "close-paste-modal":
                closePasteModal();
                break;
            case "confirm-paste-restore":
                confirmPasteRestore();
                break;
            case "download-config":
                downloadConfigFile(btn.dataset.file);
                break;
            case "set-variant":
                setVariant(
                    Number(btn.dataset.widx),
                    Number(btn.dataset.orig),
                    Number(btn.dataset.vidx),
                    render
                );
                break;
            case "move-order":
                moveExerciseOrder(
                    Number(btn.dataset.widx),
                    Number(btn.dataset.pos),
                    Number(btn.dataset.dir),
                    render,
                    showToast
                );
                break;
            case "reset-order":
                resetWorkoutOrder(Number(btn.dataset.widx), render, showToast);
                break;
            case "archive-session":
                archiveWorkoutSession(Number(btn.dataset.widx), render, showToast);
                break;
            case "prefill-sets":
                prefillFromLastSession(
                    Number(btn.dataset.widx),
                    Number(btn.dataset.orig),
                    Number(btn.dataset.vidx),
                    render,
                    showToast
                );
                break;
            case "clear-sets":
                clearCurrentExerciseSets(
                    Number(btn.dataset.widx),
                    Number(btn.dataset.orig),
                    Number(btn.dataset.vidx),
                    render,
                    showToast
                );
                break;
            case "toggle-history":
                toggleHistoryDrawer(
                    Number(btn.dataset.widx),
                    Number(btn.dataset.orig),
                    Number(btn.dataset.vidx),
                    render
                );
                break;
            case "restore-history":
                restoreHistoryEntry(
                    Number(btn.dataset.widx),
                    Number(btn.dataset.orig),
                    Number(btn.dataset.vidx),
                    Number(btn.dataset.hidx),
                    render,
                    showToast
                );
                break;
            case "delete-history":
                deleteHistoryEntry(
                    Number(btn.dataset.widx),
                    Number(btn.dataset.orig),
                    Number(btn.dataset.vidx),
                    Number(btn.dataset.hidx),
                    render,
                    showToast
                );
                break;
            case "start-timer":
                startRestTimer(Number(btn.dataset.secs));
                break;
            case "adjust-timer":
                adjustRestTimer(Number(btn.dataset.delta));
                break;
            case "toggle-timer":
                toggleTimerPlayPause();
                break;
            case "reset-timer":
                resetRestTimer();
                break;
            default:
                break;
        }
    });

    // Saisie directe dans les champs KG / REPS et Notes sans re-render du DOM
    document.addEventListener("input", e => {
        const el = e.target;
        if (!el || !el.dataset) return;
        if (el.dataset.input === "set-metric") {
            handleSetInput(
                Number(el.dataset.widx),
                Number(el.dataset.orig),
                Number(el.dataset.vidx),
                Number(el.dataset.sidx),
                el.dataset.field,
                el.value
            );
        } else if (el.dataset.input === "exercise-note") {
            handleNoteInput(
                Number(el.dataset.widx),
                Number(el.dataset.orig),
                Number(el.dataset.vidx),
                el.value
            );
        }
    });

    // Import de fichier .JSON
    const fileInput = document.getElementById("json-file-input");
    if (fileInput) {
        fileInput.addEventListener("change", e => {
            handleJSONFileInput(e, () => render(), showToast);
        });
    }
}
