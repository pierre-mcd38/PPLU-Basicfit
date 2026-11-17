/* =========================================================================
   LOGIQUE MÉTIER D'ENTRAÎNEMENT — SÉRIES, PRÉ-REMPLISSAGE, VARIANTES,
   RÉORGANISATION DYNAMIQUE (↑/↓), HISTORIQUE & MODE SCREEN
   ========================================================================= */

import { WORKOUTS } from "../data/program.js";
import { getDB, getDefaultOrder, saveDatabase } from "../store/storage.js";
import { hapticTap } from "./timer.js";

const openHistoryDrawers = {};

export function getVarIdx(wIdx, origIdx) {
    const db = getDB();
    return db.selectedVariants[`${wIdx}_${origIdx}`] || 0;
}

export function setVariant(wIdx, origIdx, vIdx, onRender) {
    hapticTap(8);
    const db = getDB();
    db.selectedVariants[`${wIdx}_${origIdx}`] = vIdx;
    saveDatabase(true);
    if (typeof onRender === "function") onRender();
}

export function getWorkoutOrder(wIdx) {
    const db = getDB();
    if (!db.exerciseOrder[wIdx] || db.exerciseOrder[wIdx].length !== WORKOUTS[wIdx].exercises.length) {
        db.exerciseOrder[wIdx] = getDefaultOrder(wIdx);
    }
    return db.exerciseOrder[wIdx];
}

export function isCustomOrder(wIdx) {
    return getWorkoutOrder(wIdx).some((val, idx) => val !== idx);
}

export function moveExerciseOrder(wIdx, posIdx, dir, onRender, showToastFn) {
    const ord = getWorkoutOrder(wIdx);
    const target = posIdx + dir;
    if (target < 0 || target >= ord.length) return;
    hapticTap(12);
    const tmp = ord[posIdx];
    ord[posIdx] = ord[target];
    ord[target] = tmp;
    saveDatabase(true);
    if (typeof onRender === "function") onRender();
    if (typeof showToastFn === "function") showToastFn("↕️ Ordre des exercices ajusté");
}

export function resetWorkoutOrder(wIdx, onRender, showToastFn) {
    hapticTap(12);
    const db = getDB();
    db.exerciseOrder[wIdx] = getDefaultOrder(wIdx);
    saveDatabase(true);
    if (typeof onRender === "function") onRender();
    if (typeof showToastFn === "function") showToastFn("↺ Ordre initial rétabli");
}

export function getRecord(wIdx, origIdx, vIdx) {
    const db = getDB();
    const key = `${wIdx}_${origIdx}_${vIdx}`;
    const numSets = WORKOUTS[wIdx].exercises[origIdx].numSets;
    if (!db.records[key]) {
        db.records[key] = {
            currentSets: Array.from({ length: numSets }, () => ({ kg: "", reps: "" })),
            lastSets: Array.from({ length: numSets }, () => ({ kg: "", reps: "" })),
            lastDate: null,
            note: "",
            history: []
        };
    }
    const rec = db.records[key];
    if (!Array.isArray(rec.currentSets)) rec.currentSets = [];
    if (!Array.isArray(rec.lastSets)) rec.lastSets = [];
    if (!Array.isArray(rec.history)) rec.history = [];
    if (typeof rec.note !== "string") rec.note = "";

    while (rec.currentSets.length < numSets) rec.currentSets.push({ kg: "", reps: "" });
    while (rec.lastSets.length < numSets) rec.lastSets.push({ kg: "", reps: "" });
    return rec;
}

export function formatSetsSummary(setsArray) {
    if (!setsArray || !setsArray.length) return "";
    const parts = [];
    setsArray.forEach((s, idx) => {
        const kg = (s.kg || "").toString().trim();
        const reps = (s.reps || "").toString().trim();
        if (kg !== "" || reps !== "") {
            parts.push(`S${idx + 1}: ${kg || "0"}kg×${reps || "0"}`);
        }
    });
    return parts.join(" • ");
}

export function hasAnySetData(setsArray) {
    if (!setsArray) return false;
    return setsArray.some(
        s => (s.kg && s.kg.toString().trim() !== "") || (s.reps && s.reps.toString().trim() !== "")
    );
}

export function getScreenModePerfString(wIdx, origIdx, vIdx) {
    const rec = getRecord(wIdx, origIdx, vIdx);
    const curStr = formatSetsSummary(rec.currentSets);
    if (curStr) return `🔥 Aujourd'hui : ${curStr}`;
    const lastStr = formatSetsSummary(rec.lastSets);
    if (lastStr) return `🎯 Dernière (${rec.lastDate || "Archivée"}) : ${lastStr}`;
    return "🎯 Aucune série enregistrée";
}

export function handleSetInput(wIdx, origIdx, vIdx, sIdx, field, value) {
    const rec = getRecord(wIdx, origIdx, vIdx);
    rec.currentSets[sIdx][field] = value;
    saveDatabase(true);

    const scEl = document.getElementById(`sc-summary-${wIdx}-${origIdx}`);
    if (scEl) {
        scEl.textContent = getScreenModePerfString(wIdx, origIdx, vIdx);
    }
}

