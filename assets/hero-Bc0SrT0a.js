import{O as e,_ as t,a as n,b as r,c as i,f as a,g as o,h as s,i as c,m as l,o as u,p as d,s as f,v as p,x as ee,y as m}from"./index-Zu58GN_a.js";import{D as h,Dn as g,En as _,F as v,Ft as y,Gt as b,It as x,N as S,T as C,Tn as w,Ut as T,Z as E,dt as D,hn as O,i as te,kn as k,mn as A,n as j,r as M,rn as ne,tn as N,un as P,ut as F,xn as I,xt as L}from"./CausticRenderer-CHFeRBTK.js";import{FrameSequence as R}from"./engine-DDHZVTKG.js";import{n as z}from"./brandPane-D8lvL3A_.js";import"./optics-CiCYT5mR.js";var B=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4( position.xy, 0.0, 1.0 );
}
`,V={haze:1,masks:2,light:3},re=`
#include <common>
#include <readable_pars_fragment>

#define HAZE_STEPS 8

uniform sampler2D uA;
uniform sampler2D uB;
uniform float uT;
uniform float uHasPlate;
uniform float uAlpha;
uniform int uDebug;

uniform vec4 uCover;        // stage (y down) -> frame (y down): xy scale, zw offset
uniform vec2 uShift;        // parallax, frame units
uniform vec3 uToFinal;      // this frame's wall -> final frame: scale, tx, ty
uniform mat3 uNameInv;      // frame -> name uv (u right, v up): the patch the live light fills
uniform mat3 uPaneInv;      // frame -> pane uv (u right, v up)
uniform vec2 uPaneQ[ 4 ];   // pane corners bl, br, tr, tl (frame)
uniform vec2 uNameQ[ 4 ];   // name corners bl, br, tr, tl (frame)
uniform vec2 uDepths;       // camera to pane, camera to wall (m): perspective along the beam
uniform vec4 uHazeBox;      // frame-space bounds of the beam (x0, y0, x1, y1)
uniform int uHazeSteps;

uniform sampler2D uLit;     // lit-mask.png (final frame)
uniform sampler2D uOcc;     // occluder-mask.png (final frame)

uniform sampler2D uLight;   // live caustic light over the view rect, / uLightScale
uniform sampler2D uBloom;   // the same, quarter resolution, blurred
uniform sampler2D uGlow;    // the misted glass's glow as the caustic renderer drew it (part of uLight)
uniform sampler2D uMistBlur; // that glow blurred again (condensation scatters wide)
uniform float uGlowOn;
uniform vec4 uLightMap;     // name uv -> light uv: xy scale, zw offset
uniform float uLightScale;
uniform float uLightGain;   // exposure of the live light relative to the film's sun
uniform float uLive;        // 0..1 film patch -> live light
uniform float uLightOn;     // a light image exists
uniform float uBloomAmt;
uniform vec3 uGain;         // the film's sun on the wall per channel (patch / wall - 1, linear)
uniform float uLitScale;    // lit-mask.png holds the light fraction / this (scripts/litmask.mjs)

uniform sampler2D uPlaster;
uniform vec2 uPlasterScale; // name uv -> plaster uv
uniform float uPlasterAmt;

uniform sampler2D uBurnNoise;
uniform float uMist;        // visible condensation 0..1
uniform float uBurn;        // burn-off threshold (same encoding as CausticRenderer)
uniform float uBurnSoft;

uniform float uHaze;        // beam visibility
uniform float uHazeGain;
uniform vec4 uHand;         // hand in pane metres: centre xy, half size zw (zw = 0 when none)
uniform vec2 uHandShape;    // corner radius, feather (metres)
uniform vec2 uPaneSize;     // pane size, metres
uniform float uHandDepth;   // fraction of the way to the wall

uniform float uEV;          // slew-limited glare exposure
uniform float uGlare;       // 0..1 glare (for the soft glow around the light)
uniform float uGlint;       // 0..1 lock glint (x 0.3 luminance)
uniform float uGrainSeed;
uniform float uGrainAmt;
uniform vec2 uStage;        // stage size, CSS px
uniform vec4 uRing;         // pointer ring: x, y (CSS px, y down), radius, alpha
uniform vec4 uTapRing;      // tap ring: x, y, radius, alpha
uniform vec3 uSunTint;      // linear sun colour

varying vec2 vUv;

float hash12( vec2 p ) {
  vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
  p3 += dot( p3, p3.yzx + 33.33 );
  return fract( ( p3.x + p3.y ) * p3.z );
}

vec2 project( mat3 m, vec2 f ) {
  vec3 h = m * vec3( f, 1.0 );
  return h.xy / h.z;
}

// 1 inside the unit square, feathered by w (in uv units) either side of the edge.
float softBox( vec2 q, float w ) {
  vec2 d = max( -q, q - 1.0 );
  float o = max( d.x, d.y );
  return 1.0 - smoothstep( -w, w, o );
}

float roundedBox( vec2 p, vec2 b, float r ) {
  vec2 q = abs( p ) - b + r;
  return length( max( q, 0.0 ) ) + min( max( q.x, q.y ), 0.0 ) - r;
}

float cross2( vec2 a, vec2 b ) {
  return a.x * b.y - a.y * b.x;
}

