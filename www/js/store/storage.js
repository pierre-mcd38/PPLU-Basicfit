/* =========================================================================
   COUCHE D'ABSTRACTION PERSISTANCE HYBRIDE — LOCALSTORAGE + INDEXEDDB
   Export / Import JSON avec support natif Capacitor Android (@capacitor/filesystem & @capacitor/share)
   ========================================================================= */

import { WORKOUTS } from "../data/program.js";

const DB_KEY = "pplu_tracker_v4_db";
const IDB_NAME = "pplu_native_idb";
const IDB_STORE = "app_state";

export function getDefaultOrder(wIdx) {
    return WORKOUTS[wIdx].exercises.map((_, i) => i);
}

export function createEmptyDB() {
    return {
        version: 6,
        updatedAt: 0,
        selectedVariants: {},
        exerciseOrder: {
            0: [0, 1, 2, 3, 4, 5],
            1: [0, 1, 2, 3, 4, 5],
            2: [0, 1, 2, 3, 4],
            3: [0, 1, 2, 3, 4, 5, 6]
        },
        records: {}
    };
}

/**
 * Migre automatiquement une sauvegarde issue de l'ancienne version (v5 monolithique)
 * vers le nouveau référentiel d'exercices et variantes optimisé (v6).
 */
function migrateLegacyV5ToV6(data) {
    if (!data || typeof data !== "object" || (data.version && data.version >= 6)) {
        return data;
    }

    const oldRec = data.records || {};
    const newRec = { ...oldRec };

    const remapRecordKey = pairs => {
        const snapshot = {};
        pairs.forEach(([fromKey]) => {
            if (oldRec[fromKey] !== undefined) {
                snapshot[fromKey] = JSON.parse(JSON.stringify(oldRec[fromKey]));
                delete newRec[fromKey];
            }
        });
        pairs.forEach(([fromKey, toKey]) => {
            if (snapshot[fromKey] !== undefined) {
                newRec[toKey] = snapshot[fromKey];
            }
        });
    };

    // 1. PUSH : inversion Ex 1 (Haut Pecs) <-> Ex 2 (Shoulder Press) + Écarté poulie en Principal
    remapRecordKey([
        ["0_2_0", "0_1_0"],
        ["0_2_1", "0_1_1"],
        ["0_2_2", "0_1_2"],
        ["0_1_1", "0_2_0"],
        ["0_1_0", "0_2_1"],
        ["0_1_2", "0_2_2"]
    ]);

    // 2. PULL : inversion V1 <-> V2 sur Tirage vertical (Ex 0)
    remapRecordKey([
        ["1_0_1", "1_0_2"],
        ["1_0_2", "1_0_1"]
    ]);

    // 3. UPPER : Développé incliné haltères passé en Principal (0 <-> 2) & Élévations latérales (1 <-> 2)
    remapRecordKey([
        ["3_0_0", "3_0_2"],
        ["3_0_2", "3_0_0"],
        ["3_4_1", "3_4_2"],
        ["3_4_2", "3_4_1"]
    ]);

    data.records = newRec;
    data.version = 6;
    return data;
}

export function normalizeDB(data) {
    if (!data || typeof data !== "object") return createEmptyDB();
    migrateLegacyV5ToV6(data);
    if (!data.selectedVariants || typeof data.selectedVariants !== "object") {
        data.selectedVariants = {};
    }
    if (!data.records || typeof data.records !== "object") {
        data.records = {};
    }
    if (!data.exerciseOrder || typeof data.exerciseOrder !== "object") {
        data.exerciseOrder = {};
    }
    WORKOUTS.forEach((_, wIdx) => {
        const def = getDefaultOrder(wIdx);
        const cur = data.exerciseOrder[wIdx];
        if (!Array.isArray(cur) || cur.length !== def.length) {
            data.exerciseOrder[wIdx] = def;
        }
    });
    return data;
}

