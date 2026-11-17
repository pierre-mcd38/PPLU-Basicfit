/* =========================================================================
   LOGIQUE MÉTIER D'ENTRAÎNEMENT — SÉRIES, VALIDATION ✓ + AUTO-CHRONO,
   SURCHARGE PROGRESSIVE (DOUBLE PROGRESSION), VARIANTES & MODE SCREEN
   ========================================================================= */

import { WORKOUTS } from "../data/program.js";
import { getDB, getDefaultOrder, saveDatabase } from "../store/storage.js";
import { hapticTap, startRestTimer } from "./timer.js";

const openHistoryDrawers = {};
const openWarmupDrawers = {};

function roundGymWeight(val) {
    if (isNaN(val) || val <= 0) return 0;
    if (val < 20) return Math.max(1, Math.round(val));
    return Math.round(val / 2.5) * 2.5;
}

export function isWarmupDrawerOpen(wIdx, origIdx, vIdx) {
    return Boolean(openWarmupDrawers[`${wIdx}_${origIdx}_${vIdx}`]);
}

export function toggleWarmupDrawer(wIdx, origIdx, vIdx, onRender) {
    hapticTap(8);
    const k = `${wIdx}_${origIdx}_${vIdx}`;
    openWarmupDrawers[k] = !openWarmupDrawers[k];
    if (typeof onRender === "function") onRender();
}

/**
 * Calcule le protocole d'échauffement optimal sans fatigue :
 * - 1er exercice de la séance (ou 1er exo d'un groupe antagoniste froid) : 2 paliers courts (50% x 6-8 + 80% x 2-3)
 * - Exercices suivants (muscle et tendon déjà chauds) : 1 micro-série optionnelle de calibrage (70% x 3-4)
 */
export function getWarmupPlan(wIdx, origIdx, vIdx, posIdx) {
    const rec = getRecord(wIdx, origIdx, vIdx);
    const curKgStr = String(rec.currentSets[0]?.kg || "").replace(",", ".").trim();
    const lastKgStr = String(rec.lastSets[0]?.kg || "").replace(",", ".").trim();
    const refKg = parseFloat(curKgStr) || parseFloat(lastKgStr) || 0;

    // Groupe musculaire froid : 1er exo de la séance, ou 1er exo Ischios (Legs pos 1), ou 1er exo Dos en Upper (origIdx 1)
    const isColdMuscle =
        posIdx === 0 ||
        (wIdx === 2 && origIdx === 1) ||
        (wIdx === 3 && origIdx === 1);

    if (isColdMuscle) {
        const w50 = refKg > 0 ? `${roundGymWeight(refKg * 0.5)} kg` : "50 % charge";
        const w80 = refKg > 0 ? `${roundGymWeight(refKg * 0.8)} kg` : "80 % charge";
        return {
            isCold: true,
            title: "🔥 Protocole Chauffe à Froid (2 paliers • Zéro fatigue)",
            subtitle: refKg > 0
                ? `Calculé sur ta charge de travail de ${refKg} kg :`
                : "Saisis ta charge en S1 pour le calcul exact en kg :",
            steps: [
                {
                    badge: "Chauffe 1 (50%)",
                    load: `${w50} × 6-8 reps`,
                    desc: "Synovie articulaire & vascularisation",
                    restLabel: "⏱️ Repos 45s",
                    restSec: 45
                },
                {
                    badge: "Chauffe 2 (80%)",
                    load: `${w80} × 2-3 reps MAX`,
                    desc: "Réveil nerveux & tendineux (zéro acide lactique)",
                    restLabel: "⏱️ Repos 1m30",
                    restSec: 90
                }
            ]
        };
    }

    const w70 = refKg > 0 ? `${roundGymWeight(refKg * 0.7)} kg` : "70 % charge";
    return {
        isCold: false,
        title: "⚡ Muscle déjà chaud (Calibrage optionnel)",
        subtitle: "Tes tendons et ton système nerveux sont déjà chauds. Ne te fatigue pas :",
        steps: [
            {
                badge: "Calibrage (70%)",
                load: `${w70} × 3-4 reps`,
                desc: "Optionnel : juste pour sentir la trajectoire et valider le réglage",
                restLabel: "⏱️ Repos 1m00",
                restSec: 60
            }
        ]
    };
}