// Bilinear quad coordinates of p in the quad a (0,0), b (1,0), c (1,1), d (0,1).
vec2 invBilinear( vec2 p, vec2 a, vec2 b, vec2 c, vec2 d ) {
  vec2 e = b - a;
  vec2 f = d - a;
  vec2 g = a - b + c - d;
  vec2 h = p - a;
  float k2 = cross2( g, f );
  float k1 = cross2( e, f ) + cross2( h, g );
  float k0 = cross2( h, e );
  float v;
  if ( abs( k2 ) < 1e-7 ) v = -k0 / k1;
  else {
    float w = k1 * k1 - 4.0 * k0 * k2;
    if ( w < 0.0 ) return vec2( -9.0 );
    w = sqrt( w );
    v = ( -k1 - w ) / ( 2.0 * k2 );
    if ( v < -0.5 || v > 1.5 ) v = ( -k1 + w ) / ( 2.0 * k2 );
  }
  vec2 den = e + g * v;
  float u = abs( den.x ) > abs( den.y ) ? ( h.x - f.x * v ) / den.x : ( h.y - f.y * v ) / den.y;
  return vec2( u, v );
}

// Smooth value noise (fixed seed): dust density in the beam, streaked along the light's path.
float vnoise( vec2 p ) {
  vec2 i = floor( p );
  vec2 f = fract( p );
  f = f * f * ( 3.0 - 2.0 * f );
  float a = hash12( i );
  float b = hash12( i + vec2( 1.0, 0.0 ) );
  float c = hash12( i + vec2( 0.0, 1.0 ) );
  float d = hash12( i + vec2( 1.0, 1.0 ) );
  return mix( mix( a, b, f.x ), mix( c, d, f.x ), f.y );
}

// 1 where the hand lets light through. q is pane uv; the hand is in pane metres.
float handPass( vec2 q ) {
  if ( uHand.z <= 0.0 ) return 1.0;
  vec2 m = ( q - 0.5 ) * uPaneSize;
  float sd = roundedBox( m - uHand.xy, uHand.zw, min( uHandShape.x, min( uHand.z, uHand.w ) ) );
  return smoothstep( -uHandShape.y, uHandShape.y, sd );
}

// Live light at name uv q (1 = the flat pane's sunlight), feathered at the edge of the light image.
vec3 liveLight( vec2 q ) {
  vec2 lu = q * uLightMap.xy + uLightMap.zw;
  vec2 e = smoothstep( vec2( 0.0 ), vec2( 0.03 ), lu ) * smoothstep( vec2( 1.0 ), vec2( 0.97 ), lu );
  vec2 c = clamp( lu, 0.0, 1.0 );
  vec3 l = texture2D( uLight, c ).rgb;
  if ( uGlowOn > 0.5 ) l += texture2D( uMistBlur, c ).rgb - texture2D( uGlow, c ).rgb;
  return max( l, 0.0 ) * uLightScale * uLightGain * e.x * e.y;
}

vec3 bloomLight( vec2 q ) {
  vec2 lu = q * uLightMap.xy + uLightMap.zw;
  vec2 e = smoothstep( vec2( -0.08 ), vec2( 0.02 ), lu ) * smoothstep( vec2( 1.08 ), vec2( 0.98 ), lu );
  return texture2D( uBloom, clamp( lu, 0.0, 1.0 ) ).rgb * uLightScale * uLightGain * e.x * e.y;
}

// Highlight shoulder on the brightest channel (keeps hue); identity below the knee.
vec3 shoulder( vec3 c ) {
  float m = max( max( c.r, c.g ), c.b );
  const float knee = 0.95;
  if ( m <= knee ) return c;
  float s = knee + ( 1.0 - knee ) * ( 1.0 - exp( -( m - knee ) / ( 1.0 - knee ) ) );
  vec3 o = c * ( s / m );
  // Very bright light drifts toward white, as film and eyes do.
  return mix( o, vec3( s ), smoothstep( 1.2, 3.0, m ) * 0.55 );
}