function loadInitialDatabase() {
    let localData = null;
    try {
        const raw = localStorage.getItem(DB_KEY);
        if (raw) localData = JSON.parse(raw);
    } catch (e) {
        console.warn("Erreur lecture localStorage:", e);
    }

    const embeddedData = window.__INITIAL_DB__ || null;
    if (embeddedData && (!localData || (embeddedData.updatedAt || 0) > (localData.updatedAt || 0))) {
        localData = JSON.parse(JSON.stringify(embeddedData));
        try {
            localStorage.setItem(DB_KEY, JSON.stringify(localData));
        } catch (e) {}
    }

    return normalizeDB(localData);
}

let db = loadInitialDatabase();

export function getDB() {
    return db;
}

export function setDB(newData) {
    db = normalizeDB(newData);
    saveDatabase(true);
    return db;
}

function saveToIndexedDB(stateObj) {
    if (!window.indexedDB) return;
    try {
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = function (e) {
            const idb = e.target.result;
            if (!idb.objectStoreNames.contains(IDB_STORE)) {
                idb.createObjectStore(IDB_STORE);
            }
        };
        req.onsuccess = function (e) {
            const idb = e.target.result;
            const tx = idb.transaction(IDB_STORE, "readwrite");
            tx.objectStore(IDB_STORE).put(stateObj, DB_KEY);
        };
    } catch (e) {
        console.warn("Erreur sauvegarde IndexedDB:", e);
    }
}

export function restoreFromIndexedDBIfNewer(onRestored) {
    if (!window.indexedDB) return;
    try {
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = function (e) {
            const idb = e.target.result;
            if (!idb.objectStoreNames.contains(IDB_STORE)) {
                idb.createObjectStore(IDB_STORE);
            }
        };
        req.onsuccess = function (e) {
            const idb = e.target.result;
            const tx = idb.transaction(IDB_STORE, "readonly");
            const getReq = tx.objectStore(IDB_STORE).get(DB_KEY);
            getReq.onsuccess = function () {
                const idbData = getReq.result;
                if (idbData && (idbData.updatedAt || 0) > (db.updatedAt || 0)) {
                    db = normalizeDB(idbData);
                    try {
                        localStorage.setItem(DB_KEY, JSON.stringify(db));
                    } catch (err) {}
                    if (typeof onRestored === "function") onRestored(db);
                }
            };
        };
    } catch (e) {
        console.warn("Erreur restauration IndexedDB:", e);
    }
}

export function saveDatabase(silent = true, showToastFn = null) {
    db.updatedAt = Date.now();
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {}
    saveToIndexedDB(db);

    const dot = document.getElementById("save-dot");
    if (dot) {
        dot.style.transform = "scale(1.4)";
        setTimeout(() => {
            dot.style.transform = "scale(1)";
        }, 180);
    }
    if (!silent && typeof showToastFn === "function") {
        showToastFn("💾 Données enregistrées !");
    }
}

/**
 * Détecte si l'application tourne dans le conteneur natif Capacitor (Android/iOS)
 */
export function isCapacitorNative() {
    return Boolean(
        window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === "function" &&
        window.Capacitor.isNativePlatform()
    );
}

/**
 * Export / Partage JSON compatible Android WebView (Capacitor Filesystem + Share)
 * avec fallback Web Share API et téléchargement <a download> sur PC.
 */