/* =========================================================================
   PROGRESSION DE LA SÉANCE EN DIRECT & DURÉE ÉCOULÉE
   ========================================================================= */
export function ensureSessionTimerStarted(wIdx) {
    const db = getDB();
    if (!db.sessionStartTimes) db.sessionStartTimes = {};
    if (!db.sessionStartTimes[wIdx]) {
        db.sessionStartTimes[wIdx] = Date.now();
    }
}

export function resetSessionTimer(wIdx, onRender, showToastFn) {
    hapticTap(10);
    const db = getDB();
    if (db.sessionStartTimes) {
        delete db.sessionStartTimes[wIdx];
    }
    saveDatabase(true);
    if (typeof onRender === "function") onRender();
    if (typeof showToastFn === "function") showToastFn("⏱️ Durée de séance réinitialisée");
}

export function getWorkoutSessionStats(wIdx) {
    if (wIdx < 0 || wIdx > 3) return null;
    const db = getDB();
    const w = WORKOUTS[wIdx];
    let doneSets = 0;
    let totalSets = 0;

    w.exercises.forEach((ex, origIdx) => {
        const vIdx = getVarIdx(wIdx, origIdx);
        const rec = getRecord(wIdx, origIdx, vIdx);
        totalSets += ex.numSets;
        for (let i = 0; i < ex.numSets; i++) {
            const s = rec.currentSets[i];
            if (!s) continue;
            const hasBoth = String(s.kg || "").trim() !== "" && String(s.reps || "").trim() !== "";
            if (s.done || hasBoth) {
                doneSets++;
            }
        }
    });

    const pct = totalSets > 0 ? Math.min(100, Math.round((doneSets / totalSets) * 100)) : 0;
    const startTs = db.sessionStartTimes?.[wIdx] || null;
    let elapsedMin = null;
    if (startTs && doneSets > 0) {
        elapsedMin = Math.max(1, Math.floor((Date.now() - startTs) / 60000));
    } else if (doneSets === 0 && db.sessionStartTimes?.[wIdx]) {
        delete db.sessionStartTimes[wIdx];
    }

    return { doneSets, totalSets, pct, elapsedMin };
}

export function updateWorkoutProgressDOM(wIdx) {
    const stats = getWorkoutSessionStats(wIdx);
    if (!stats) return;
    const lblEl = document.getElementById("session-progress-lbl");
    const barEl = document.getElementById("session-progress-fill");
    const durEl = document.getElementById("session-duration-pill");
    if (lblEl) {
        lblEl.textContent = `📊 ${stats.doneSets} / ${stats.totalSets} séries (${stats.pct} %)`;
    }
    if (barEl) {
        barEl.style.width = `${stats.pct}%`;
    }
    if (durEl) {
        if (stats.elapsedMin !== null) {
            durEl.style.display = "inline-flex";
            const txt = durEl.querySelector(".dur-txt");
            if (txt) txt.textContent = `⏱️ ${stats.elapsedMin} min`;
        } else {
            durEl.style.display = "none";
        }
    }
}

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
            currentSets: Array.from({ length: numSets }, () => ({ kg: "", reps: "", done: false })),
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

    while (rec.currentSets.length < numSets) rec.currentSets.push({ kg: "", reps: "", done: false });
    while (rec.lastSets.length < numSets) rec.lastSets.push({ kg: "", reps: "" });

    // Normalise à numSets (3 séries effectives)
    if (rec.currentSets.length > numSets) rec.currentSets = rec.currentSets.slice(0, numSets);
    if (rec.lastSets.length > numSets) rec.lastSets = rec.lastSets.slice(0, numSets);

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
        s => (s.kg && s.kg.toString().trim() !== "") || (s.reps && s.reps.toString().trim() !== "") || s.done
    );
}

