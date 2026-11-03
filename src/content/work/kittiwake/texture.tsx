import { useEffect, useRef, useState } from 'react';
import { Picture } from '~/components/picture';
import { cn } from '~/lib/utils';
import { images } from './images';
import { palette } from './theme';

/*
 * Kittiwake's photo treatment, come alive: an overhead sea in deep, sea and
 * foam, with film grain. One fragment shader, one draw call, no libraries.
 *
 * Live, it renders at reduced resolution and pauses off screen, in background
 * tabs, and with reduced motion (one frame, then stop). With `time` it draws
 * that single moment at full resolution, which is how stills and the fallback
 * image `seaStill` are made. Without WebGL it shows that still image.
 */

/** The moment the live sea starts from, and the one `seaStill` captures. */
export const SEA_STILL_TIME = 36;

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform float uGrain;
uniform float uDensity;
uniform vec3 uDeep;
uniform vec3 uSea;
uniform vec3 uFoam;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

const mat2 ROT = mat2(0.8, 0.6, -0.6, 0.8);

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = ROT * p * 2.02 + vec2(17.1, 3.7);
    a *= 0.5;
  }
  return v;
}

float fbm3(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = ROT * p * 2.03 + vec2(9.1, 1.7);
    a *= 0.5;
  }
  return v;
}

// One octave of choppy wavelets: sines bent by noise, sharpened at crests.
float waves(vec2 uv, float choppy) {
  uv += noise(uv);
  vec2 wv = 1.0 - abs(sin(uv));
  vec2 swv = abs(cos(uv));
  wv = mix(wv, swv, wv);
  return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
}

const mat2 OCT = mat2(1.6, 1.2, -1.2, 1.6);

