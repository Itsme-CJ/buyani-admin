// Common screen resolutions — screenshots almost always match one of these
const SCREEN_RES = new Set([
  '1920x1080','1366x768','2560x1440','1280x720','3840x2160',
  '1440x900','1280x800','1024x768','1600x900','1920x1200',
  '2560x1600','1680x1050','1280x1024','2048x1152','3440x1440',
  '1080x1920','1080x2400','1080x2340','750x1334','828x1792',
  '1170x2532','1284x2778','1125x2436','1080x2160','720x1280',
  '1440x3040','1080x2316',
]);

const isScreenSize = (w, h) =>
  SCREEN_RES.has(`${w}x${h}`) || SCREEN_RES.has(`${h}x${w}`);

// Parse JPEG binary to detect EXIF / camera metadata
const readExif = async (url) => {
  try {
    const res = await fetch(url, { mode: 'cors' });
    const buf = await res.arrayBuffer();
    const view = new DataView(buf);
    if (view.byteLength < 4 || view.getUint16(0) !== 0xFFD8) return { hasExif: false };

    let offset = 2;
    while (offset < view.byteLength - 4) {
      const marker = view.getUint16(offset);
      if (marker === 0xFFE1) {
        if (offset + 10 < view.byteLength) {
          const header = String.fromCharCode(
            view.getUint8(offset + 4), view.getUint8(offset + 5),
            view.getUint8(offset + 6), view.getUint8(offset + 7),
          );
          if (header.startsWith('Exif')) return { hasExif: true };
        }
        const len = view.getUint16(offset + 2);
        offset += 2 + len;
      } else if ((marker & 0xFF00) === 0xFF00 && marker !== 0xFFFF) {
        if (offset + 3 >= view.byteLength) break;
        const len = view.getUint16(offset + 2);
        offset += 2 + len;
      } else break;
    }
    return { hasExif: false };
  } catch {
    return { hasExif: false };
  }
};

// Laplacian variance — measures image sharpness
const measureSharpness = (imgSrc) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const maxPx = 300;
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const w = Math.max(1, Math.floor(img.width * scale));
        const h = Math.max(1, Math.floor(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        const gray = new Float32Array(w * h);
        for (let i = 0; i < w * h; i++)
          gray[i] = 0.299 * data[i*4] + 0.587 * data[i*4+1] + 0.114 * data[i*4+2];

        let sum = 0, sum2 = 0, n = 0;
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const v = 4*gray[y*w+x] - gray[(y-1)*w+x] - gray[(y+1)*w+x]
                    - gray[y*w+(x-1)] - gray[y*w+(x+1)];
            sum += v; sum2 += v * v; n++;
          }
        }
        const mean = sum / n;
        resolve({ variance: sum2 / n - mean * mean, width: img.width, height: img.height });
      } catch {
        resolve({ variance: 0, width: img.naturalWidth, height: img.naturalHeight });
      }
    };
    img.onerror = () => resolve({ variance: 0, width: 0, height: 0 });
    img.src = imgSrc;
  });

export const analyzeIdImage = async (imageUrl) => {
  const [exif, sharpness] = await Promise.all([
    readExif(imageUrl),
    measureSharpness(imageUrl),
  ]);

  const { hasExif } = exif;
  const { variance, width, height } = sharpness;
  const flags = [];
  let score = 50;

  // ── Screenshot check ──────────────────────────────────────
  if (width > 0 && isScreenSize(width, height)) {
    score -= 30;
    flags.push({ ok: false, text: 'Dimensions match a screen resolution — possible screenshot' });
  }

  // ── EXIF / camera metadata ────────────────────────────────
  if (hasExif) {
    score += 30;
    flags.push({ ok: true, text: 'Camera metadata present — photo taken with a real device' });
  } else {
    score -= 15;
    flags.push({ ok: false, text: 'No camera metadata — may be a screenshot or digitally altered file' });
  }

  // ── Sharpness ─────────────────────────────────────────────
  if (variance > 400) {
    score += 15;
    flags.push({ ok: true, text: 'Image is sharp and in focus' });
  } else if (variance < 80 && variance > 0) {
    score -= 20;
    flags.push({ ok: false, text: 'Image is blurry — possible photocopy or low-quality print scan' });
  }

  // ── Aspect ratio (CR80 standard ID = 1.586:1) ─────────────
  if (width > 0 && height > 0) {
    const ratio = width / height;
    if (Math.abs(ratio - 1.586) < 0.25 || Math.abs(1 / ratio - 1.586) < 0.25) {
      score += 15;
      flags.push({ ok: true, text: 'Aspect ratio matches standard government ID card format' });
    } else {
      flags.push({ ok: false, text: 'Aspect ratio does not match a standard ID card' });
    }
  }

  // ── Classification ────────────────────────────────────────
  let label, color, bg;
  if (score >= 70) {
    label = 'Likely Real Document';   color = '#2d6a4f'; bg = '#d8f3dc';
  } else if (score >= 45) {
    label = 'Needs Manual Review';    color = '#e07b00'; bg = '#fff3e0';
  } else {
    label = 'Suspicious — Possible Fake'; color = '#c62828'; bg = '#ffebee';
  }

  return { label, color, bg, flags, score };
};