export async function shareOrDownloadJSON(showToastFn) {
    saveDatabase(true);
    const jsonStr = JSON.stringify(db, null, 2);
    const dateTag = new Date().toISOString().slice(0, 10);
    const fileName = `pplu-performances-${dateTag}.json`;

    // 1. Mode Natif Android via @capacitor/filesystem & @capacitor/share
    const capPlugins = window.Capacitor?.Plugins;
    if (isCapacitorNative() && capPlugins?.Filesystem && capPlugins?.Share) {
        try {
            const writeResult = await capPlugins.Filesystem.writeFile({
                path: fileName,
                data: jsonStr,
                directory: "CACHE",
                encoding: "utf8"
            });
            await capPlugins.Share.share({
                title: "Sauvegarde PPLU Basic-Fit",
                text: `Sauvegarde des performances PPLU (${dateTag})`,
                url: writeResult.uri,
                files: [writeResult.uri],
                dialogTitle: "Exporter / Partager la sauvegarde JSON"
            });
            if (showToastFn) showToastFn("📤 Partage Android ouvert !");
            return;
        } catch (err) {
            // Si l'utilisateur annule la boîte de dialogue de partage, on ne déclenche pas d'erreur
            if (err && /cancel/i.test(String(err.message || err))) {
                return;
            }
            console.warn("Fallback partage JSON après erreur Capacitor:", err);
        }
    }

    // 2. Fallback Web Share API Level 2 (navigateurs mobiles compatibles)
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
    if (navigator.canShare) {
        try {
            const file = new File([blob], fileName, { type: "application/json" });
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: "Sauvegarde PPLU Basic-Fit",
                    files: [file]
                });
                if (showToastFn) showToastFn("📤 Partage JSON ouvert !");
                return;
            }
        } catch (e) {
            if (e && e.name === "AbortError") return;
        }
    }

    // 3. Fallback standard Navigateur Desktop (<a download>)
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    if (showToastFn) showToastFn("📤 Fichier .JSON téléchargé !");
}

/**
 * Import d'une chaîne JSON ou d'un ancien fichier .HTML auto-porteur
 */
export function importDatabaseFromJSONString(rawInput, onSuccess, showToastFn) {
    if (!rawInput || !rawInput.trim()) {
        if (showToastFn) showToastFn("⚠️ Fichier ou code JSON vide");
        return false;
    }
    let jsonCandidate = rawInput.trim();

    // Si l'utilisateur importe un ancien fichier .html auto-porteur contenant window.__INITIAL_DB__ = {...};
    const htmlMatch = jsonCandidate.match(/window\.__INITIAL_DB__\s*=\s*(\{[\s\S]*?\});\s*<\/script>/i);
    if (htmlMatch && htmlMatch[1]) {
        jsonCandidate = htmlMatch[1];
    }

    try {
        const parsed = JSON.parse(jsonCandidate);
        if (!parsed || typeof parsed !== "object" || (!parsed.records && !parsed.selectedVariants)) {
            if (showToastFn) showToastFn("❌ Format de sauvegarde invalide");
            return false;
        }
        db = normalizeDB(parsed);
        saveDatabase(true);
        if (typeof onSuccess === "function") onSuccess(db);
        if (showToastFn) showToastFn("✅ Ancienne sauvegarde importée et migrée !");
        return true;
    } catch (e) {
        if (showToastFn) showToastFn("❌ Code JSON invalide ou corrompu");
        return false;
    }
}

export function handleJSONFileInput(event, onSuccess, showToastFn) {
    const file = event?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target?.result;
        importDatabaseFromJSONString(String(content || ""), onSuccess, showToastFn);
        event.target.value = "";
    };
    reader.onerror = function () {
        if (showToastFn) showToastFn("❌ Erreur lors de la lecture du fichier");
    };
    reader.readAsText(file);
}

export async function copyBackupToClipboard(showToastFn) {
    saveDatabase(true);
    const jsonStr = JSON.stringify(db);
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(jsonStr);
            if (showToastFn) showToastFn("📋 Code de sauvegarde copié !");
            return true;
        }
    } catch (e) {}

    // Fallback textarea pour WebView ancienne
    const ta = document.createElement("textarea");
    ta.value = jsonStr;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand("copy");
        if (showToastFn) showToastFn("📋 Code de sauvegarde copié !");
    } catch (err) {
        if (showToastFn) showToastFn("⚠️ Impossible de copier automatiquement");
    }
    document.body.removeChild(ta);
    return true;
}