float height(vec2 p, float t) {
  float freq = 1.0;
  float amp = 1.0;
  float choppy = 3.6;
  float h = 0.0;
  for (int i = 0; i < 4; i++) {
    float d = waves((p + t) * freq, choppy) + waves((p - t) * freq, choppy);
    h += d * amp;
    p = OCT * p;
    freq *= 1.9;
    amp *= 0.24;
    choppy = mix(choppy, 1.0, 0.2);
  }
  return h;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5 * uRes) / uRes.x;
  float t = uTime;

  // Wind from the north-west: work in a frame turned to it, so crests and
  // foam lines run across the wind and streaks run along it.
  vec2 a = vec2(dot(uv, vec2(0.80, 0.60)), dot(uv, vec2(-0.60, 0.80))) * uDensity;

  // The swell: domain-warped fbm, slow, for broad light and dark.
  vec2 drift = vec2(0.012, 0.004) * t;
  vec2 b = a * 2.4 + vec2(3.0, 1.0);
  vec2 q = vec2(fbm3(b + drift), fbm3(b + vec2(5.2, 1.3) - drift));
  vec2 r = vec2(
    fbm(b + 3.2 * q + vec2(1.7, 9.2) + 0.018 * t),
    fbm(b + 3.2 * q + vec2(8.3, 2.8) - 0.014 * t)
  );
  float h = fbm(b + 2.4 * r);
  float swell = sin(a.x * 13.0 - t * 0.38 + 7.0 * (q.y - 0.5));

  // Wavelets: fine choppy texture, stretched along the crests.
  vec2 p = vec2(a.x * 36.0, a.y * 21.0) + (q - 0.5) * 4.0 + (r - 0.5) * 3.0;
  float wt = t * 0.11;
  float e = 0.05;
  float h0 = height(p, wt);
  float hx = height(p + vec2(e, 0.0), wt);
  float hy = height(p + vec2(0.0, e), wt);
  vec3 n = normalize(vec3((h0 - hx) / e, (h0 - hy) / e, 4.6));

  // Low sun to the north-east: glints gather in its reflection.
  vec3 L = normalize(vec3(0.42, 0.5, 0.75));
  vec3 V = normalize(vec3(-uv * 1.1, 1.0));
  vec3 R = reflect(-V, n);
  float spec = pow(max(dot(R, L), 0.0), 140.0);
  float sun = smoothstep(0.85, 0.05, length(uv - vec2(0.26, 0.2)));
  float shade = dot(n, L) - 0.7;

  // Foam: lacy filaments where the warp bunches up, brightest on crests,
  // and thin streaks dragged out along the wind.
  float ridge = 1.0 - abs(2.0 * fbm(b * 1.6 + 2.6 * r + vec2(0.0, 0.008 * t)) - 1.0);
  float crest = smoothstep(0.2, 1.0, swell);
  float lace = pow(ridge, 9.0) * smoothstep(0.48, 0.72, r.x + 0.18 * crest);
  float streak = smoothstep(0.66, 0.82, fbm3(vec2(a.x * 34.0, a.y * 3.2) + r * 4.0 - vec2(0.0, 0.03 * t)));
  streak *= smoothstep(0.5, 0.75, r.x) * 0.5;

  float v = 0.245 + 0.85 * (h - 0.5) + 0.06 * swell + 0.2 * (q.x - 0.5);
  v += 0.3 * shade;
  v += (0.08 + 1.1 * sun) * spec * (0.5 + 0.5 * crest);
  v += 0.62 * lace * (0.7 + 0.3 * crest) + 0.22 * streak;
  v *= 1.0 - 0.2 * dot(uv * vec2(1.0, 1.25), uv * vec2(1.0, 1.25));

  // Film grain, about one CSS pixel per grain, new each frame.
  vec2 cell = floor(frag / uGrain);
  float grain = hash(cell + fract(t * 7.31) * 113.0) + hash(cell * 1.7 - fract(t * 3.17) * 71.0) - 1.0;
  v += grain * 0.085;

  vec3 col = mix(uDeep, uSea, smoothstep(0.0, 0.48, v));
  col = mix(col, uFoam, smoothstep(0.46, 1.05, v));
  gl_FragColor = vec4(col, 1.0);
}
`;

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as const;
};

type Renderer = {
  gl: WebGLRenderingContext;
  draw: (width: number, height: number, time: number, grain: number, density: number) => void;
  dispose: () => void;
};

function createRenderer(canvas: HTMLCanvasElement): Renderer | null {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power'
  });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      console.warn('Kittiwake sea shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One triangle that covers the whole viewport.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const loc = (name: string) => gl.getUniformLocation(program, name);
  const uRes = loc('uRes');
  const uTime = loc('uTime');
  const uGrain = loc('uGrain');
  const uDensity = loc('uDensity');
  gl.uniform3fv(loc('uDeep'), rgb(palette.deep));
  gl.uniform3fv(loc('uSea'), rgb(palette.sea));
  gl.uniform3fv(loc('uFoam'), rgb(palette.foam));

  return {
    gl,
    draw(width, height, time, grain, density) {
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uTime, time % 2000);
      gl.uniform1f(uGrain, grain);
      gl.uniform1f(uDensity, density);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    }
  };
}

// Frozen frames (stills, posters) share one hidden context and are copied
// into plain 2D canvases, so a page of stills never runs out of contexts.
let shared: { canvas: HTMLCanvasElement; renderer: Renderer } | null | undefined;
function sharedRenderer() {
  if (shared === undefined) {
    const canvas = document.createElement('canvas');
    const renderer = createRenderer(canvas);
    shared = renderer ? { canvas, renderer } : null;
    canvas.addEventListener('webglcontextlost', () => {
      shared = undefined;
    });
  }
  if (shared && shared.renderer.gl.isContextLost()) shared = undefined;
  return shared ?? null;
}

const canvasStyle =
  'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 600ms ease';

export type SeaTextureProps = {
  className?: string;
  /** Freeze at this moment, in seconds, at full resolution. */
  time?: number;
  /** Swell size: above 1 shows more, smaller waves. */
  density?: number;
  /** Fraction of CSS size × device pixel ratio to render live. */
  resolution?: number;
  /** Where the live sea starts, in seconds. */
  start?: number;
};

export default function SeaTexture({
  className,
  time,
  density = 1,
  resolution = 0.6,
  start = SEA_STILL_TIME
}: SeaTextureProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frozen = time !== undefined;
    const still = frozen || reduced;
    const at = time ?? start;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      return { w: Math.max(1, rect.width), h: Math.max(1, rect.height) };
    };

    if (frozen) {
      // A single full-resolution frame, copied out of the shared context.
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = canvasStyle;
      const ctx = canvas.getContext('2d');
      if (!ctx || !sharedRenderer()) {
        setFailed(true);
        return;
      }
      wrap.appendChild(canvas);
      let lastKey = '';
      const paint = () => {
        const s = sharedRenderer();
        if (!s) return setFailed(true);
        const { w, h } = measure();
        const scale = Math.min(dpr, 4096 / w, 4096 / h);
        const pw = Math.round(w * scale);
        const ph = Math.round(h * scale);
        const key = `${pw}x${ph}`;
        if (key === lastKey) return;
        lastKey = key;
        s.renderer.draw(pw, ph, at, Math.max(1, scale), density);
        canvas.width = pw;
        canvas.height = ph;
        ctx.drawImage(s.canvas, 0, 0);
        canvas.style.opacity = '1';
      };
      paint();
      let timer: ReturnType<typeof setTimeout> | undefined;
      const resize = new ResizeObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(paint, 120);
      });
      resize.observe(wrap);
      return () => {
        clearTimeout(timer);
        resize.disconnect();
        canvas.remove();
      };
    }

    // Live: a context of its own, at reduced resolution.
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = canvasStyle;
    let renderer = createRenderer(canvas);
    if (!renderer) {
      setFailed(true);
      return;
    }
    wrap.appendChild(canvas);

    let raf = 0;
    let onScreen = true;
    let pageVisible = !document.hidden;
    let lost = false;
    let elapsed = 0;
    let last = 0;
    let size = { pw: 0, ph: 0, grain: 1 };

    const fit = () => {
      const { w, h } = measure();
      let scale = dpr * resolution;
      // Cap the work: about 1,100 px wide or 0.8 megapixels.
      scale = Math.min(scale, 1100 / w, Math.sqrt(800_000 / (w * h)));
      size = { pw: Math.max(1, Math.round(w * scale)), ph: Math.max(1, Math.round(h * scale)), grain: Math.max(1, scale) };
    };

    const draw = () => {
      if (!renderer || lost) return;
      renderer.draw(size.pw, size.ph, at + elapsed, size.grain, density);
      canvas.style.opacity = '1';
    };

    const frame = (now: number) => {
      raf = 0;
      if (last) elapsed += Math.min(0.05, (now - last) / 1000);
      last = now;
      draw();
      schedule();
    };

    const schedule = () => {
      if (still || lost || !onScreen || !pageVisible || raf) return;
      raf = requestAnimationFrame(frame);
    };

    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };

    fit();
    draw();
    schedule();

    const resize = new ResizeObserver(() => {
      fit();
      // Redraw now so the canvas never shows stretched between frames.
      draw();
    });
    resize.observe(wrap);

    const intersect = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) schedule();
      else pause();
    });
    intersect.observe(wrap);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) schedule();
      else pause();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      pause();
    };
    const onRestored = () => {
      renderer = createRenderer(canvas);
      if (!renderer) {
        setFailed(true);
        return;
      }
      lost = false;
      draw();
      schedule();
    };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    return () => {
      pause();
      resize.disconnect();
      intersect.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      renderer?.dispose();
      // This canvas is never reused, so give its context back right away.
      renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, [time, density, resolution, start]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={cn('relative h-full w-full overflow-hidden', className)}
      style={{ background: palette.sea }}
    >
      {failed ? (
        <Picture
          image={images.seaStill}
          alt=''
          sizes='(min-width: 768px) 50vw, 100vw'
          className='absolute inset-0 h-full w-full object-cover'
        />
      ) : null}
    </div>
  );
}
