/* =========================================================================
   GÉNÉRATEUR DE FICHES STORY HD PNG 9:16 (1080×1920) & PARTAGE NATIF ANDROID
   Intégration @capacitor/filesystem & @capacitor/share + Fallback Web/PC
   ========================================================================= */

import { WORKOUTS } from "../data/program.js";
import { isCapacitorNative } from "../store/storage.js";
import { hapticTap } from "./timer.js";
import { getWorkoutOrder, getVarIdx, getRecord, formatSetsSummary } from "./workout.js";

let currentStoryIdx = 0;

export function getCurrentStoryIdx() {
    return currentStoryIdx;
}

function drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

export function createWorkoutCanvas(wIdx) {
    const idx = wIdx >= 0 && wIdx < 4 ? wIdx : 0;
    const w = WORKOUTS[idx];
    const order = getWorkoutOrder(idx);
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0b0d11";
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.fillStyle = "#ff6b00";
    ctx.fillRect(0, 0, 1080, 12);

    ctx.fillStyle = "#ff6b00";
    ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
    ctx.fillText(w.title, 40, 64);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "600 21px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
    ctx.fillText(w.subtitle, 40, 98);

    const count = order.length;
    const isCompact = count >= 7;
    const startY = 120;
    const availH = 1920 - startY - 16;
    const slotH = Math.floor(availH / count);
    const cardH = Math.min(315, slotH - 10);

    order.forEach((origIdx, posIdx) => {
        const ex = w.exercises[origIdx];
        const y = startY + posIdx * slotH;
        const vIdx = getVarIdx(idx, origIdx);
        const cur = ex.variants[vIdx];
        const rec = getRecord(idx, origIdx, vIdx);

        ctx.fillStyle = "#141820";
        ctx.strokeStyle = "#2a3140";
        ctx.lineWidth = 2;
        drawRoundRect(ctx, 36, y, 1008, cardH, 15);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ff6b00";
        drawRoundRect(ctx, 36, y, 8, cardH, 4);
        ctx.fill();

        const titleFont = isCompact ? 24 : 26;
        const metaFont = isCompact ? 19 : 20;
        const gripFont = isCompact ? 19 : 20;
        const perfFont = isCompact ? 18 : 19;
        const bioFont = isCompact ? 16 : 18;
        const bioLineH = isCompact ? 20 : 23;

        const yTitle = y + (isCompact ? 32 : 36);
        const yMeta = y + (isCompact ? 62 : 68);
        const yGrip = y + (isCompact ? 91 : 100);
        const yPerf = y + (isCompact ? 120 : 132);
        let yBio = y + (isCompact ? 148 : 164);

        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${titleFont}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
        ctx.fillText(`${posIdx + 1}. ${cur.name}`, 62, yTitle, 780);

        const vTag = vIdx === 0 ? "PRINCIPAL" : `VARIANTE V${vIdx}`;
        ctx.fillStyle = "#9ca3af";
        ctx.font = "bold 17px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
        const tagW = ctx.measureText(vTag).width;
        ctx.fillText(vTag, 1020 - tagW, yTitle - 2);

        ctx.fillStyle = "#ff6b00";
        ctx.font = `bold ${metaFont}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
        ctx.fillText(`${ex.sets}  •  ${ex.rir}  •  Repos ${ex.rest}  •  ${ex.muscle}`, 62, yMeta, 960);

        ctx.fillStyle = "#38bdf8";
        ctx.font = `bold ${gripFont}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
        ctx.fillText(`✋ Prise : ${cur.grip}`, 62, yGrip, 960);

        const curPerf = formatSetsSummary(rec.currentSets);
        const lastPerf = formatSetsSummary(rec.lastSets);
        let perfLine = "🎯 Perf : Aucune série enregistrée";
        ctx.fillStyle = "#10b981";
        if (curPerf) {
            perfLine = `🔥 Aujourd'hui : ${curPerf}`;
            ctx.fillStyle = "#10b981";
        } else if (lastPerf) {
            perfLine = `🎯 Dernière (${rec.lastDate || "Archivée"}) : ${lastPerf}`;
            ctx.fillStyle = "#fbbf24";
        }
        if (rec.note && rec.note.trim()) {
            perfLine += `  |  📝 ${rec.note.trim()}`;
        }
        ctx.font = `bold ${perfFont}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
        ctx.fillText(perfLine, 62, yPerf, 960);

        ctx.fillStyle = "#d1d5db";
        ctx.font = `${bioFont}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
        const words = ex.bio.split(" ");
        let line = "";
        const maxW = 955;
        words.forEach(word => {
            const test = line + word + " ";
            if (ctx.measureText(test).width > maxW) {
                if (yBio <= y + cardH - 10) ctx.fillText(line.trim(), 62, yBio);
                line = word + " ";
                yBio += bioLineH;
            } else {
                line = test;
            }
        });
        if (line && yBio <= y + cardH - 8) {
            ctx.fillText(line.trim(), 62, yBio);
        }
    });

    return canvas;
}

export function openStoryModal(wIdx) {
    hapticTap(10);
    currentStoryIdx = wIdx >= 0 && wIdx < 4 ? wIdx : 0;
    const modal = document.getElementById("storyModal");
    if (modal) modal.classList.remove("hidden");
    renderStoryModalContent();
}

export function closeStoryModal() {
    const modal = document.getElementById("storyModal");
    if (modal) modal.classList.add("hidden");
}

export function selectStoryTab(idx) {
    hapticTap(8);
    currentStoryIdx = idx >= 0 && idx < 4 ? idx : 0;
    renderStoryModalContent();
}