/**
 * Analyse la dernière séance par rapport à la fourchette cible (Double Progression)
 */
export function getProgressionAdvice(wIdx, origIdx, vIdx) {
    const ex = WORKOUTS[wIdx].exercises[origIdx];
    const rec = getRecord(wIdx, origIdx, vIdx);
    const activeLastSets = rec.lastSets.slice(0, ex.numSets);
    if (!hasAnySetData(activeLastSets)) return null;

    const repMin = ex.repMin || 8;
    const repMax = ex.repMax || 10;

    const validSets = activeLastSets.filter(s => {
        const r = parseInt(String(s.reps || "").trim(), 10);
        return !isNaN(r) && r > 0;
    });

    if (validSets.length === 0) return null;

    const allHitMax =
        validSets.length >= ex.numSets &&
        validSets.every(s => parseInt(String(s.reps).trim(), 10) >= repMax);

    const firstKgRaw = String(activeLastSets[0]?.kg || "").replace(",", ".").trim();
    const firstKg = parseFloat(firstKgRaw);

    if (allHitMax) {
        const nextKgStr = !isNaN(firstKg) && firstKg > 0 ? `${firstKg + 2.5} kg` : "+2.5 kg";
        return {
            type: "up_weight",
            text: `🚀 Objectif : Monte à ${nextKgStr} (vise ${repMin} reps)`
        };
    }

    return {
        type: "up_reps",
        text: `🎯 Objectif : Garde la charge & vise +1 rep (cible ${repMax})`
    };
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
    const ex = WORKOUTS[wIdx].exercises[origIdx];
    const rec = getRecord(wIdx, origIdx, vIdx);
    rec.currentSets[sIdx][field] = value;

    if (String(value || "").trim() !== "") {
        ensureSessionTimerStarted(wIdx);
    }

    // Si l'utilisateur modifie les KG de S1, on met à jour le placeholder des séries suivantes si elles sont vides
    if (field === "kg" && sIdx === 0) {
        const cleanVal = value.trim();
        for (let i = 1; i < ex.numSets; i++) {
            const nextInp = document.getElementById(`inp-kg-${wIdx}-${origIdx}-${i}`);
            if (nextInp && !rec.currentSets[i].kg) {
                const fallbackPh = rec.lastSets[i]?.kg || "kg";
                nextInp.placeholder = cleanVal || fallbackPh;
            }
        }
    }

    saveDatabase(true);
    updateWorkoutProgressDOM(wIdx);

    const scEl = document.getElementById(`sc-summary-${wIdx}-${origIdx}`);
    if (scEl) {
        scEl.textContent = getScreenModePerfString(wIdx, origIdx, vIdx);
    }
}

/**
 * Valide une série (bouton ✓) :
 * - Remplit automatiquement KG/REPS si les champs sont vides (depuis la série précédente ou la dernière séance)
 * - Marque visuellement la boîte en vert
 * - Lance automatiquement le chronomètre de repos de l'exercice
 */