void main() {
  vec2 stageUv = vUv;
  vec2 sd = vec2( stageUv.x, 1.0 - stageUv.y );
  vec2 f = sd * uCover.xy + uCover.zw + uShift;          // frame, y down
  vec2 fu = vec2( f.x, 1.0 - f.y );

  vec3 plate = mix( texture2D( uA, fu ).rgb, texture2D( uB, fu ).rgb, uT );
  plate = mix( vec3( 0.0185, 0.0232, 0.0212 ), plate, uHasPlate );

  // Masks were measured on the final frame; follow the wall back along the dolly.
  vec2 ff = f * uToFinal.x + uToFinal.yz;
  vec2 ffu = vec2( ff.x, 1.0 - ff.y );
  // lit-mask.png is smoothstep(wall level, patch level, film luminance): invert the smoothstep to
  // get the film's light fraction back, so its soft edge divides out without a ghost outline.
  // The mask is the film's measured light fraction (scripts/litmask.mjs), scaled by 1 / uLitScale
  // where the patch is brighter than uGain; the division uses the full fraction.
  float litS = texture2D( uLit, ffu ).r;
  float litF = ( 0.5 - sin( asin( clamp( 1.0 - 2.0 * litS, -1.0, 1.0 ) ) / 3.0 ) ) * uLitScale;
  float lit = min( litF, 1.0 );
  float occ = texture2D( uOcc, ffu ).r;
  float wall = 1.0 - occ;
  float plateLum = dot( plate, vec3( 0.2126, 0.7152, 0.0722 ) );

  vec2 nu = project( uNameInv, f );
  vec2 pv = project( uPaneInv, f );
  float nameWin = softBox( nu, 0.04 );
  float jitter = hash12( floor( gl_FragCoord.xy ) + 0.37 );

  vec3 c = plate;
  vec3 L = vec3( 0.0 );

  // ---- 2. wall light ------------------------------------------------------------------------
  if ( uLive > 0.0 ) {
    // The film's own sunlight comes off the wall (steel keeps its own shading).
    vec3 unlit = plate / ( 1.0 + uGain * litF * wall );
    vec3 relit = unlit;
    if ( uLightOn > 0.5 ) {
      L = liveLight( nu ) * wall;
      float grain = texture2D( uPlaster, nu * uPlasterScale ).r;
      float albedo = mix( 1.0, grain / 0.62, uPlasterAmt );
      relit = unlit * ( 1.0 + uGain * L * albedo * ( 1.0 + uGlint * 0.3 ) );
    }
    c = mix( plate, relit, uLive );
  }

  // ---- 3. glass ------------------------------------------------------------------------------
  float inPane = softBox( pv, 0.006 );
  if ( inPane > 0.0 && uMist > 0.0 ) {
    float n = texture2D( uBurnNoise, clamp( pv, 0.0, 1.0 ) ).r;
    float fog = uMist * smoothstep( uBurn - uBurnSoft, uBurn + uBurnSoft, n ) * inPane;
    // Beaded condensation: a fine, fixed speckle in pane space, so it sticks to the glass.
    float bead = hash12( floor( pv * vec2( 300.0, 200.0 ) ) );
    float beads = 0.8 + 0.4 * bead * bead;
    vec3 veil = uSunTint * 0.3 * beads + c * 0.5;
    c = mix( c, veil, fog * 0.85 );
    // The drying front: a thin brighter rim where the glass is clearing right now.
    float front = 1.0 - smoothstep( 0.0, uBurnSoft * 1.4, abs( n - uBurn ) );
    c += uSunTint * 0.12 * front * uMist * step( 0.001, uBurn ) * step( uBurn, 1.0 ) * inPane;
  }

  // ---- 4. beam haze --------------------------------------------------------------------------
  // The layers are jittered per pixel (fixed seed) so they blend into a continuous prism. Each
  // layer's edge is feathered over about one layer's step (HAZE_EDGE in quad units), so a pixel at
  // the side of the beam sees a smooth ramp instead of a random subset of layers: no speckle at
  // the beam's edges, whatever the step count.
  vec3 haze = vec3( 0.0 );
  float hazeMask = 0.0;
  float hazeD = 0.0;
  if ( uHaze > 0.0 && f.x > uHazeBox.x && f.x < uHazeBox.z && f.y > uHazeBox.y && f.y < uHazeBox.w ) {
    float n = float( uHazeSteps );
    float edge = clamp( 0.8 / n, 0.07, 0.2 );
    vec3 acc = vec3( 0.0 );
    float cov = 0.0;
    for ( int k = 0; k < HAZE_STEPS; k ++ ) {
      if ( k >= uHazeSteps ) break;
      float t = ( float( k ) + jitter ) / n;
      float w = ( t / uDepths.y ) / ( ( 1.0 - t ) / uDepths.x + t / uDepths.y );
      vec2 q = invBilinear( f, mix( uPaneQ[ 0 ], uNameQ[ 0 ], w ), mix( uPaneQ[ 1 ], uNameQ[ 1 ], w ), mix( uPaneQ[ 2 ], uNameQ[ 2 ], w ), mix( uPaneQ[ 3 ], uNameQ[ 3 ], w ) );
      float inside = softBox( q, edge );
      if ( inside <= 0.0 ) continue;
      vec3 Lw = uLightOn > 0.5 ? mix( vec3( 1.0 ), liveLight( q ) / max( uLightGain, 1e-3 ), uLive ) : vec3( 1.0 );
      // Near the glass the beam is plain sunlight; the name forms toward the wall.
      vec3 Lk = mix( vec3( 1.0 ), Lw, t * t );
      float shadow = t > uHandDepth ? handPass( q ) : 1.0;
      // Dust: streaks across the beam that run along it (they move with the beam, never boil).
      float dust = 0.5 + 0.95 * vnoise( vec2( q.x * 11.0 + q.y * 3.0, t * 1.7 ) );
      // Faint right at the glass (so the glass itself stays clear to read), fuller in the open air.
      float fall = ( 1.2 - 0.35 * t ) * smoothstep( 0.0, 0.3, t );
      acc += inside * Lk * shadow * dust * fall;
      cov += inside * fall;
    }
    // Steel in front of the beam hides it: the occluder mask and anything much darker than the wall.
    float front = wall * smoothstep( 0.03, 0.085, plateLum );
    hazeD = dot( acc, vec3( 0.333 ) ) / n * front;
    hazeMask = clamp( cov / n, 0.0, 1.0 ) * front;
    haze = uSunTint * acc / n * front * uHaze * uHazeGain;
  }

  // ---- 5. exposure, bloom, grade ------------------------------------------------------------
  float rmask = readableMask( stageUv );
  float lightMask = max( max( lit * wall, nameWin * wall * 0.7 ), inPane * 0.85 );
  float ev = readableCapEV( uEV * lightMask, rmask );
  // The glare lifts the light itself: the surfaces it falls on, and the air it lights (the haze
  // brightens as a whole instead of multiplying whatever steel or wall lies behind it).
  c = c * exp2( ev ) + haze * exp2( readableCapEV( uEV * 0.6, rmask ) );
  // Glare glow: the light's own halo, feathered around the patch and the glass, never over text.
  float halo = min( texture2D( uLit, ffu, 4.5 ).r * uLitScale, 1.0 );
  c += uSunTint * uGlare * ( 0.55 * halo + 0.25 * inPane ) * 0.35 * ( 1.0 - rmask );
  // Emissive bloom of the live light: on the wall only (steel in front stays dark), never over text.
  if ( uBloomAmt > 0.0 && uLive > 0.0 && nameWin > 0.0 ) {
    c += uSunTint * bloomLight( nu ) * uBloomAmt * uLive * ( 1.0 + uGlint ) * ( 1.0 - rmask ) * wall * wall;
  }

  c = shoulder( c );

  // Grain keyed to p: identical for identical p, still when the page is still.
  vec2 px = sd * uStage;
  float g = hash12( floor( gl_FragCoord.xy ) + vec2( uGrainSeed * 17.0, uGrainSeed * 59.0 ) ) - 0.5;
  c += c * g * uGrainAmt;

  // Pointer ring (28 px) and the tap ring.
  if ( uRing.w > 0.0 ) {
    float d = abs( length( px - uRing.xy ) - uRing.z );
    c += vec3( 1.0, 0.95, 0.84 ) * uRing.w * 0.32 * ( 1.0 - smoothstep( 0.6, 1.8, d ) );
  }
  if ( uTapRing.w > 0.0 ) {
    float d = abs( length( px - uTapRing.xy ) - uTapRing.z );
    c += vec3( 1.0, 0.95, 0.84 ) * uTapRing.w * 0.4 * ( 1.0 - smoothstep( 0.8, 2.4, d ) );
  }

  c = readableDisplay( max( c, 0.0 ), rmask );
  if ( uDebug == 1 ) c = vec3( hazeD * 2.0, hazeMask, 0.0 );
  else if ( uDebug == 2 ) c = vec3( lit, occ, nameWin );
  else if ( uDebug == 3 ) c = L * 0.25;
  gl_FragColor = vec4( c, uAlpha );
  #include <colorspace_fragment>
  // Fixed dither against banding in the dark gradients (8-bit output).
  gl_FragColor.rgb += ( hash12( gl_FragCoord.xy + 0.5 ) - 0.5 ) / 255.0;
}
`,ie=`
uniform sampler2D uSrc;
uniform vec2 uTexel;
uniform float uOffset;
varying vec2 vUv;
void main() {
  vec2 o = uTexel * ( uOffset + 0.5 );
  vec4 s = texture2D( uSrc, vUv + vec2( -o.x, -o.y ) );
  s += texture2D( uSrc, vUv + vec2( o.x, -o.y ) );
  s += texture2D( uSrc, vUv + vec2( -o.x, o.y ) );
  s += texture2D( uSrc, vUv + vec2( o.x, o.y ) );
  gl_FragColor = s * 0.25;
}
`,H=`hero`,U=.12,W=.9,G={desktop:[4.528,4.141,3.588],phone:[4.607,4.336,3.735]},K={desktop:{pane:3.9,wall:5.4},phone:{pane:3.5,wall:5}},q=1/.17,J=150,ae=.09,oe=.32,se=.035,ce=.85,le=(()=>{if(typeof location>`u`)return 0;let e=new URLSearchParams(location.search).get(`heroqa`);return e&&e in V?V[e]:0})(),ue=e=>typeof location<`u`&&new URLSearchParams(location.search).has(e);function Y(e){return e>=3?`t3`:e===2?`t2`:`t1`}function X(e,t=new T){return t.set(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8])}async function Z(e,t,n,r,i){let a=await fetch(e,{signal:i});if(!a.ok)throw Error(`${e}: HTTP ${a.status}`);let o=await a.blob(),s=await createImageBitmap(o,{imageOrientation:`flipY`,premultiplyAlpha:`none`,colorSpaceConversion:`none`,resizeWidth:t,resizeHeight:n,resizeQuality:`high`}),c=new I(s);return c.flipY=!1,c.colorSpace=``,c.wrapS=c.wrapT=F,c.generateMipmaps=r,c.minFilter=r?x:y,c.magFilter=y,c.name=e,c.needsUpdate=!0,c}function Q(e){let t=new b(new ne(2,2),e);return t.frustumCulled=!1,t}var de=class e{manifests=new Map;maskPairs=new Map;disposed=!1;manifest(e,t){let n=this.manifests.get(e);if(!n){let r=`/frames/hero-${e}/manifest.json`;n=fetch(r,{signal:t}).then(e=>{if(!e.ok)throw Error(`${r}: HTTP ${e.status}`);return e.json()}),n.catch(()=>this.manifests.delete(e)),this.manifests.set(e,n)}return n}masks(t,n){let r=this.maskPairs.get(t);if(!r){let i=`/frames/hero-${t}`,[a,o]=t===`desktop`?[960,540]:[540,960];r=Promise.all([Z(`${i}/lit-mask.png`,a,o,!0,n),Z(`${i}/occluder-mask.png`,a,o,!1,n)]),r.then(t=>{this.disposed&&e.free(t)},()=>this.maskPairs.delete(t)),this.maskPairs.set(t,r)}return r}static free(e){for(let t of e)t.dispose(),t.image?.close?.()}dispose(){this.disposed=!0,this.maskPairs.forEach(t=>t.then(e.free,()=>void 0)),this.maskPairs.clear(),this.manifests.clear()}},$=class e{profile;tier;geo;seq;lit;occ;track;material;mesh;scene=new A;fit={sx:1,sy:1,ox:0,oy:0};constructor(e,t,n,r,i,a){this.profile=e,this.tier=t,this.geo=s(e),this.seq=n,this.lit=r,this.occ=i;let o=n.manifest.lighttrack;this.track=o&&Array.isArray(o.patchBBox)?o:null,this.material=a,this.mesh=Q(a),this.scene.add(this.mesh)}static async load(t,n,r,i,a,o,s,c){let l=s.masks(t,a);l.catch(()=>void 0);let u=await s.manifest(t,a),d=await R.load({manifest:u,baseUrl:`/frames/hero-${t}`,renderer:n.renderer,tier:r,compact:n.engine.caps.compact,saveData:n.engine.caps.saveData,onFrame:o,signal:a,hold:c}),f,p;try{[f,p]=await l}catch(e){throw d.dispose(),e}return new e(t,r,d,f,p,i)}async firstFrame(e,t){this.seq.setFrame(e);let n=performance.now();for(;!this.seq.sample(e);){if(t.aborted)throw new DOMException(`aborted`,`AbortError`);if(performance.now()-n>2e4)throw Error(`hero: no frame after 20 s`);await new Promise(e=>requestAnimationFrame(()=>e())),this.seq.pump(1)}}dispose(){this.seq.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}},fe=class{ctx;channel;tier=2;quality=e[2];size=null;camera=new N;plate=null;outgoing=null;loadingKey=``;caustic=null;pane=null;paneTier=null;lightTarget=null;bloomA=null;bloomB=null;mistA=null;mistB=null;mistOut=null;glowTex=null;blurMat=new O({vertexShader:B,fragmentShader:ie,uniforms:{uSrc:{value:null},uTexel:{value:new w},uOffset:{value:0}},depthTest:!1,depthWrite:!1,toneMapped:!1,blending:0});blurScene=new A;lightKey=``;lightValid=!1;lightSwap=0;plaster=null;burnNoise=te();empty=new I;exposure=new h(C,0);glint=new h(q,0);state=n(0);handU;handV;handOn;handVersion=-1;activeAt=0;ringAlpha=0;abort=new AbortController;assets=new de;benchmarked=!1;qa=ue(`heroqa`)?{p:0,state:null,exposure:0,glint:0,frame:0,profile:null,folder:``,tier:0,lightRenders:0,lightMs:0,paneMs:0,ready:!1,exact:!1,hand:`none`}:null;async init(e){this.ctx=e,this.tier=e.engine.tier,this.quality=e.engine.quality,this.channel=e.progress(H),this.handU=e.spring(`occluder`),this.handV=e.spring(`occluder`),this.handOn=e.spring(`occluder`),this.blurScene.add(Q(this.blurMat));let t=i.subscribe(()=>e.invalidate());e.onDispose(t),this.qa&&(this.qa.engine=e.engine,window.__hero=this.qa);let r=this.abortSignal();e.engine.whenBenchmarked().then(()=>{this.benchmarked=!0;let t=this.plate;t&&t.tier===e.engine.tier&&t.seq.holdFetches(!1)});let a=m(e.size.width,e.size.height);this.loadingKey=`${a}:${this.tier}`;let o=performance.now(),[s,c,l]=await Promise.all([$.load(a,e,this.tier,this.createMaterial(a),r,()=>e.invalidate(),this.assets,!this.benchmarked),z(Y(this.tier),r).catch(e=>(console.warn(`[hero] brand pane unavailable; the film patch stays:`,e),null)),S(`plaster`,{tier:this.tier,compact:e.engine.caps.compact,signal:r}).catch(()=>null)]);if(r.aborted){s.dispose();return}this.plate=s,this.benchmarked&&e.engine.tier===s.tier&&s.seq.holdFetches(!1),l&&(this.plaster=l.texture,v(e.renderer,l.texture)),v(e.renderer,s.lit),v(e.renderer,s.occ),this.setPane(c),this.qa&&(this.qa.paneMs=c?c.timings.fetch+c.timings.inflate+c.timings.decode:-1),await s.firstFrame(n(this.channel.value).plate*(s.seq.count-1),r),this.fit(s),await e.compile(s.scene,this.camera),this.warmLight(),this.qa&&(this.qa.ready=!0,console.info(`[hero] ready in ${(performance.now()-o).toFixed(0)} ms: ${a} ${s.seq.folder}.${s.seq.format}, pane ${c?c.tier:`none`}`))}abortSignal(){let e=this.ctx.signal;return e.aborted?this.abort.abort():e.addEventListener(`abort`,()=>this.abort.abort(),{once:!0}),this.abort.signal}setPane(e){this.pane=e,this.paneTier=e?e.tier:null,this.ctx.el.toggleAttribute(`data-hero-light`,e!==null),e&&(this.caustic?this.caustic.setQuality(Y(this.tier)):this.caustic=new j(this.ctx.renderer,{quality:Y(this.tier)}),this.caustic.setSolution(e.pane),this.caustic.setView(`patch`,U),this.caustic.setExposure(1),this.ensureLightTargets(),this.lightValid=!1,this.lightKey=``)}ensureLightTargets(){if(!this.caustic)return;let e=this.quality.lightTarget,t=e,n=Math.round(e*1.04/1.44);(!this.lightTarget||this.lightTarget.width!==t||this.lightTarget.height!==n)&&(this.lightTarget?.dispose(),this.lightTarget=M(t,n,this.caustic.format),this.lightValid=!1);let r=Math.max(8,Math.round(t/4)),i=Math.max(8,Math.round(n/4));if(this.quality.bloomMips>0){if(!this.bloomA||this.bloomA.width!==r||this.bloomA.height!==i){this.bloomA?.dispose(),this.bloomB?.dispose();let e={format:P,type:L,depthBuffer:!1,stencilBuffer:!1,magFilter:y,minFilter:y};this.bloomA=new k(r,i,e),this.bloomB=new k(r,i,e)}}else this.bloomA?.dispose(),this.bloomB?.dispose(),this.bloomA=this.bloomB=null;let a=Math.max(8,Math.round(t/8)),o=Math.max(8,Math.round(n/8));if(!this.mistA||this.mistA.width!==a||this.mistA.height!==o){this.mistA?.dispose(),this.mistB?.dispose();let e={format:P,type:L,depthBuffer:!1,stencilBuffer:!1,magFilter:y,minFilter:y};this.mistA=new k(a,o,e),this.mistB=new k(a,o,e)}let s=t*n*8+(this.bloomA?r*i*16:0)+a*o*16;this.ctx.trackMemory(`hero light`,s)}warmLight(){if(!this.caustic||!this.lightTarget)return;let e=this.ctx.renderer,t=e.getRenderTarget();this.renderLight(e,n(c.live[1]+.04)),e.setRenderTarget(t),this.lightValid=!1,this.lightKey=``}occluderFor(){let e=this.handOn.value;return e<.02?null:{x:(this.handU.value-.5)*1.2,y:(this.handV.value-.5)*.8,hw:f.width/2*e,hh:f.height/2*e}}renderLight(e,t){let n=this.caustic,r=this.lightTarget;if(!n||!r)return;let i=performance.now(),a=(this.pane?.pane.distance??1.5)*t.focus;n.setFocus(a),n.setMist(t.lightMist),n.setBurnOff(t.burn);let o=this.occluderFor();n.setOccluder(o?{x0:o.x-o.hw,x1:o.x+o.hw,y0:o.y-o.hh,y1:o.y+o.hh,radius:Math.min(f.radius,o.hw,o.hh),feather:f.feather,depth:u*a}:null),n.render(e,r,{output:`light`});let s=n.diffuseTexture;if(this.glowTex=s,this.mistOut=s&&this.mistA&&this.mistB?this.blur(e,s,this.mistA,this.mistB,[1,1,2,3]):null,this.bloomA&&this.bloomB){let t=this.blur(e,r.texture,this.bloomA,this.bloomB,this.quality.bloomMips>=2?[1,1,2]:[1,1]);t!==this.bloomA&&this.blur(e,t.texture,this.bloomA,this.bloomA,[0])}this.lightValid=!0,this.qa&&(this.qa.lightRenders++,this.qa.lightMs=performance.now()-i)}blur(e,t,n,r,i){let a=this.blurMat.uniforms,o=t.image,s=o?.width??n.width,c=o?.height??n.height,l=t,u=n;for(let t of i){if(a.uSrc.value=l,a.uTexel.value.set(1/Math.max(1,s),1/Math.max(1,c)),a.uOffset.value=t,e.setRenderTarget(u),e.render(this.blurScene,this.camera),l=u.texture,s=u.width,c=u.height,n===r)return u;u=u===n?r:n}return u===n?r:n}createMaterial(e){return new O({vertexShader:B,fragmentShader:re,uniforms:{...this.ctx.readable.uniforms,uA:{value:null},uB:{value:null},uT:{value:0},uHasPlate:{value:0},uAlpha:{value:1},uCover:{value:new g(1,1,0,0)},uShift:{value:new w},uToFinal:{value:new _(1,0,0)},uNameInv:{value:new T},uPaneInv:{value:new T},uPaneQ:{value:[new w,new w,new w,new w]},uNameQ:{value:[new w,new w,new w,new w]},uDepths:{value:new w(K[e].pane,K[e].wall)},uHazeBox:{value:new g},uHazeSteps:{value:8},uDebug:{value:le},uLit:{value:null},uOcc:{value:null},uLight:{value:this.empty},uBloom:{value:this.empty},uGlow:{value:this.empty},uMistBlur:{value:this.empty},uGlowOn:{value:0},uLightMap:{value:new g(1,1,0,0)},uLightScale:{value:8},uLightGain:{value:ce},uLive:{value:0},uLightOn:{value:0},uBloomAmt:{value:0},uGain:{value:new _(...G[e])},uLitScale:{value:s(e).litScale},uPlaster:{value:this.empty},uPlasterScale:{value:new w(1.2/W,.8/W)},uPlasterAmt:{value:0},uBurnNoise:{value:this.burnNoise},uMist:{value:0},uBurn:{value:0},uBurnSoft:{value:.06},uHaze:{value:0},uHazeGain:{value:oe},uHand:{value:new g},uHandShape:{value:new w(f.radius,f.feather)},uPaneSize:{value:new w(1.2,.8)},uHandDepth:{value:u},uEV:{value:0},uGlare:{value:0},uGlint:{value:0},uGrainSeed:{value:0},uGrainAmt:{value:se},uStage:{value:new w(1,1)},uRing:{value:new g},uTapRing:{value:new g},uSunTint:{value:new D(`#FFF2D6`)}},depthTest:!1,depthWrite:!1,toneMapped:!1,blending:0})}fit(e){if(!this.size)return;let t=this.ctx.el.querySelector(`.stage-poster img`),n=t?getComputedStyle(t).objectPosition:null,r=p(n,e.profile===`phone`?{x:.5,y:.3}:{x:.62,y:.3});e.fit=d(this.size.width,this.size.height,e.geo.aspect,r)}resize(e){this.size=e;let t=m(e.width,e.height);this.plate&&this.fit(this.plate),this.outgoing&&this.fit(this.outgoing.plate),this.plate&&t!==this.plate.profile&&this.swapPlate(t,this.tier)}swapPlate(e,t){let n=`${e}:${t}`;if(n===this.loadingKey)return;this.loadingKey=n;let r=this.ctx,i=this.abort.signal;$.load(e,r,t,this.createMaterial(e),i,()=>r.invalidate(),this.assets,!this.benchmarked).then(async e=>{if(this.loadingKey!==n||i.aborted||(await e.firstFrame(this.state.plate*(e.seq.count-1),i),this.loadingKey!==n||i.aborted)||(v(r.renderer,e.lit),v(r.renderer,e.occ),this.fit(e),await r.compile(e.scene,this.camera),this.loadingKey!==n||i.aborted))return e.dispose();this.outgoing?.plate.dispose(),this.outgoing=this.plate?{plate:this.plate,since:performance.now()}:null,this.plate=e,this.benchmarked&&e.tier===r.engine.tier&&e.seq.holdFetches(!1),r.invalidate()}).catch(e=>{i.aborted||console.warn(`[hero] sequence swap failed:`,e),this.loadingKey===n&&(this.loadingKey=this.plate?`${this.plate.profile}:${this.tier}`:``)})}update(e,t){let r=this.plate;if(!r)return!1;let a=n(this.channel.value);a.p!==this.state.p&&(this.activeAt=performance.now()),this.state=a;let o=!1;r.seq.setFrame(a.plate*(r.seq.count-1)),r.seq.pump(this.uploadsPerTick(r))>0&&(o=!0),r.seq.pending&&(o=!0),this.outgoing&&(performance.now()-this.outgoing.since>=J&&(this.outgoing.plate.dispose(),this.outgoing=null),o=!0);let s=this.exposure.value,l=this.glint.value;this.exposure.target=a.glareEV,this.exposure.step(e),this.glint.target=a.glint,this.glint.step(e),(this.exposure.value!==s||this.glint.value!==l||!this.exposure.settled||!this.glint.settled)&&(o=!0),this.ctx.readable.setGlare(this.exposure.value/c.glareEV);let u=i.get();i.version!==this.handVersion&&(this.handVersion=i.version,this.activeAt=performance.now(),o=!0);let d=a.p>=c.beat2-.005&&this.pane!==null&&u.source!==`none`;d&&(this.handOn.value<.02&&(this.handU.snap(u.u),this.handV.snap(u.v)),this.handU.target=u.u,this.handV.target=u.v),this.handOn.target=+!!d;let f=d&&u.source===`hover`?1:0;return f!==this.ringAlpha&&(this.ringAlpha=f,o=!0),u.tapAt>0&&performance.now()-u.tapAt<480&&(o=!0),this.ctx.trackMemory(`frame ring`,r.seq.gpuBytes+(this.outgoing?.plate.seq.gpuBytes??0)),this.qa&&(this.qa.p=a.p,this.qa.state=a,this.qa.exposure=this.exposure.value,this.qa.glint=this.glint.value,this.qa.frame=a.plate*(r.seq.count-1),this.qa.profile=r.profile,this.qa.folder=`${r.seq.folder}.${r.seq.format}`,this.qa.seq=r.seq.stats,this.qa.tier=t.tier,this.qa.hand=d?`${u.source} ${this.handU.value.toFixed(3)},${this.handV.value.toFixed(3)}`:`none`),o}uploadsPerTick(e){let t=this.ctx.engine.stats;if(this.tier>=3&&t.benchmark?.tier===3)return 2;let n=this.size?this.size.pixelWidth*this.size.pixelHeight:0;return t.renderScale<1||n>22e5?.5:1}render(e,t){let n=this.plate;if(!n||!this.size||!this.outgoing&&!n.seq.sample())return!1;let r=this.state;if(this.caustic!==null&&this.lightTarget!==null&&(r.liveMix>0||this.handOn.value>.02)){let n=this.occluderFor(),i=`${r.burn}|${r.focus}|${n?`${n.x},${n.y},${n.hw},${n.hh}`:`-`}|${this.tier}`;(i!==this.lightKey||!this.lightValid||this.qa?.off?.light)&&(this.lightKey=i,this.renderLight(e,r),t.restore())}let i=this.outgoing;if(i){this.drawPlate(e,i.plate,1,0);let t=Math.min(1,(performance.now()-i.since)/J);this.drawPlate(e,n,t*t*(3-2*t),1)}else this.drawPlate(e,n,1,0);return!0}drawPlate(e,n,a,s){let l=this.size,u=this.state,d=n.seq.sample(),f=n.material.uniforms;n.material.blending=s,n.material.transparent=s!==0,f.uAlpha.value=a,f.uHasPlate.value=+!!d;let p=u.plate;f.uA.value=d?d.a:this.empty,f.uB.value=d?d.b:this.empty,d&&(f.uT.value=d.t,p=(d.ia+(d.ib-d.ia)*d.t)/Math.max(1,n.seq.count-1)),this.qa&&n===this.plate&&(this.qa.exact=!!d?.exact);let m=n.fit;f.uCover.value.set(m.sx,m.sy,m.ox,m.oy);let h=this.ctx.pointer,g=f.uShift.value;!this.ctx.engine.still&&h.inside&&h.type===`mouse`&&u.parallax>0?g.set(h.sx*6*u.parallax*m.sx/l.width,-h.sy*6*u.parallax*m.sy/l.height):g.set(0,0);let _=ee(n.geo,n.track,p);f.uToFinal.value.set(_.toFinal.s,_.toFinal.tx,_.toFinal.ty);let v=t(_.patch,n.profile);X(o(r(v)),f.uNameInv.value),X(o(r(_.pane)),f.uPaneInv.value),this.beam(_.pane,v,f),f.uLit.value=n.lit,f.uOcc.value=n.occ;let y=this.lightValid&&this.lightTarget!==null&&(u.liveMix>0||this.handOn.value>.02);f.uLightOn.value=+!!y,f.uLight.value=y?this.lightTarget.texture:this.empty,f.uBloom.value=y&&this.bloomA?this.bloomA.texture:this.empty;let b=y&&this.glowTex!==null&&this.mistOut!==null;f.uGlowOn.value=+!!b,f.uGlow.value=b?this.glowTex:this.empty,f.uMistBlur.value=b?this.mistOut.texture:this.empty,f.uBloomAmt.value=y&&this.bloomA&&!this.qa?.off?.bloom?ae:0;let x=1.44,S=1.04;f.uLightMap.value.set(1.2/x,.8/S,U/x,U/S),f.uLive.value=this.pane?u.liveMix:0,f.uPlaster.value=this.plaster??this.empty,f.uPlasterAmt.value=this.plaster?.35:0,f.uMist.value=this.pane?u.mist:0,f.uBurnSoft.value=.06,f.uBurn.value=-.06+1.12*u.burn,f.uHaze.value=this.qa?.off?.haze?0:u.haze,f.uHazeSteps.value=Math.max(1,Math.min(8,this.quality.hazeSteps||4));let C=this.occluderFor();f.uHand.value.set(C?.x??0,C?.y??0,C?.hw??0,C?.hh??0),f.uEV.value=this.exposure.value,f.uGlare.value=this.exposure.value/c.glareEV,f.uGlint.value=this.glint.value,f.uGrainSeed.value=Math.floor(u.p*240),f.uStage.value.set(l.width,l.height);let w=i.get(),T=f.uRing.value;if(this.ringAlpha>0&&this.handOn.value>.02){let[e,t]=this.patchToStagePx(n,v,w.u,w.v);T.set(e,t,14,this.ringAlpha*Math.min(1,this.handOn.value))}else T.set(0,0,0,0);let E=f.uTapRing.value,D=w.tapAt>0?(performance.now()-w.tapAt)/450:1;if(D<1){let[e,t]=this.patchToStagePx(n,v,w.tapU,w.tapV);E.set(e,t,14+10*D,1-D)}else E.set(0,0,0,0);e.render(n.scene,this.camera)}patchToStagePx(e,t,n,i){let o=a(r(t),n,i),s=l(o,e.fit);return[s[0]*this.size.width,s[1]*this.size.height]}beam(e,t,n){let r=[3,2,1,0],i=n.uPaneQ.value,a=n.uNameQ.value;r.forEach((n,r)=>{i[r].set(e[n][0],e[n][1]),a[r].set(t[n][0],t[n][1])});let o=1/0,s=1/0,c=-1/0,l=-1/0;for(let n of[...e,...t])o=Math.min(o,n[0]),s=Math.min(s,n[1]),c=Math.max(c,n[0]),l=Math.max(l,n[1]);n.uHazeBox.value.set(o-.03,s-.03,c+.03,l+.03)}onTierChange(e,t){let n=e!==this.tier;this.tier=e,this.quality=t,this.plate&&n&&(this.plate.seq.folder!==t.frames&&this.swapPlate(this.plate.profile,e),this.swapLight(e))}async swapLight(e){let t=++this.lightSwap,n=this.abort.signal,r=Y(e),i=this.paneTier===r&&this.pane?this.pane:await z(r,n).catch(()=>null);if(t!==this.lightSwap||n.aborted||!i)return;for(;;){if(await new Promise(e=>{`requestIdleCallback`in window?window.requestIdleCallback(()=>e(),{timeout:2500}):setTimeout(e,200)}),t!==this.lightSwap||n.aborted)return;if(performance.now()-this.activeAt>=600)break;await new Promise(e=>setTimeout(e,250))}let a=this.caustic;this.caustic=null,this.setPane(i),this.warmLight(),a?.dispose(),this.ctx.invalidate()}onStillChange(){this.ctx.invalidate()}release(){this.plate?.seq.release(),this.outgoing?.plate.dispose(),this.outgoing=null}restore(){let e=this.plate;e&&e.seq.setFrame(n(this.channel.value).plate*(e.seq.count-1)),this.ctx.invalidate()}freeLight(){this.lightTarget?.dispose(),this.bloomA?.dispose(),this.bloomB?.dispose(),this.mistA?.dispose(),this.mistB?.dispose(),this.lightTarget=this.bloomA=this.bloomB=this.mistA=this.mistB=this.mistOut=null,this.glowTex=null,this.caustic?.dispose(),this.caustic=null,this.lightValid=!1,this.ctx.trackMemory(`hero light`,0)}dispose(){this.abort.abort(),this.release(),this.freeLight(),this.plate?.dispose(),this.plate=null,this.assets.dispose(),this.blurMat.dispose(),this.blurScene.traverse(e=>e instanceof b&&e.geometry.dispose()),this.burnNoise.dispose(),this.empty.dispose(),this.ctx?.el.removeAttribute(`data-hero-light`),this.qa&&window.__hero===this.qa&&delete window.__hero}};function pe(){return E(`hero`,()=>new fe,{clear:`shade`,pointer:!0,still:`render`,minTier:1})}export{pe as registerHeroStage};