export function renderStoryModalContent() {
    const tabsEl = document.getElementById("storyTabs");
    if (tabsEl) {
        tabsEl.innerHTML = WORKOUTS.map(
            (w, i) => `
            <button data-action="select-story-tab" data-idx="${i}" class="btn-seg ${currentStoryIdx === i ? "active" : ""}" style="padding:6px; border:1px solid var(--border); background:${currentStoryIdx === i ? "var(--accent)" : "var(--surface2)"}; color:#fff; border-radius:8px;">
                ${w.icon} ${w.shortTab}
            </button>
        `
        ).join("");
    }

    const canvas = createWorkoutCanvas(currentStoryIdx);
    const previewImg = document.getElementById("storyPreviewImg");
    if (previewImg) {
        previewImg.src = canvas.toDataURL("image/png");
    }
}

async function saveAndShareCanvasCapacitor(canvas, fileName, title, text) {
    const capPlugins = window.Capacitor?.Plugins;
    if (!isCapacitorNative() || !capPlugins?.Filesystem || !capPlugins?.Share) {
        return false;
    }
    try {
        const dataUrl = canvas.toDataURL("image/png");
        const base64Data = dataUrl.split(",")[1];
        const writeRes = await capPlugins.Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: "CACHE"
        });
        await capPlugins.Share.share({
            title,
            text,
            url: writeRes.uri,
            files: [writeRes.uri],
            dialogTitle: title
        });
        return true;
    } catch (err) {
        if (err && /cancel/i.test(String(err.message || err))) {
            return true;
        }
        console.warn("Erreur Capacitor Share PNG:", err);
        return false;
    }
}

export async function shareCurrentStoryPNG(showToastFn) {
    const w = WORKOUTS[currentStoryIdx];
    const canvas = createWorkoutCanvas(currentStoryIdx);
    const fileName = `PPLU_${w.id}_basicfit.png`;

    // 1. Partage natif Capacitor Android (@capacitor/filesystem + @capacitor/share)
    const handledNatively = await saveAndShareCanvasCapacitor(
        canvas,
        fileName,
        w.title,
        `Fiche séance ${w.shortTab} Basic-Fit (1080×1920)`
    );
    if (handledNatively) {
        if (typeof showToastFn === "function") showToastFn("📤 Menu de partage Android ouvert !");
        return;
    }

    // 2. Fallback Web Share API Level 2 (navigateurs mobiles)
    canvas.toBlob(async blob => {
        if (!blob) return;
        const file = new File([blob], fileName, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: w.title,
                    text: `Fiche séance ${w.shortTab} Basic-Fit`,
                    files: [file]
                });
                if (typeof showToastFn === "function") showToastFn("📤 Menu de partage ouvert !");
                return;
            } catch (e) {
                if (e && e.name === "AbortError") return;
            }
        }
        await downloadSinglePNG(currentStoryIdx, showToastFn);
    }, "image/png");
}

export async function downloadSinglePNG(wIdx, showToastFn) {
    const targetIdx = wIdx >= 0 && wIdx < 4 ? wIdx : 0;
    const w = WORKOUTS[targetIdx];
    const canvas = createWorkoutCanvas(targetIdx);
    const fileName = `PPLU_${w.id}_basicfit.png`;

    // Sur Android WebView via Capacitor, <a download> échoue souvent : on passe par Filesystem + Share
    if (isCapacitorNative()) {
        const ok = await saveAndShareCanvasCapacitor(
            canvas,
            fileName,
            `Enregistrer ${fileName}`,
            `Fiche HD 9:16 - ${w.title}`
        );
        if (ok) {
            if (typeof showToastFn === "function") showToastFn(`📤 PNG ${w.shortTab} prêt à enregistrer !`);
            return;
        }
    }

    const link = document.createElement("a");
    link.download = fileName;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof showToastFn === "function") showToastFn(`🖼️ PNG ${w.shortTab} téléchargé !`);
}

export async function downloadAllPNGs(showToastFn) {
    const capPlugins = window.Capacitor?.Plugins;
    if (isCapacitorNative() && capPlugins?.Filesystem && capPlugins?.Share) {
        try {
            if (typeof showToastFn === "function") showToastFn("⏳ Génération des 4 fiches HD...");
            const uris = [];
            for (let i = 0; i < WORKOUTS.length; i++) {
                const w = WORKOUTS[i];
                const canvas = createWorkoutCanvas(i);
                const base64Data = canvas.toDataURL("image/png").split(",")[1];
                const res = await capPlugins.Filesystem.writeFile({
                    path: `PPLU_${w.id}_basicfit.png`,
                    data: base64Data,
                    directory: "CACHE"
                });
                uris.push(res.uri);
            }
            await capPlugins.Share.share({
                title: "Pack 4 Fiches PPLU Basic-Fit (9:16)",
                text: "4 Fiches HD 1080×1920 (Push, Pull, Legs, Upper)",
                files: uris,
                dialogTitle: "Partager / Enregistrer les 4 fiches PNG"
            });
            if (typeof showToastFn === "function") showToastFn("📤 Pack des 4 fiches prêt !");
            return;
        } catch (err) {
            if (err && /cancel/i.test(String(err.message || err))) return;
            console.warn("Fallback téléchargement 4 PNGs:", err);
        }
    }

    if (typeof showToastFn === "function") showToastFn("⬇️ Téléchargement des 4 fiches PNG...");
    WORKOUTS.forEach((_, i) => {
        setTimeout(() => downloadSinglePNG(i, showToastFn), i * 380);
    });
}