export function toggleSetDone(wIdx, origIdx, vIdx, sIdx, onRender, showToastFn) {
    const ex = WORKOUTS[wIdx].exercises[origIdx];
    const rec = getRecord(wIdx, origIdx, vIdx);
    const curSet = rec.currentSets[sIdx];
    if (!curSet) return;

    if (!curSet.done) {
        curSet.done = true;
        ensureSessionTimerStarted(wIdx);

        // Auto-complétion intelligente si le champ KG est vide
        if (!String(curSet.kg || "").trim()) {
            const prevSetKg = sIdx > 0 ? String(rec.currentSets[sIdx - 1]?.kg || "").trim() : "";
            const lastSetKg = String(rec.lastSets[sIdx]?.kg || rec.lastSets[0]?.kg || "").trim();
            if (prevSetKg) {
                curSet.kg = prevSetKg;
            } else if (lastSetKg) {
                curSet.kg = lastSetKg;
            }
        }

        // Auto-complétion intelligente si le champ REPS est vide
        if (!String(curSet.reps || "").trim()) {
            const lastSetReps = String(rec.lastSets[sIdx]?.reps || "").trim();
            const prevSetReps = sIdx > 0 ? String(rec.currentSets[sIdx - 1]?.reps || "").trim() : "";
            if (lastSetReps) {
                curSet.reps = lastSetReps;
            } else if (prevSetReps) {
                curSet.reps = prevSetReps;
            } else if (ex.repMin) {
                curSet.reps = String(ex.repMin);
            }
        }

        saveDatabase(true);
        if (typeof onRender === "function") onRender();

        // Lancement automatique du chronomètre de repos de l'exercice
        startRestTimer(ex.restSec);
        if (typeof showToastFn === "function") {
            showToastFn(`✅ Série S${sIdx + 1} validée • Repos ${ex.rest} lancé !`);
        }
    } else {
        hapticTap(8);
        curSet.done = false;
        saveDatabase(true);
        if (typeof onRender === "function") onRender();
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
    const ex = WORKOUTS[wIdx].exercises[origIdx];
    const rec = getRecord(wIdx, origIdx, vIdx);
    if (!hasAnySetData(rec.lastSets)) {
        if (typeof showToastFn === "function") {
            showToastFn("Aucune séance précédente pour cette variante");
        }
        return;
    }
    hapticTap(15);
    for (let idx = 0; idx < ex.numSets; idx++) {
        const s = rec.lastSets[idx] || { kg: "", reps: "" };
        rec.currentSets[idx] = {
            kg: s.kg || "",
            reps: s.reps || "",
            done: rec.currentSets[idx]?.done || false
        };
    }
    saveDatabase(true);
    if (typeof onRender === "function") onRender();
    if (typeof showToastFn === "function") showToastFn("⚡ Charges pré-remplies !");
}

export function clearCurrentExerciseSets(wIdx, origIdx, vIdx, onRender, showToastFn) {
    const rec = getRecord(wIdx, origIdx, vIdx);
    const numSets = WORKOUTS[wIdx].exercises[origIdx].numSets;
    rec.currentSets = Array.from({ length: numSets }, () => ({ kg: "", reps: "", done: false }));
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
            rec.currentSets[idx] = {
                kg: s.kg || "",
                reps: s.reps || "",
                done: false
            };
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
            const activeCurrent = rec.currentSets.slice(0, ex.numSets);
            const hasFilledSet = activeCurrent.some(
                s => (s.kg && String(s.kg).trim() !== "") || (s.reps && String(s.reps).trim() !== "")
            );

            if (hasFilledSet) {
                const snapshotSets = [];
                activeCurrent.forEach((s, sIdx) => {
                    const kg = (s.kg || "").toString().trim();
                    const reps = (s.reps || "").toString().trim();
                    if (kg !== "" || reps !== "") {
                        rec.lastSets[sIdx] = { kg, reps };
                        snapshotSets.push({ kg, reps });
                    }
                });

                rec.lastDate = todayStr;
                rec.history.unshift({ date: todayStr, sets: snapshotSets });
                if (rec.history.length > 15) rec.history = rec.history.slice(0, 15);
                rec.currentSets = Array.from({ length: ex.numSets }, () => ({
                    kg: "",
                    reps: "",
                    done: false
                }));
                archivedCount++;
            }
        });
    });

    if (archivedCount === 0) {
        if (typeof showToastFn === "function") {
            showToastFn("⚠️ Saisissez ou validez au moins une série avant d'archiver");
        }
        return;
    }

    const db = getDB();
    if (db.sessionStartTimes) {
        delete db.sessionStartTimes[wIdx];
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
