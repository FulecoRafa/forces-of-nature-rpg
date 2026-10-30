import { pointer, trackPointer } from './pointer';

type Mouse = { x: number; y: number } | null;
type Step = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, mouse: Mouse) => void;

const rnd0 = (s: number) => {
  const x = Math.sin(s * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Lente gravitacional: grade deformada, estrelas desviadas, anel de fótons. Segue o cursor. */
function penrose(): Step {
  const stars = Array.from({ length: 180 }, (_, i) => ({
    x: rnd0(i),
    y: rnd0(i + 500),
    a: 0.25 + rnd0(i + 900) * 0.6,
    p: rnd0(i + 1300) * 6.28,
  }));
  const m = { x: NaN, y: NaN };
  return (ctx, w, h, t, mouse) => {
    const tx = mouse ? mouse.x : w * 0.5;
    const ty = mouse ? mouse.y : h * 0.55;
    if (Number.isNaN(m.x)) {
      m.x = tx;
      m.y = ty;
    }
    m.x += (tx - m.x) * 0.05;
    m.y += (ty - m.y) * 0.05;
    const M = Math.min(w, h) * 0.22 * (1 + 0.05 * Math.sin(t * 0.0011));
    const warp = (x: number, y: number) => {
      const dx = x - m.x;
      const dy = y - m.y;
      const r = Math.hypot(dx, dy) + 0.001;
      const k = (0.6 * M) / (r + M);
      return [m.x + dx * (1 - k), m.y + dy * (1 - k)];
    };
    ctx.clearRect(0, 0, w, h);

    const drift = (t * 0.006) % 46;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(110,100,170,0.32)';
    ctx.beginPath();
    for (let gy = -46 + drift; gy < h + 46; gy += 46) {
      for (let x = -20; x <= w + 20; x += 14) {
        const [px, py] = warp(x, gy);
        x === -20 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
    }
    for (let gx = -46 + drift; gx < w + 46; gx += 46) {
      for (let y = -20; y <= h + 20; y += 14) {
        const [px, py] = warp(gx, y);
        y === -20 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Esquenta a grade perto da massa
    ctx.globalCompositeOperation = 'source-atop';
    const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, M * 2.2);
    g.addColorStop(0, 'rgba(255,150,80,1)');
    g.addColorStop(0.35, 'rgba(224,86,58,0.9)');
    g.addColorStop(1, 'rgba(224,86,58,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';

    const Re = M * 0.42;
    for (const s of stars) {
      const sx = s.x * w;
      const sy = s.y * h;
      const dx = sx - m.x;
      const dy = sy - m.y;
      const r = Math.hypot(dx, dy) + 0.001;
      if (r < Re * 0.7) continue;
      const rr = r + (Re * Re) / r;
      const px = m.x + (dx / r) * rr;
      const py = m.y + (dy / r) * rr;
      const size = r < Re * 2 ? 2 : 1.2;
      ctx.fillStyle = `rgba(240,230,240,${(s.a * (0.6 + 0.4 * Math.sin(t * 0.002 + s.p))).toFixed(2)})`;
      ctx.fillRect(px, py, size, size);
    }

    ctx.save();
    ctx.shadowColor = 'rgba(255,140,70,0.9)';
    ctx.shadowBlur = 24;
    ctx.strokeStyle = 'rgba(255,170,100,0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(m.x, m.y, Re * 0.55, 0, 6.283);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(m.x, m.y, Re * 0.5, 0, 6.283);
    ctx.fill();
  };
}

/** Fios de alma pendurados do topo; o cursor agarra e solta, e eles vibram como cordas. */
function threads(dark: boolean): Step {
  type Thread = { x0: number; L: number; K: number; u: Float32Array; v: Float32Array; g: number };
  let list: Thread[] = [];
  let lw = 0;
  const col = dark ? '232,228,245' : '140,146,160';
  const init = (w: number, h: number) => {
    lw = w;
    const n = Math.max(6, Math.round(w / 64));
    list = Array.from({ length: n }, (_, i) => {
      const K = 40;
      return {
        x0: ((i + 0.5) * w) / n + (rnd0(i + 40) - 0.5) * 30,
        L: h * (0.4 + rnd0(i + 80) * 0.58),
        K,
        u: new Float32Array(K + 1),
        v: new Float32Array(K + 1),
        g: -1,
      };
    });
  };
  return (ctx, w, h, _t, mouse) => {
    if (Math.abs(w - lw) > 2 || !list.length) init(w, h);
    ctx.clearRect(0, 0, w, h);
    for (const th of list) {
      const { K, L, u, v } = th;
      if (mouse && mouse.y > 0 && mouse.y < L) {
        const idx = Math.min(K - 1, Math.max(1, Math.round((mouse.y / L) * K)));
        const disp = mouse.x - th.x0;
        if (th.g < 0 && Math.abs(disp - u[idx]) < 9) th.g = idx;
        if (th.g >= 0) {
          th.g = idx;
          if (Math.abs(disp) > 64) th.g = -1;
          else {
            u[idx] = disp;
            v[idx] = 0;
          }
        }
      } else th.g = -1;
      for (let s = 0; s < 3; s++) {
        for (let i = 1; i < K; i++) {
          if (i === th.g) continue;
          v[i] += 0.32 * (u[i - 1] + u[i + 1] - 2 * u[i]);
          v[i] *= 0.996;
        }
        for (let i = 1; i < K; i++) if (i !== th.g) u[i] += v[i];
        u[0] = 0;
        u[K] = 0;
      }
      let e = 0;
      for (let i = 1; i < K; i++) e += Math.abs(v[i]) + Math.abs(u[i]) * 0.02;
      const gr = ctx.createLinearGradient(0, 0, 0, L);
      gr.addColorStop(0, `rgba(${col},${dark ? 0.75 : 0.9})`);
      gr.addColorStop(0.65, `rgba(${col},0.35)`);
      gr.addColorStop(1, `rgba(${col},0)`);
      ctx.save();
      ctx.strokeStyle = gr;
      ctx.lineWidth = 1 + Math.min(0.8, e * 0.03);
      if (dark || e > 0.5) {
        ctx.shadowColor = dark ? 'rgba(232,228,245,0.9)' : 'rgba(200,150,210,0.8)';
        ctx.shadowBlur = (dark ? 8 : 0) + Math.min(14, e * 0.6);
      }
      ctx.beginPath();
      for (let i = 0; i <= K; i++) {
        const x = th.x0 + u[i];
        const y = (i * L) / K;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  };
}

const FACTORIES: Record<string, () => Step> = {
  penrose,
  threads: () => threads(false),
  'threads-dark': () => threads(true),
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** <fon-field kind="penrose|threads|threads-dark">: canvas animado que só roda quando visível. */
class FonField extends HTMLElement {
  #canvas = document.createElement('canvas');
  #ctx = this.#canvas.getContext('2d')!;
  #step: Step | null = null;
  #w = 0;
  #h = 0;
  #raf = 0;
  #visible = false;
  #ro?: ResizeObserver;
  #io?: IntersectionObserver;

  connectedCallback() {
    trackPointer();
    this.#step = (FACTORIES[this.getAttribute('kind') ?? ''] ?? penrose)();
    this.#canvas.setAttribute('aria-hidden', 'true');
    this.appendChild(this.#canvas);
    this.#ro = new ResizeObserver(() => this.#fit());
    this.#ro.observe(this);
    this.#io = new IntersectionObserver(([e]) => {
      this.#visible = e.isIntersecting;
      cancelAnimationFrame(this.#raf);
      if (this.#visible) this.#raf = requestAnimationFrame(this.#loop);
    });
    this.#io.observe(this);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.#raf);
    this.#ro?.disconnect();
    this.#io?.disconnect();
  }

  #fit() {
    const r = this.getBoundingClientRect();
    const d = Math.min(2, window.devicePixelRatio || 1);
    this.#w = r.width;
    this.#h = r.height;
    this.#canvas.width = Math.round(r.width * d);
    this.#canvas.height = Math.round(r.height * d);
    this.#ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  #loop = (now: number) => {
    if (!this.#visible || !this.#step) return;
    const r = this.getBoundingClientRect();
    const inside =
      pointer.active && pointer.x >= r.left && pointer.x <= r.right && pointer.y >= r.top && pointer.y <= r.bottom;
    const mouse = inside ? { x: pointer.x - r.left, y: pointer.y - r.top } : null;
    // Com movimento reduzido o tempo fica parado: só o cursor mexe na cena.
    const t = reducedMotion.matches ? 0 : now;
    if (this.#w > 0) this.#step(this.#ctx, this.#w, this.#h, t, mouse);
    this.#raf = requestAnimationFrame(this.#loop);
  };
}

if (!customElements.get('fon-field')) customElements.define('fon-field', FonField);