export function handleNoteInput(wIdx, origIdx, vIdx, value) {
    const rec = getRecord(wIdx, origIdx, vIdx);
    rec.note = value;
    saveDatabase(true);

    const scNoteEl = document.getElementById(`sc-note-${wIdx}-${origIdx}`);
    if (scNoteEl) {
        const t = value.trim();
        scNoteEl.textContent = t ? `📝 Réglage : ${t}` : "";
        scNoteEl.style.display = t ? "block" : "none";
    }
}

export function prefillFromLastSession(wIdx, origIdx, vIdx, onRender, showToastFn) {
    const rec = getRecord(wIdx, origIdx, vIdx);
    if (!hasAnySetData(rec.lastSets)) {
        if (typeof showToastFn === "function") {
            showToastFn("Aucune séance précédente pour cette variante");
        }
        return;
    }
    hapticTap(15);
    rec.lastSets.forEach((s, idx) => {
        rec.currentSets[idx] = { kg: s.kg || "", reps: s.reps || "" };
    });
    saveDatabase(true);
    if (typeof onRender === "function") onRender();
    if (typeof showToastFn === "function") showToastFn("⚡ Charges pré-remplies !");
}

export function clearCurrentExerciseSets(wIdx, origIdx, vIdx, onRender, showToastFn) {
    const rec = getRecord(wIdx, origIdx, vIdx);
    const numSets = WORKOUTS[wIdx].exercises[origIdx].numSets;
    rec.currentSets = Array.from({ length: numSets }, () => ({ kg: "", reps: "" }));
    saveDatabase(true);
    if (typeof onRender === "function") onRender();
    if (typeof showToastFn === "function") showToastFn("🗑️ Saisie du jour effacée");
}

export function isHistoryDrawerOpen(wIdx, origIdx, vIdx) {
    return Boolean(openHistoryDrawers[`${wIdx}_${origIdx}_${vIdx}`]);
}

export function toggleHistoryDrawer(wIdx, origIdx, vIdx, onRender) {
    const k = `${wIdx}_${origIdx}_${vIdx}`;
    openHistoryDrawers[k] = !openHistoryDrawers[k];
    if (typeof onRender === "function") onRender();
}

export function restoreHistoryEntry(wIdx, origIdx, vIdx, hIdx, onRender, showToastFn) {
    const rec = getRecord(wIdx, origIdx, vIdx);
    const entry = rec.history[hIdx];
    if (!entry || !Array.isArray(entry.sets)) return;
    hapticTap(15);
    entry.sets.forEach((s, idx) => {
        if (rec.currentSets[idx]) {
            rec.currentSets[idx] = { kg: s.kg || "", reps: s.reps || "" };
        }
    });
    saveDatabase(true);
    if (typeof onRender === "function") onRender();
    if (typeof showToastFn === "function") showToastFn(`⚡ Séance du ${entry.date} copiée`);
}

export function deleteHistoryEntry(wIdx, origIdx, vIdx, hIdx, onRender, showToastFn) {
    const rec = getRecord(wIdx, origIdx, vIdx);
    rec.history.splice(hIdx, 1);
    saveDatabase(true);
    if (typeof onRender === "function") onRender();
    if (typeof showToastFn === "function") showToastFn("🗑️ Historique mis à jour");
}

export function archiveWorkoutSession(wIdx, onRender, showToastFn) {
    if (wIdx < 0 || wIdx > 3) return;
    const w = WORKOUTS[wIdx];
    const todayStr = new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
    });
    let archivedCount = 0;

    w.exercises.forEach((ex, origIdx) => {
        ex.variants.forEach((_, vIdx) => {
            const rec = getRecord(wIdx, origIdx, vIdx);
            if (hasAnySetData(rec.currentSets)) {
                const snapshotSets = rec.currentSets.map((s, sIdx) => {
                    const kg = (s.kg || "").toString().trim();
                    const reps = (s.reps || "").toString().trim();
                    const prev = rec.lastSets[sIdx] || { kg: "", reps: "" };
                    if (kg !== "" || reps !== "") {
                        rec.lastSets[sIdx] = { kg, reps };
                        return { kg, reps };
                    } else {
                        return { kg: prev.kg || "", reps: prev.reps || "" };
                    }
                });

                rec.lastDate = todayStr;
                rec.history.unshift({ date: todayStr, sets: snapshotSets });
                if (rec.history.length > 15) rec.history = rec.history.slice(0, 15);
                rec.currentSets = Array.from({ length: ex.numSets }, () => ({ kg: "", reps: "" }));
                archivedCount++;
            }
        });
    });

    if (archivedCount === 0) {
        if (typeof showToastFn === "function") {
            showToastFn("⚠️ Saisissez au moins une série avant d'archiver");
        }
        return;
    }

    hapticTap(25);
    saveDatabase(true);
    if (typeof onRender === "function") onRender();
    if (typeof showToastFn === "function") {
        showToastFn(`✅ Séance ${w.shortTab} archivée (${archivedCount} exo(s)) !`);
    }
}

export function toggleScreenMode(showToastFn) {
    hapticTap(10);
    document.body.classList.toggle("screen-mode");
    const btn = document.getElementById("screenModeBtn");
    if (document.body.classList.contains("screen-mode")) {
        if (btn) btn.className = "btn-top-action active";
        if (typeof showToastFn === "function") showToastFn("📱 Mode Screen 1 écran activé");
    } else {
        if (btn) btn.className = "btn-top-action";
    }
}
