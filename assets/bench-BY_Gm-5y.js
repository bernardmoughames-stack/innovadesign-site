import{O as e,R as t,V as n}from"./index-DK3SdCJF.js";import{$ as r,Cn as i,Dn as a,En as o,F as s,Ft as c,Gt as l,Jt as u,K as d,N as f,O as p,Rt as m,S as h,St as g,Tn as _,Wt as v,Z as y,bt as b,c as ee,cn as x,ct as te,dn as ne,dt as S,gt as C,hn as w,ht as re,in as ie,kn as ae,lt as oe,m as T,mn as E,mt as se,n as ce,nn as le,ot as D,p as O,pt as k,qt as ue,r as A,rn as de,st as fe,t as j,tn as M,u as pe,un as me,xt as he,yn as N,yt as ge,z as _e}from"./CausticRenderer-bvkQ_Qu4.js";import{n as P}from"./forward-CvkGx4Q2.js";import{i as F}from"./tiers-BQJo9f5M.js";var I=1/120,L=6,R=4.1202*I*I,ve=.992,ye=.07,be=.03,xe=.03,z={x0:-2.15,x1:4.2,z1:3.1},Se=.35,Ce=110,we=class{bodies=[];acc=0;pusher=null;pusherPrev=null;quiet=0;add(e,t,n,r){let i={x:e,z:t,px:e,pz:t,r:n,invMass:1/(n*n*40),yaw:r,spin:0,rock:0,rockVel:0,rockAxis:0,lastTap:0};return this.bodies.push(i),i}get awake(){return this.quiet<.25}step(e,t){let n=[];this.pusherPrev=this.pusher,this.pusher=t.pusher?{...t.pusher}:null,this.acc=Math.min(this.acc+e,L*I);let r=0,i=this.pusherPrev,a=this.pusher,o=Math.floor(this.acc/I),s=!1;for(;this.acc>=I;){this.acc-=I,r++;let e=o>0?r/o:1,c=a&&i?{x:i.x+(a.x-i.x)*e,z:i.z+(a.z-i.z)*e}:a;this.substep(c,t,n)&&(s=!0)}return o>0&&(this.quiet=s?0:this.quiet+o*I),n}substep(e,t,n){let r=this.bodies,i=!1;for(let e of r){let t=(e.x-e.px)*ve,n=(e.z-e.pz)*ve,r=Math.hypot(t,n);if(r<=R)t=0,n=0;else{let e=(r-R)/r;t*=e,n*=e,i=!0}e.px=e.x,e.pz=e.z,e.x+=t,e.z+=n,e.yaw+=e.spin*I,e.spin*=.985,Math.abs(e.spin)<.02&&(e.spin=0),e.rockVel+=(-90*e.rock-7*e.rockVel)*I,e.rock+=e.rockVel*I,Math.abs(e.rock)<1e-4&&Math.abs(e.rockVel)<.001?(e.rock=0,e.rockVel=0):i=!0,e.spin!==0&&(i=!0)}for(let a=0;a<3;a++){if(e)for(let t of r){let n=t.x-e.x,r=t.z-e.z,o=Math.hypot(n,r),s=t.r+ye;if(o<s&&o>1e-6){let e=Math.min(s-o,be),c=n/o,l=r/o;if(t.x+=c*e,t.z+=l*e,a===0){let n=-l*this.pusherVel().x+c*this.pusherVel().z;t.spin+=n*6,t.rockAxis=Math.atan2(l,c),t.rockVel+=e*60}i=!0}}for(let e=0;e<r.length;e++){let o=r[e];for(let s=e+1;s<r.length;s++){let c=r[s],l=c.x-o.x,u=c.z-o.z,d=Math.hypot(l,u),f=o.r+c.r;if(d>=f||d<1e-6)continue;let p=l/d,m=u/d,h=f-d,g=o.invMass+c.invMass;if(a===0){let r=-((c.x-c.px-(o.x-o.px))*p+(c.z-c.pz-(o.z-o.pz))*m)/I;if(r>Se){let i=Math.min(1,r/2.2);t.now-o.lastTap>Ce&&t.now-c.lastTap>Ce&&(n.push({index:e,strength:i}),o.lastTap=c.lastTap=t.now),o.rockVel-=i*3,c.rockVel+=i*3}}o.x-=p*h*(o.invMass/g),o.z-=m*h*(o.invMass/g),c.x+=p*h*(c.invMass/g),c.z+=m*h*(c.invMass/g),i=!0}}for(let e=0;e<r.length;e++){let i=r[e];i.z<xe+i.r&&this.bounce(i,0,1,xe+i.r-i.z,e,t.now,n,a),i.x<z.x0+i.r&&(i.x=z.x0+i.r),i.x>z.x1-i.r&&(i.x=z.x1-i.r),i.z>z.z1-i.r&&(i.z=z.z1-i.r);for(let r of t.boxes){let o=Math.max(r.x0,Math.min(i.x,r.x1)),s=Math.max(r.z0,Math.min(i.z,r.z1)),c=i.x-o,l=i.z-s,u=Math.hypot(c,l);if(!(u>=i.r)){if(u>1e-6)this.bounce(i,c/u,l/u,i.r-u,e,t.now,n,a);else{let o=[i.x-r.x0,r.x1-i.x,i.z-r.z0,r.z1-i.z],s=o.indexOf(Math.min(...o)),c=[[-1,0],[1,0],[0,-1],[0,1]][s];this.bounce(i,c[0],c[1],o[s]+i.r,e,t.now,n,a)}}}for(let r of t.circles){let o=i.x-r.x,s=i.z-r.z,c=Math.hypot(o,s),l=i.r+r.r;c<l&&c>1e-6&&this.bounce(i,o/c,s/c,l-c,e,t.now,n,a)}}}return i}bounce(e,t,n,r,i,a,o,s){if(s===0){let r=((e.x-e.px)*t+(e.z-e.pz)*n)/I;-r>Se&&a-e.lastTap>Ce&&(o.push({index:i,strength:Math.min(1,-r/2.2)}),e.lastTap=a),r<0&&(e.px+=t*r*I*.35,e.pz+=n*r*I*.35)}e.x+=t*r,e.z+=n*r}pusherVel(){return!this.pusher||!this.pusherPrev?{x:0,z:0}:{x:(this.pusher.x-this.pusherPrev.x)*60,z:(this.pusher.z-this.pusherPrev.z)*60}}},B={x:0,y:2.4},V={width:1.2,height:.8,thickness:.045},Te=.02,H={top:.2,bottom:.03,side:.26,thickness:.05},U={width:1.2+2*H.side,height:.8+H.top+H.bottom,y0:B.y-.4-H.bottom,y1:B.y+.4+H.top},W=1.18,G={z0:.32,z1:5.2,gauge:.26},K={x:W,halfWidth:.34,halfDepth:.38},q=new o(.5599999999999999,.46,.5),J={gripY:B.y-V.height/2-.06,bladeInset:.022},Ee=new v,De=new x,Oe=new o(1,1,1),ke=new C,Ae=new o;function Y(e,t,n,r,i=0,a=0,o=0){return De.setFromEuler(ke.set(i,a,o)),Ee.compose(Ae.set(t,n,r),De,Oe),e.applyMatrix4(Ee),e}function X(e,t,n,r,i,a,o=0){return Y(o>0?new d(e,t,n,2,o):new D(e,t,n),r,i,a)}function Z(e,t,n,r,i,a=`y`,o=20){let s=new k(e,e,t,o);return a===`x`?Y(s,n,r,i,0,0,Math.PI/2):a===`z`?Y(s,n,r,i,Math.PI/2,0,0):Y(s,n,r,i)}function je(e){for(let t of e){for(let e of Object.keys(t.attributes))e!==`position`&&e!==`normal`&&e!==`uv`&&t.deleteAttribute(e);t.getAttribute(`uv`)||t.deleteAttribute(`uv`)}e.every(e=>e.getAttribute(`uv`))||e.forEach(e=>e.deleteAttribute(`uv`));let t=r(e.map(e=>e.index?e.toNonIndexed():e),!1);if(e.forEach(e=>e.dispose()),!t)throw Error(`bench: geometry merge failed`);return t.computeBoundingSphere(),t}function Me(){let e=[],t=G.z1-G.z0,n=(G.z0+G.z1)/2;for(let r of[-1,1])e.push(X(.05,.05,t,W+r*G.gauge/2,.055,n,.008)),e.push(X(.03,.012,t,W+r*G.gauge/2,.084,n,.004));for(let t=G.z0+.12;t<G.z1-.05;t+=.42)e.push(X(G.gauge+.16,.03,.09,W,.015,t,.006));return e.push(X(G.gauge+.12,.1,.08,W,.05,G.z0-.02,.01)),je(e)}function Ne(){let e=[],t=W;e.push(X(.68,.16,.76,t,.2,0,.02)),e.push(X(.74,.03,.82,t,.29500000000000004,0,.008));for(let n of[-1,1])for(let r of[-1,1])e.push(Z(.062,.05,t+n*G.gauge/2,.1,r*.26,`x`,18));let n=B.y+.34;e.push(X(.44,.7,.46,t,.65,0,.018)),e.push(X(.26,n-1,.3,t,(1+n)/2,0,.014)),e.push(X(.34,.08,.38,t,1.02,0,.01)),e.push(X(.03,n-1-.1,.02,1.0899999999999999,(1+n)/2,.155,.004)),e.push(X(.03,n-1-.1,.02,1.27,(1+n)/2,.155,.004));for(let n of[.45,.75,1.02])for(let r of[-1,1])e.push(Z(.013,.02,t+r*.15,n,.235,`z`,10));let r=.68,a=.29,s=new i(.16,.013,10,40);e.push(Y(s,t,r,a)),e.push(Z(.03,.06,t,r,a,`z`,14)),e.push(Z(.018,.08,t,r,.24,`z`,12));for(let n=0;n<4;n++){let i=n*Math.PI/2+Math.PI/4,o=new k(.007,.007,.16,8);Y(o,t+Math.cos(i)*.08,r+Math.sin(i)*.08,a,0,0,i-Math.PI/2),e.push(o)}let c=U.width/2,l=B.y+.12;e.push(X(t-c+.06,.12,.12,(t+c)/2-.02,l,0,.012)),e.push(X(.12,.34,.16,c+.03,l-.02,0,.012));{let t=new o(1.0799999999999998,B.y-.62,0),n=new o(c+.1,l-.06,0),r=n.clone().sub(t),i=new D(.06,r.length(),.07),a=new x().setFromUnitVectors(new o(0,1,0),r.clone().normalize());i.applyMatrix4(new v().compose(t.clone().add(n).multiplyScalar(.5),a,new o(1,1,1))),e.push(i)}let u=V.width,d=V.height,f=H.thickness,p=B.y,m=-.012;e.push(X(U.width,H.top,f,0,p+d/2+H.top/2,m,.008)),e.push(X(U.width,H.bottom,f,0,p-d/2-H.bottom/2,m,.006)),e.push(X(H.side,d,f,-(u/2+H.side/2),p,m,.008)),e.push(X(H.side,d,f,u/2+H.side/2,p,m,.008));for(let t of[-1,1])for(let n of[-1,1])e.push(X(.09,.05,.05,t*(u/2-.02),p+n*(d/2+.012),.035,.006)),e.push(Z(.011,.02,t*(u/2-.02),p+n*(d/2+.012),.068,`z`,10));for(let t of[-.7,-.35,0,.35,.7])e.push(Z(.014,.014,t,p+d/2+H.top*.62,m+f/2+.005,`z`,12));e.push(X(u+.12,.024,.03,0,p+d/2+.035,.085,.006));let h=new o(.8799999999999999,.3,.26),g=q.clone(),_=g.clone().sub(h),y=new k(.017,.017,_.length(),12),b=new x().setFromUnitVectors(new o(0,1,0),_.clone().normalize());return y.applyMatrix4(new v().compose(h.clone().add(g).multiplyScalar(.5),b,new o(1,1,1))),e.push(y),e.push(X(.06,.09,.09,.8599999999999999,.3,.26,.01)),je(e)}function Pe(){let e=new N(.05,24,16);return e.translate(q.x,q.y,q.z),e}function Fe(){let e=B.y,t=V.height;return{steel:je([X(.07,.05,.05,0,e+t/2+.035,.095,.008),X(.026,t+.06,.03,0,e+0,.078,.006),Z(.012,.09,0,J.gripY+.04,.095,`y`,10)]),rubber:X(.012,t-.01,.018,0,e,.054,.003),grip:Z(.03,.12,0,J.gripY,.11,`z`,20)}}function Ie(){let e=je([Z(.15,.028,0,.014,0,`y`,32),Z(.05,.04,0,.045,0,`y`,16)]),t=new k(.014,.014,1,12);return t.translate(0,.5,0),{foot:e,rod:t,top:je([Z(.2,.022,0,-.011,0,`y`,36),Z(.03,.05,0,-.04,0,`y`,12)])}}function Le(){return new D(V.width,V.height,V.thickness)}function Re(){return new de(V.width,V.height)}function ze(){return{uLight:{value:null},uLightBlur:{value:null},uLightDefocus:{value:null},uDefocus:{value:0},uLightRect:{value:new a(-.7,-1.1,1.4,1)},uPaneOrigin:{value:new _(0,2.4)},uSunXY:{value:new _(.12,-.45)},uSunE:{value:20.8},uSunColor:{value:new S(1,.86,.66)},uWallAlbedo:{value:new S(.6,.58,.55)},uBounce:{value:new a(0,1.7,0,0)},uShadow:{value:null},uShadowMat:{value:new v},uShadowOn:{value:0},uPaneZ:{value:1.5}}}var Be=`
uniform sampler2D uLight;
uniform sampler2D uLightBlur;
uniform sampler2D uLightDefocus;
uniform float uDefocus;
uniform vec4 uLightRect;
uniform vec2 uPaneOrigin;
uniform vec2 uSunXY;
uniform float uSunE;
uniform vec3 uSunColor;
uniform vec3 uWallAlbedo;
uniform vec4 uBounce;
uniform sampler2D uShadow;
uniform mat4 uShadowMat;
uniform float uShadowOn;
uniform float uPaneZ;

// UV of a wall point (world x, y on z = 0) in the light target; the w component fades the rim.
vec3 benchLightUv( vec2 wall ) {
  vec2 uv = ( wall - uPaneOrigin - uLightRect.xy ) / uLightRect.zw;
  vec2 e = smoothstep( vec2( 0.0 ), vec2( 0.03 ), uv ) * smoothstep( vec2( 0.0 ), vec2( 0.03 ), 1.0 - uv );
  return vec3( uv, e.x * e.y );
}

// Linear sunlight on the wall at this point (irradiance, before albedo), sharp or blurred.
vec3 benchWallLight( vec2 wall, float blur ) {
  vec3 u = benchLightUv( wall );
  if ( u.z <= 0.0 ) return vec3( 0.0 );
  // Out of focus the name melts into soft light (the in-focus caustic, blurred), never noise.
  vec3 c = uDefocus >= 0.999 ? texture2D( uLightDefocus, u.xy ).rgb : texture2D( uLight, u.xy ).rgb;
  if ( uDefocus > 0.001 && uDefocus < 0.999 ) c = mix( c, texture2D( uLightDefocus, u.xy ).rgb, uDefocus );
  if ( blur > 0.0 ) c = mix( c, texture2D( uLightBlur, u.xy ).rgb, clamp( blur, 0.0, 1.0 ) );
  return c * uSunE * u.z;
}

// The blurred light only (one fetch): glossy reflections of the patch on rough surfaces.
vec3 benchWallLightSoft( vec2 wall ) {
  vec3 u = benchLightUv( wall );
  if ( u.z <= 0.0 ) return vec3( 0.0 );
  return texture2D( uLightBlur, u.xy ).rgb * uSunE * u.z;
}

// 1 = lit, 0 = shadowed by something standing in the beam (orthographic map along the sun).
float benchBeamShadow( vec3 p ) {
  if ( uShadowOn < 0.5 ) return 1.0;
  vec4 s = uShadowMat * vec4( p, 1.0 );
  vec3 q = s.xyz * 0.5 + 0.5;
  if ( q.x <= 0.0 || q.y <= 0.0 || q.x >= 1.0 || q.y >= 1.0 ) return 1.0;
  float bias = 0.0025;
  vec2 texel = vec2( 1.0 / 512.0 );
  float lit = 0.0;
  lit += step( q.z - bias, texture2D( uShadow, q.xy ).r );
  lit += step( q.z - bias, texture2D( uShadow, q.xy + vec2( texel.x, 0.0 ) * 1.5 ).r );
  lit += step( q.z - bias, texture2D( uShadow, q.xy - vec2( texel.x, 0.0 ) * 1.5 ).r );
  lit += step( q.z - bias, texture2D( uShadow, q.xy + vec2( 0.0, texel.y ) * 1.5 ).r );
  lit += step( q.z - bias, texture2D( uShadow, q.xy - vec2( 0.0, texel.y ) * 1.5 ).r );
  return lit / 5.0;
}

// The beam at a point between the pane and the wall: the light it carries toward the wall there
// (sampled where that ray lands), shadowed by what stands in front of the point.
vec3 benchBeam( vec3 p ) {
  if ( p.z >= uPaneZ || p.z < -0.01 ) return vec3( 0.0 );
  vec2 wall = p.xy + max( p.z, 0.0 ) * uSunXY;
  return benchWallLight( wall, 0.0 ) * benchBeamShadow( p );
}

// Radiance reflected off the lit wall along a world ray (glossy reflections of the name).
vec3 benchReflect( vec3 p, vec3 r, float roughness ) {
  if ( r.z > -1e-3 ) return vec3( 0.0 );
  float t = -p.z / r.z;
  vec3 hit = p + t * r;
  if ( hit.y < 0.0 ) return vec3( 0.0 );
  float blur = clamp( roughness * 2.2 + t * roughness * 0.6, 0.0, 1.0 );
  return uWallAlbedo * uSunColor * benchWallLight( hit.xy, blur ) * ( 1.0 / 3.14159265 );
}

// Irradiance from the lit patch treated as a small Lambertian emitter facing +z.
vec3 benchBounce( vec3 p, vec3 n ) {
  vec3 c = vec3( uBounce.xy, 0.02 );
  vec3 d = c - p;
  float r2 = max( dot( d, d ), 0.35 );
  vec3 l = d * inversesqrt( r2 );
  float cosE = max( -l.z, 0.0 );
  float cosR = max( dot( n, l ), 0.0 );
  return uSunColor * uWallAlbedo * ( uBounce.z * cosE * cosR / ( 3.14159265 * r2 ) );
}
`,Ve=`
float bHash( vec2 p ) { return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 ); }
float bNoise( vec2 p ) {
  vec2 i = floor( p ), f = fract( p );
  vec2 u = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( bHash( i ), bHash( i + vec2( 1, 0 ) ), u.x ), mix( bHash( i + vec2( 0, 1 ) ), bHash( i + vec2( 1, 1 ) ), u.x ), u.y );
}
mat2 bRot( float a ) { float c = cos( a ), s = sin( a ); return mat2( c, -s, s, c ); }
`,He=`
varying vec3 vWorld;
void main() {
  vec4 wp = modelMatrix * vec4( position, 1.0 );
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,Ue=`
  #include <tonemapping_fragment>
  gl_FragColor.rgb = readableDisplay( gl_FragColor.rgb, bMask );
  #include <colorspace_fragment>
`;function We(e,t,n){return new w({name:`bench-wall`,uniforms:{...e,...t,uAlbedo:{value:n},uTint:{value:new S(.66,.655,.64)},uAmbient:{value:new S(.22,.25,.265)},uCarriage:{value:new a(0,1.5,.35,0)}},vertexShader:He,fragmentShader:`
      #include <common>
      #include <readable_pars_fragment>
      ${Be}
      ${Ve}
      uniform sampler2D uAlbedo;
      uniform vec3 uTint;
      uniform vec3 uAmbient;
      uniform vec4 uCarriage; // x, z of the carriage, its half width, unused
      varying vec3 vWorld;
      void main() {
        vec2 w = vWorld.xy;
        // Two tilings (one rotated) and low-frequency value noise break up the repeat (2.7).
        vec3 a1 = texture2D( uAlbedo, w * 0.42 ).rgb;
        vec3 a2 = texture2D( uAlbedo, bRot( 0.61 ) * w * 0.17 + 0.37 ).rgb;
        float lf = bNoise( w * 0.55 ) * 0.6 + bNoise( w * 1.7 ) * 0.4;
        vec3 albedo = mix( a1, a2, 0.4 ) * uTint * ( 0.9 + 0.2 * lf );
        // Shade: brighter up high (the window is high behind the camera), darker in the corner
        // with the floor and toward the far ends of the wall.
        float up = smoothstep( -0.4, 4.6, w.y );
        float corner = 0.5 + 0.5 * smoothstep( 0.0, 0.8, w.y );
        // The window is high behind the camera, a little to the left: the shade falls off to the right.
        float side = 1.0 - 0.55 * smoothstep( 1.0, 7.0, w.x ) - 0.4 * smoothstep( 2.5, 8.0, -w.x );
        vec3 E = uAmbient * ( 0.5 + 0.8 * up ) * corner * side;
        // Light scattered from the lit patch into the room returns as a faint warm halo around it.
        vec2 hd = ( w - uBounce.xy ) / vec2( 1.5, 1.1 );
        E += uSunColor * uWallAlbedo * ( uBounce.z * 0.07 * exp( -dot( hd, hd ) * 1.1 ) );
        // The carriage stands between the window and the wall: a very soft shade band.
        float cs = exp( -pow( ( w.x - uCarriage.x ) / ( 0.9 + uCarriage.y * 0.35 ), 2.0 ) ) * ( 1.0 - smoothstep( 0.4, 2.6, w.y ) );
        E *= 1.0 - 0.18 * cs / ( 1.0 + uCarriage.y * 0.4 );
        // The light, plus a little halation: sunlit plaster scatters light just past the strokes.
        vec3 L = ( benchWallLight( w, 0.0 ) + benchWallLightSoft( w ) * 0.22 ) * benchBeamShadow( vec3( w, 0.001 ) );
        float bMask = readableMask( readableUv() );
        L = readableCapLight( L, E, bMask );
        gl_FragColor = vec4( albedo * ( E + uSunColor * L ), 1.0 );
        // A fixed, very fine grain (a still image: nothing boils).
        gl_FragColor.rgb *= 1.0 + ( bHash( floor( gl_FragCoord.xy ) ) - 0.5 ) * 0.05;
        ${Ue}
      }
    `})}function Ge(e,t,n){return new w({name:`bench-floor`,uniforms:{...e,...t,uAlbedo:{value:n},uTint:{value:new S(.5,.5,.49)},uAmbient:{value:new S(.2,.225,.24)},uGloss:{value:.7},uBlobs:{value:Array.from({length:14},()=>new a)},uBlobCount:{value:0},uCarriageBox:{value:new a(-.32,1.14,.32,1.86)},uRail:{value:new a(.98,.3,1.38,5.2)}},vertexShader:He,fragmentShader:`
      #include <common>
      #include <readable_pars_fragment>
      ${Be}
      ${Ve}
      uniform sampler2D uAlbedo;
      uniform vec3 uTint;
      uniform vec3 uAmbient;
      uniform float uGloss;
      uniform vec4 uBlobs[ 14 ]; // x, z, radius, strength
      uniform int uBlobCount;
      uniform vec4 uCarriageBox;            // x0, z0, x1, z1
      uniform vec4 uRail;
      varying vec3 vWorld;

      float boxAo( vec2 p, vec4 b, float soft ) {
        vec2 c = 0.5 * ( b.xy + b.zw );
        vec2 h = 0.5 * ( b.zw - b.xy );
        vec2 q = abs( p - c ) - h;
        float d = length( max( q, 0.0 ) ) + min( max( q.x, q.y ), 0.0 );
        return smoothstep( -0.02, soft, d );
      }

      void main() {
        vec2 p = vWorld.xz;
        vec3 a1 = texture2D( uAlbedo, p * 0.34 ).rgb;
        vec3 a2 = texture2D( uAlbedo, bRot( 1.1 ) * p * 0.13 + 0.21 ).rgb;
        float lf = bNoise( p * 0.4 ) * 0.7 + bNoise( p * 2.3 ) * 0.3;
        vec3 albedo = mix( a1, a2, 0.45 ) * uTint * ( 0.88 + 0.24 * lf );

        // Contact shadows: pieces, the stand, the carriage base, the rail.
        float ao = 1.0;
        for ( int i = 0; i < 14; i ++ ) {
          if ( i >= uBlobCount ) break;
          vec4 b = uBlobs[ i ];
          float d = length( p - b.xy );
          ao *= 1.0 - b.w * ( 1.0 - smoothstep( b.z * 0.35, b.z * 1.9, d ) );
        }
        ao *= 0.35 + 0.65 * boxAo( p, uCarriageBox, 0.5 );
        ao *= 0.75 + 0.25 * boxAo( p, uRail, 0.12 );
        // The wall corner, and the room falling off into shade away from the set.
        ao *= 0.6 + 0.4 * smoothstep( 0.0, 0.9, p.y );
        float room = 1.0 - 0.5 * smoothstep( 1.5, 7.0, abs( p.x - 0.2 ) ) - 0.35 * smoothstep( 3.0, 10.0, p.y );

        vec3 E = uAmbient * ao * room + benchBounce( vWorld, vec3( 0.0, 1.0, 0.0 ) ) * ( 0.4 + 0.6 * ao );
        vec3 col = albedo * E;

        // Polished concrete reflects the lit wall, blurred by its roughness, with Fresnel.
        vec3 V = normalize( cameraPosition - vWorld );
        vec2 g = vec2( bNoise( p * 9.0 ) - 0.5, bNoise( p * 9.0 + 17.0 ) - 0.5 );
        vec3 N = normalize( vec3( g.x * 0.05, 1.0, g.y * 0.05 ) );
        vec3 R = reflect( -V, N );
        float F = 0.04 + 0.96 * pow( 1.0 - max( dot( N, V ), 0.0 ), 5.0 );
        // Rough polish: the farther the reflected ray travels, the wider the blur (a few taps).
        vec3 refl = vec3( 0.0 );
        if ( R.z < -1e-3 ) {
          float t = -vWorld.z / R.z;
          vec3 hit = vWorld + t * R;
          float spread = 0.05 + 0.12 * t;
          refl += benchWallLightSoft( hit.xy ) * 0.4;
          refl += benchWallLightSoft( hit.xy + vec2( spread, spread * 0.8 ) ) * 0.3;
          refl += benchWallLightSoft( hit.xy - vec2( spread, spread * 0.8 ) ) * 0.3;
          // Long reflected paths blur out and fade (rough polish, not a mirror).
          refl *= uWallAlbedo * uSunColor * step( 0.0, hit.y ) * exp( -t * 0.85 );
        }
        // The shaded wall itself, faintly, so the floor reads as polished even away from the light.
        refl += uWallAlbedo * uAmbient * 0.9 * step( R.z, -1e-3 );
        col += refl * F * uGloss * ao;

        float bMask = readableMask( readableUv() );
        gl_FragColor = vec4( col, 1.0 );
        gl_FragColor.rgb *= 1.0 + ( bHash( floor( gl_FragCoord.xy ) + 3.7 ) - 0.5 ) * 0.05;
        ${Ue}
      }
    `})}function Ke(e){return new w({name:`bench-haze`,transparent:!0,depthWrite:!1,blending:2,uniforms:{...e,uPlanes:{value:Array.from({length:6},()=>new a)},uDensity:{value:.05},uColor:{value:new S(1,.86,.66)},uHand:{value:new a(0,0,0,0)},uHandOn:{value:0},uPane:{value:new a(0,2.4,1.5,0)},uSunXY:{value:new _(.12,-.45)}},vertexShader:He,fragmentShader:`
      #include <common>
      #include <readable_pars_fragment>
      ${Ve}
      uniform vec4 uPlanes[ 6 ];
      uniform float uDensity;
      uniform vec3 uColor;
      uniform vec4 uHand;     // hand rect in pane coordinates: x0, y0, x1, y1
      uniform float uHandOn;
      uniform vec4 uPane;     // pane centre x, y, pane plane z, unused
      uniform vec2 uSunXY;
      varying vec3 vWorld;
      void main() {
        vec3 dir = normalize( vWorld - cameraPosition );
        float tExit = 1e4;
        for ( int i = 0; i < 6; i ++ ) {
          float dn = dot( uPlanes[ i ].xyz, dir );
          if ( dn > 1e-5 ) tExit = min( tExit, -( dot( uPlanes[ i ].xyz, vWorld ) + uPlanes[ i ].w ) / dn );
        }
        float len = clamp( tExit, 0.0, 6.0 );
        // Sample the hand's shadow at a few points along the path through the beam.
        float lit = 0.0;
        for ( int k = 0; k < 4; k ++ ) {
          vec3 p = vWorld + dir * len * ( float( k ) + 0.5 ) / 4.0;
          vec2 q = p.xy - uSunXY * ( uPane.z - p.z ) - uPane.xy;
          float inHand = uHandOn * step( uHand.x, q.x ) * step( q.x, uHand.z ) * step( uHand.y, q.y ) * step( q.y, uHand.w );
          lit += 1.0 - inHand * 0.85;
        }
        lit *= 0.25;
        float dust = 0.8 + 0.4 * bNoise( vWorld.xy * 3.0 + vWorld.z );
        float a = uDensity * len * lit * dust;
        float bMask = readableMask( readableUv() );
        gl_FragColor = vec4( uColor * a, 1.0 );
        ${Ue}
      }
    `})}function qe(e,t,n){return new w({name:`bench-mist`,transparent:!0,depthWrite:!1,uniforms:{...e,...t,uMist:{value:n},uAmount:{value:0},uLit:{value:new S(.62,.6,.57)},uSeed:{value:0}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,fragmentShader:`
      #include <common>
      #include <readable_pars_fragment>
      ${Ve}
      uniform sampler2D uMist;
      uniform float uAmount;
      uniform vec3 uLit;
      uniform float uSeed;
      varying vec2 vUv;
      void main() {
        float m = texture2D( uMist, vUv ).r * uAmount;
        if ( m < 0.003 ) discard;
        // Droplet grain: a fine cellular speckle, brighter where drops catch the sun.
        vec2 q = vUv * vec2( 330.0, 220.0 ) + uSeed;
        vec2 cell = floor( q );
        vec2 f = fract( q ) - 0.5 - 0.35 * ( vec2( bHash( cell ), bHash( cell + 7.3 ) ) - 0.5 );
        float drop = smoothstep( 0.32, 0.05, length( f ) );
        float grain = 0.82 + 0.3 * drop + 0.1 * bNoise( vUv * vec2( 40.0, 26.0 ) + uSeed );
        vec3 col = uLit * grain;
        float a = clamp( pow( m, 1.35 ) * 0.95, 0.0, 0.95 );
        float bMask = readableMask( readableUv() );
        gl_FragColor = vec4( col, a );
        ${Ue}
      }
    `})}function Je(){return new w({name:`bench-beam-depth`,vertexShader:`
      varying float vDepth;
      void main() {
        vec4 p = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        vDepth = p.z / p.w * 0.5 + 0.5;
        gl_Position = p;
      }
    `,fragmentShader:`
      varying float vDepth;
      void main() { gl_FragColor = vec4( vDepth, 0.0, 0.0, 1.0 ); }
    `})}function Ye(e,t){return!(e instanceof u)&&!(e instanceof ue)?e:h(e,`bench-light`,e=>{Object.assign(e.uniforms,t),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vBenchWorld;`).replace(`#include <project_vertex>`,`#include <project_vertex>
        {
          vec4 bw = vec4( transformed, 1.0 );
          #ifdef USE_INSTANCING
            bw = instanceMatrix * bw;
          #endif
          vBenchWorld = ( modelMatrix * bw ).xyz;
        }`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\nvarying vec3 vBenchWorld;\n${Be}`).replace(`#include <lights_fragment_end>`,`{
          vec3 bN = inverseTransformDirection( geometryNormal, viewMatrix );
          vec3 bV = inverseTransformDirection( geometryViewDir, viewMatrix );
          #if defined( RE_IndirectSpecular )
            radiance += benchReflect( vBenchWorld, reflect( -bV, bN ), material.roughness );
            #ifdef USE_CLEARCOAT
              vec3 bC = inverseTransformDirection( geometryClearcoatNormal, viewMatrix );
              clearcoatRadiance += benchReflect( vBenchWorld, reflect( -bV, bC ), material.clearcoatRoughness );
            #endif
          #endif
          #if defined( RE_IndirectDiffuse )
            irradiance += benchBounce( vBenchWorld, bN );
          #endif
          vec3 beam = benchBeam( vBenchWorld ) * uSunColor;
          if ( dot( beam, beam ) > 0.0 ) {
            IncidentLight bl;
            bl.direction = normalize( ( viewMatrix * vec4( -uSunXY, 1.0, 0.0 ) ).xyz );
            bl.color = beam;
            bl.visible = true;
            RE_Direct( bl, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
          }
        }
        #include <lights_fragment_end>`)})}var Xe=2.3,Ze=new S(.62,.6,.57),Qe=.22,$e=.08,Q=.17,et=typeof location<`u`&&new URLSearchParams(location.search).get(`benchglass`)===`0`,tt=typeof location<`u`&&new URLSearchParams(location.search).has(`benchprof`),nt=[{model:`f-faceted`,material:`glass`,size:.36,x:-1.1,z:1.62,yaw:.4},{model:`c-pebbles`,material:`lacquer`,size:.32,x:-.68,z:1.9,yaw:2.2},{model:`e-wave`,material:`pearl`,size:.38,x:-1.5,z:2,yaw:.2},{model:`a-folded`,material:`graphite`,size:.32,x:-1.02,z:2.24,yaw:-.6},{model:`b-stepped`,material:`glass`,size:.28,x:-.52,z:2.42,yaw:.9},{model:`d-arch`,material:`lacquer`,size:.28,x:-1.62,z:1.46,yaw:-1.3},{model:`torus`,material:`pearl`,size:.22,x:-.86,z:2.72,yaw:.2},{model:`superellipsoid`,material:`graphite`,size:.2,x:-1.38,z:2.66,yaw:2.6}],rt=[{model:`f-faceted`,material:`glass`,size:.26,x:-.08,z:.02,yaw:.9},{model:`c-pebbles`,material:`lacquer`,size:.22,x:.12,z:-.03,yaw:2.4}],$={height:.32,fall:.34,stagger:.07},it=e=>e>=3?`t3`:e===2?`t2`:`t1`,at=e=>{let t=j[it(e)];return{...t,kawaseSteps:t.kawaseSteps+1}},ot=`
precision highp float;
in vec3 position;
out vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,st=`
precision highp float;
in vec2 vUv;
uniform sampler2D uSrc;
uniform vec2 uStep;
out vec4 fragColor;
void main() {
  vec3 c = texture(uSrc, vUv).rgb * 0.227;
  c += (texture(uSrc, vUv + uStep * 1.38).rgb + texture(uSrc, vUv - uStep * 1.38).rgb) * 0.316;
  c += (texture(uSrc, vUv + uStep * 3.23).rgb + texture(uSrc, vUv - uStep * 3.23).rgb) * 0.07;
  fragColor = vec4(c, 1.0);
}
`,ct=`
precision highp float;
in vec2 vUv;
uniform sampler2D uSrc;
uniform vec2 uTexel;
out vec4 fragColor;
void main() {
  vec3 c = texture(uSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb + texture(uSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb;
  c += texture(uSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb + texture(uSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb;
  fragColor = vec4(c * 0.25, 1.0);
}
`,lt=`
precision highp float;
in vec2 vUv;
uniform sampler2D uSrc;
uniform vec2 uStep;
out vec4 fragColor;
void main() {
  vec3 acc = vec3(0.0);
  float sum = 0.0;
  for (int i = -12; i <= 12; i++) {
    float x = float(i);
    float w = exp(-x * x / 32.0);
    acc += texture(uSrc, vUv + uStep * x).rgb * w;
    sum += w;
  }
  fragColor = vec4(acc / sum, 1.0);
}
`,ut={max:.07,scale:.22},dt=.55;function ft(e){e.isXRRenderTarget=!0}var pt=class{ctx;bridge;scene=new E;camera=new le(35,16/9,.05,60);uniforms=ze();disposables=[];materials=[];caustic;lightRT=null;blurA=null;blurB=null;shadowRT=null;blurScene=new E;blurCamera=new M;blurMat;dq0=null;dqA=null;dqB=null;downMat;gaussMat;passScene=new E;passQuad;downDirty=!0;defocusDirty=!0;shadowCamera=new M(-.5,.5,.5,-.5,.01,8);shadowScene=new E;depthMat;carriage=new b;squeegee=new b;stand=new b;standRod;standTop=new b;mistMesh;mistTexture;mistMaterial;floorMaterial;wallMaterial;glass;paneNormal=null;haze;hazeMaterial;hazeKey=``;bounceLight;pieces=[];pile=new we;piecesSource=`none`;dist=new p({omega:14,zeta:.9});blade=new p({omega:16,zeta:1});mistAmount=new p({omega:5,zeta:1});standIn=new p(`pane`);handX=new p(`occluder`);handY=new p(`occluder`);pushMix=new p({omega:2.4,zeta:1});camMix=new p({omega:3.2,zeta:1});eyeSun={x:.12,y:-.45};handOn=!1;glintT=-1;dStar=1.5;sun={x:.12,y:-.45};paneId=-1;paneKind=null;mistVersion=-1;lastPhase=``;lastStudioLocked=!1;causticDirty=!0;shadowDirty=!0;cameraDirty=!0;frame=null;frameTarget=null;snapFrame=!0;layoutDirty=!0;size=null;aspect=16/9;clearRight=1;pusherId=-1;lastT=0;tier=2;causticMs=0;renderMs=0;frames=0;awake=!1;unsubs=[];warmStats={programs:0,ms:0,longestMs:0};arriveAt=-1;disposed=!1;v3=new o;constructor(e,t){this.ctx=e,this.bridge=t}async init(e){let t=e=>this.bridge.mark?.(e);t(`init`);let n=e.engine;this.tier=n.tier;let r=n.tier,i=[...new Set([...nt,...rt].map(e=>e.model))],a=Promise.all(i.map(async t=>[t,await _e(t,{lod:`t1`,signal:e.signal})])),[o,d,p,m]=await Promise.all([n.whenEnvironment(`room`),n.whenEnvironment(`glass`),f(`plaster`,{tier:r,compact:e.engine.caps.compact,signal:e.signal}),f(`concrete`,{tier:r,compact:e.engine.caps.compact,signal:e.signal})]);t(`assets`),e.trackMemory(`bench textures`,p.bytes+m.bytes),s(e.renderer,p.texture),s(e.renderer,m.texture),this.scene.environment=o,this.scene.environmentIntensity=.55;let h=new g(new S(`#b9c6cb`),new S(`#2c2d2a`),.35),v=new re(new S(`#d9e2e6`),.5);v.position.set(-3.5,6,9),this.bounceLight=new ie(new S(1,.8,.58),0,7,1.6),this.scene.add(h,v,this.bounceLight),this.caustic=new ce(e.renderer,{quality:at(r)}),this.allocTargets(),this.blurMat=new ne({glslVersion:ge,vertexShader:ot,fragmentShader:st,blending:0,depthTest:!1,depthWrite:!1,uniforms:{uSrc:{value:null},uStep:{value:new _}}});let y=new l(new de(2,2),this.blurMat);y.frustumCulled=!1,this.blurScene.add(y),this.disposables.push(y.geometry,this.blurMat);let b=(e,t)=>new ne({glslVersion:ge,vertexShader:ot,fragmentShader:e,blending:0,depthTest:!1,depthWrite:!1,uniforms:t});this.downMat=b(ct,{uSrc:{value:null},uTexel:{value:new _}}),this.gaussMat=b(lt,{uSrc:{value:null},uStep:{value:new _}}),this.passQuad=new l(y.geometry,this.downMat),this.passQuad.frustumCulled=!1,this.passScene.add(this.passQuad),this.disposables.push(this.downMat,this.gaussMat);let x=this.uniforms;x.uSunE.value=Xe*8,x.uWallAlbedo.value.copy(Ze),x.uPaneOrigin.value.set(B.x,B.y);let C=e.readable.uniforms;this.wallMaterial=We(x,C,p.texture);let w=new l(new de(40,7),this.wallMaterial);w.position.set(.2,3.5,0),this.floorMaterial=Ge(x,C,m.texture);let T=new l(new de(40,20),this.floorMaterial);T.rotation.x=-Math.PI/2,T.position.set(.2,0,10),this.scene.add(w,T),this.disposables.push(w.geometry,T.geometry,this.wallMaterial,this.floorMaterial);let E=this.bench(new u({color:new S(`#2a2f2d`),roughness:.52,metalness:.45,envMapIntensity:1.1})),se=this.bench(new u({color:new S(`#262a29`),roughness:.36,metalness:.6,envMapIntensity:1.2})),le=this.bench(new u({color:new S(`#0b0d0c`),roughness:.75,metalness:0})),D=this.bench(pe(`lacquer`,{tier:r}));this.materials.push(D),this.disposables.push(E,se,le,D);let O=new l(Me(),se);this.scene.add(O),this.disposables.push(O.geometry);let k=new l(Ne(),E),A=new l(Pe(),D);this.glass=this.bench(new ue({name:`bench-pane`,envMap:d,depthWrite:!1,normalMap:yt()})),vt(this.glass,r);let j=this.bench(new ue({name:`bench-pane-edge`,color:new S(ee.edge),emissive:new S(ee.edgeLight),emissiveIntensity:.55,metalness:0,roughness:.12,envMap:d,envMapIntensity:1.4,transparent:!0,opacity:.92}));this.disposables.push(j);let M=new l(Le(),[j,j,j,j,this.glass,this.glass]);M.renderOrder=1,M.position.set(B.x,B.y,Te),this.mistTexture=new oe(this.bridge.mist.canvas),this.mistTexture.minFilter=c,this.mistTexture.magFilter=c,this.mistTexture.generateMipmaps=!1,this.mistMaterial=qe(x,C,this.mistTexture),this.mistMesh=new l(Re(),this.mistMaterial),this.mistMesh.position.set(B.x,B.y,Te+V.thickness/2+.0015),this.mistMesh.renderOrder=2,this.hazeMaterial=Ke(C);let N=new te;N.setAttribute(`position`,new fe(new Float32Array(24),3)),N.setIndex([0,1,3,0,3,2,4,6,7,4,7,5,0,4,5,0,5,1,2,3,7,2,7,6,0,2,6,0,6,4,1,5,7,1,7,3]),this.haze=new l(N,this.hazeMaterial),this.haze.frustumCulled=!1,this.haze.renderOrder=3,this.hazeMaterial.side=2,this.scene.add(this.haze),this.disposables.push(N,this.hazeMaterial);let P=Fe();this.squeegee.add(new l(P.steel,E),new l(P.rubber,le),new l(P.grip,D)),this.carriage.add(k,A,M,this.mistMesh,this.squeegee),this.scene.add(this.carriage),this.disposables.push(k.geometry,A.geometry,M.geometry,this.mistMesh.geometry,this.mistMaterial,this.mistTexture,this.glass),this.disposables.push(P.steel,P.rubber,P.grip);let F=Ie();this.standRod=new l(F.rod,E),this.stand.add(new l(F.foot,E),this.standRod,this.standTop),this.standTop.add(new l(F.top,E)),this.scene.add(this.stand),this.disposables.push(F.foot,F.rod,F.top);let I=await Promise.race([a,Promise.resolve(null)]);I&&this.placePieces(this.buildPieces(new Map(I),d),!1),t(`models`),this.depthMat=Je(),this.disposables.push(this.depthMat),this.shadowRT=new ae(512,512,{type:he,format:me,depthBuffer:!0,minFilter:c,magFilter:c}),x.uShadow.value=this.shadowRT.texture;let L=this.bridge.getState();this.syncPane(),this.dist.snap(L.distance*this.dStar),this.blade.snap(L.blade),this.standIn.snap(+!!this.standWanted(L)),this.mistAmount.snap(+!!this.mistWanted(L)),this.eyeSun=this.eyeSunFor(L),this.camMix.snap(+!!this.needsLowEye()),this.pushMix.snap(L.phase===`locked`||L.phase===`studio`&&L.studioLocked?1:0),this.lastPhase=L.phase,this.lastStudioLocked=L.studioLocked;let R=()=>e.invalidate();this.unsubs.push(this.bridge.subscribe(R),this.bridge.onPane(R),this.bridge.mist.onChange(R),this.bridge.onInput(R)),this.fitCamera(),this.applyTransforms(),await e.compile(this.scene,this.camera,{transmission:!0}),t(`compiled`),this.warmLight();let ve=await this.warmPrograms(this.scene,this.scene);ve&&(this.warmStats=ve),t(`warmed`),this.bridge.setView(this),(async()=>{I||await this.joinPieces(a,d),await this.warmNeighbourTiers()})()}async quiet(){for(;this.bridge.getState().pointer&&!this.ctx.signal.aborted;)await new Promise(e=>setTimeout(e,120));await new Promise(e=>{`requestIdleCallback`in window?requestIdleCallback(()=>e(),{timeout:400}):setTimeout(e,16)})}async warmNeighbourTiers(){for(let e of[1,2]){if(e===this.tier)continue;if(await this.quiet(),this.ctx.signal.aborted||this.disposed||!this.caustic)return;let t=performance.now();this.caustic.setQuality(at(e));try{this.warmLight()}finally{this.caustic.setQuality(at(this.tier)),this.causticDirty=!0,this.shadowDirty=!0}tt&&console.info(`[bench] warmed the T${e} light in ${(performance.now()-t).toFixed(0)} ms`)}this.ctx.invalidate()}buildPieces(e,t){let n=this.tier,r=new Set,i=e=>{let r=this.bench(pe(e,e===`glass`?{tier:et?1:n,envMap:t??void 0,thickness:.3}:{tier:n}));return this.materials.push(r),this.disposables.push(r),r};return{pile:nt.map(t=>{let n=e.get(t.model);r.add(n.source);let a=new l(n.geometry,i(t.material));a.scale.setScalar(t.size);let o=n.geometry.boundingBox??(n.geometry.computeBoundingBox(),n.geometry.boundingBox),s=Math.max(o.max.x-o.min.x,o.max.z-o.min.z)*.5*t.size*.92;return a.position.set(t.x,0,t.z),{mesh:a,x:t.x,z:t.z,r:Math.max(.05,s),yaw:t.yaw+n.yaw}}),stand:rt.map(t=>{let n=e.get(t.model);r.add(n.source);let a=new l(n.geometry,i(t.material));return a.scale.setScalar(t.size),a.position.set(t.x,0,t.z),a.rotation.y=t.yaw+n.yaw,a}),source:[...r].join(`+`)}}placePieces(e,t){for(let t of e.pile)this.pile.add(t.x,t.z,t.r,t.yaw),this.pieces.push(t.mesh),this.scene.add(t.mesh);for(let t of e.stand)this.standTop.add(t);this.piecesSource=e.source,this.shadowDirty=!0,this.arriveAt=t&&!this.ctx.engine.still?performance.now():-1}async joinPieces(e,t){let n;try{n=await e}catch{return}if(this.ctx.signal.aborted||this.disposed)return;let r=this.buildPieces(new Map(n),t),i=new E;i.environment=this.scene.environment,i.environmentIntensity=this.scene.environmentIntensity;for(let e of this.scene.children)e.isLight&&i.add(e.clone());let a=new b;for(let e of r.pile)a.add(e.mesh);for(let e of r.stand)a.add(e);i.add(a);try{if(await this.ctx.compile(i,this.camera,{transmission:!0}),this.ctx.signal.aborted||this.disposed)return;await this.warmPrograms(a,i)}catch(e){console.warn(`[bench] pieces not warmed:`,e)}finally{a.clear(),O(this.ctx.renderer,i)}if(!(this.ctx.signal.aborted||this.disposed)){for(let e of r.pile)e.mesh.position.set(e.x,0,e.z);this.placePieces(r,!0),this.bridge.mark?.(`pieces`),this.ctx.invalidate()}}warmLight(){let e=this.ctx.renderer,t=e.getRenderTarget(),n=new S;e.getClearColor(n);let r=e.getClearAlpha();try{this.renderLight(e,this.dist.value,{mist:1}),this.renderLight(e,this.dist.value),this.renderShadow(e),this.causticDirty=!1,this.shadowDirty=!1}finally{e.setRenderTarget(t),e.setClearColor(n,r)}}async warmPrograms(e,t){let n=this.ctx.renderer,r=Math.min(4,this.ctx.engine.quality.stageMsaa),i=new ae(64,64,{type:he,format:me,samples:r,depthBuffer:!0,colorSpace:m});ft(i);let a=new E;a.environment=this.scene.environment,a.environmentIntensity=this.scene.environmentIntensity;let o=this.scene.children.filter(e=>e.isLight),s=new Set,c=[];e.updateMatrixWorld(!0),e.traverse(e=>{let t=e;if(!t.isMesh)return;let r=n.properties.get(t.material).currentProgram??t.material;s.has(r)||(s.add(r),c.push(t))});let u=performance.now(),d=0,f=async()=>{for(;this.bridge.getState().pointer&&!this.ctx.signal.aborted;)await new Promise(e=>setTimeout(e,120));await new Promise(e=>{this.ctx.visible||!(`requestIdleCallback`in window)?setTimeout(e,0):requestIdleCallback(()=>e(),{timeout:120})})},p=e=>{let t=performance.now(),r=n.getRenderTarget();n.setRenderTarget(i),n.render(e,this.camera),n.setRenderTarget(r);let a=performance.now()-t;return d=Math.max(d,a),a};try{for(let e of c){if(this.ctx.signal.aborted)return null;await f();let t=new l(e.geometry,e.material);t.matrixAutoUpdate=!1,t.matrix.copy(e.matrixWorld),t.matrixWorld.copy(e.matrixWorld),a.add(t,...o.map(e=>e.clone()));let r=p(a);if(O(n,a),a.clear(),tt){let t=Array.isArray(e.material)?e.material[e.material.length-1]:e.material;console.info(`[bench] warm ${t.name||t.type} ${r.toFixed(0)} ms`)}}await f();let e=p(t);tt&&console.info(`[bench] warm full scene ${e.toFixed(0)} ms`)}finally{i.dispose(),O(n,a),O(n,t)}let h={programs:c.length,ms:Math.round(performance.now()-u),longestMs:Math.round(d)};return tt&&console.info(`[bench] warmed ${c.length} programs in ${h.ms} ms, longest slice ${h.longestMs} ms`),h}bench(e){return Ye(e,this.uniforms),this.ctx.readable.patch(e)}allocTargets(){let e=this.caustic.currentQuality,t=e.size,n=Math.round(e.size*(V.height+2*Qe)/(V.width+2*Qe)),r=this.caustic.format;this.lightRT?.dispose(),this.blurA?.dispose(),this.blurB?.dispose(),this.lightRT=A(t,n,r);let i=Math.max(16,Math.round(t/4)),a=Math.max(16,Math.round(n/4));this.blurA=A(i,a,r),this.blurB=A(i,a,r),this.dq0?.dispose(),this.dqA?.dispose(),this.dqB?.dispose(),this.dq0=A(i,a,r),this.dqA=A(i,a,r),this.dqB=A(i,a,r),this.uniforms.uLightDefocus.value=this.dqB.texture,this.uniforms.uLight.value=this.lightRT.texture,this.uniforms.uLightBlur.value=this.blurB.texture;let o=r===`rgba16f`?8:4;this.ctx.trackMemory(`bench light`,(t*n+5*i*a)*o+3145728),this.causticDirty=!0,this.downDirty=!0,this.defocusDirty=!0}resize(e){this.size=e;let t=e.width/Math.max(1,e.height);Math.abs(t-this.aspect)>.001&&(this.snapFrame=!0),this.aspect=t,this.cameraDirty=!0,this.layoutDirty=!0}onTierChange(e,t){if(this.tier=e,this.caustic){this.caustic.setQuality(at(e)),this.allocTargets();for(let t of this.materials)T(t,e);return vt(this.glass,e),this.ctx.compile(this.scene,this.camera,{transmission:!0})}}onStillChange(){this.ctx.invalidate()}release(){O(this.ctx.renderer,this.scene)}dispose(){this.disposed=!0,this.bridge.setView(null),this.unsubs.forEach(e=>e()),this.unsubs=[],O(this.ctx.renderer,this.scene),this.caustic?.dispose(),this.lightRT?.dispose(),this.blurA?.dispose(),this.blurB?.dispose(),this.dq0?.dispose(),this.dqA?.dispose(),this.dqB?.dispose(),this.shadowRT?.dispose(),this.glass?.normalMap?.dispose(),this.disposables.forEach(e=>e.dispose())}mistWanted(e){return this.paneKind===`visitor`||this.paneKind===`studio`&&e.studioMist!==`off`}mistLevel(){return this.paneKind?this.mistAmount.value:0}scatter(e){return this.mistLevel()*(1-.9*e.clear)}syncPane(){let e=this.bridge.getPane();if(!e||e.id===this.paneId)return!1;let t=e.sun.x!==this.sun.x||e.sun.y!==this.sun.y;this.paneId=e.id,this.paneKind=e.kind,this.caustic.setSolution(e.pane),this.dStar=e.pane.distance;let n=this.glass.normalMap;return this.paneNormal=_t(e),this.glass.normalMap=this.paneNormal,n?.dispose(),this.sun={x:e.sun.x,y:e.sun.y},this.uniforms.uSunXY.value.set(e.sun.x,e.sun.y),this.mistMaterial.uniforms.uSeed.value=e.seed%97*1.37,this.causticDirty=!0,this.shadowDirty=!0,t&&(this.cameraDirty=!0),!0}update(e,t){if(!this.caustic)return!1;let r=this.bridge.getState(),i=t.still,a=!1;this.syncPane()&&(this.paneKind===`visitor`?this.mistAmount.snap(0):this.mistWanted(r)&&this.mistAmount.snap(1)),this.mistAmount.target=+!!this.mistWanted(r),r.phase===`fogged`&&this.lastPhase!==`fogged`&&this.lastPhase!==`solving`&&(this.mistAmount.snap(0),this.mistAmount.target=1);let o=this.bridge.mist.version();o!==this.mistVersion&&(this.mistVersion=o,this.mistTexture.needsUpdate=!0,this.causticDirty=!0);let s=r.distance*this.dStar,c=r.pointer?.target===`carriage`;i||c?this.dist.snap(s):this.dist.target=s;let l=n(r)||r.pointer?.target===`squeegee`?r.blade:r.word===null&&r.studioMist===`off`?0:1;i||r.pointer?.target===`squeegee`?this.blade.snap(l):this.blade.target=l,this.standIn.target=+!!this.standWanted(r),i&&this.standIn.snap(),i&&this.mistAmount.snap();let u=this.bridge.input().hand??r.hand;if(u&&((!this.handOn||i)&&(this.handX.snap(u.x),this.handY.snap(u.y)),this.handX.target=u.x,this.handY.target=u.y),!!u!==this.handOn&&(this.causticDirty=!0),this.handOn=!!u,(r.phase===`locked`&&this.lastPhase!==`locked`||r.studioLocked&&!this.lastStudioLocked)&&!i&&(this.glintT=0),this.lastPhase=r.phase,this.lastStudioLocked=r.studioLocked,this.glintT>=0&&(this.glintT+=e,this.glintT>.3&&(this.glintT=-1),this.causticDirty=!0,a=!0),!r.pointer){let t=this.eyeSunFor(r);(t.x!==this.eyeSun.x||t.y!==this.eyeSun.y)&&(this.eyeSun=t,this.cameraDirty=!0),this.camMix.target=+!!this.needsLowEye();let n=r.phase===`locked`||r.phase===`studio`&&r.studioLocked;this.pushMix.target=+!!n,i&&(this.camMix.snap(),this.pushMix.snap()),this.camMix.step(e)&&(this.cameraDirty=!0,a=!0),this.pushMix.step(e)&&(this.cameraDirty=!0,a=!0)}for(let t of[this.dist,this.blade,this.mistAmount,this.standIn,this.handX,this.handY])t.step(e)&&(a=!0);(!this.dist.settled||this.dist.value!==this.lastT)&&(this.defocusDirty=!0,this.layoutDirty=!0),this.lastT=this.dist.value,this.blade.settled||(this.layoutDirty=!0),this.mistAmount.settled||(this.causticDirty=!0),this.standIn.settled||(this.shadowDirty=!0),u&&(!this.handX.settled||!this.handY.settled)&&(this.causticDirty=!0);let d=this.bridge.clearRight();Math.abs(d-this.clearRight)>.5&&(this.clearRight=d,this.cameraDirty=!0),this.cameraDirty&&this.fitCamera(),!r.pointer&&this.stepFrame(e)&&(a=!0);let f=i?null:this.bridge.input().push,p=null;if(f&&this.size){let e=this.rayToPlaneY(f.x,f.y,$e);e&&e.z>0&&e.z<3.6&&(p={x:e.x,z:e.z}),f.id!==this.pusherId&&(this.pusherId=f.id)}let m=this.dist.value,h=this.pile.step(e,{pusher:p,boxes:[{x0:K.x-K.halfWidth,z0:m-K.halfDepth,x1:K.x+K.halfWidth,z1:m+K.halfDepth},{x0:W-G.gauge/2-.09,z0:G.z0-.06,x1:W+G.gauge/2+.09,z1:G.z1}],circles:[{x:this.standX(),z:Q,r:.16}],now:t.time*1e3});for(let e of h)this.bridge.tap(e.index,e.strength);if((this.pile.awake||p)&&(a=!0),this.arriveAt>=0){let e=($.fall+$.stagger*this.pieces.length)*1e3;i||performance.now()-this.arriveAt>e?this.arriveAt=-1:a=!0}return this.applyTransforms(),this.awake=a,a}standWanted(e){return e.objectInLight?e.word===null?e.studioLocked:e.resultOpen&&e.phase===`locked`:!1}standX(){let e=B.x+this.dStar*this.sun.x+.05,t=e-1.3;return t+(e-t)*this.standIn.value}standHeight(){let e=B.y-V.height/2+this.dStar*this.sun.y,t=Math.max(.45,e-.06),n=.62;return n+(t-n)*this.standIn.value}applyTransforms(){let e=this.dist.value;this.carriage.position.set(0,0,e);let t=-V.width/2+J.bladeInset+this.blade.value*(V.width-2*J.bladeInset);this.squeegee.position.set(t,0,0);let n=this.standX(),r=this.standHeight();this.stand.position.set(n,0,Q),this.standRod.scale.set(1,r,1),this.standTop.position.set(0,r,0);let i=this.floorMaterial.uniforms.uBlobs.value,a=0,o=this.arriveAt>=0?(performance.now()-this.arriveAt)/1e3:1/0;this.pile.bodies.forEach((e,t)=>{let n=this.pieces[t];if(!n)return;let r=Math.min(1,Math.max(0,(o-t*$.stagger)/$.fall)),s=$.height*(1-r*r);n.position.set(e.x,s,e.z);let c=Math.cos(e.rockAxis),l=Math.sin(e.rockAxis);n.rotation.set(e.rock*l*.6,e.yaw,-e.rock*c*.6,`YXZ`),a<14&&i[a++].set(e.x,e.z,e.r*(1.05+s),.62*(1-.8*s/$.height))}),a<14&&i[a++].set(n,Q,.17,.55),this.floorMaterial.uniforms.uBlobCount.value=a,this.floorMaterial.uniforms.uCarriageBox.value.set(K.x-K.halfWidth-.04,e-K.halfDepth-.04,K.x+K.halfWidth+.04,e+K.halfDepth+.04),this.wallMaterial.uniforms.uCarriage.value.set(W,e,.3,0),this.uniforms.uPaneZ.value=e,this.mistMaterial.uniforms.uAmount.value=this.mistLevel(),this.updateHaze(e)}updateHaze(e){let t=`${e.toFixed(4)}|${this.sun.x}|${this.sun.y}`;if(t===this.hazeKey||!this.haze)return;this.hazeKey=t;let n=V.width/2,r=V.height/2,i=[];for(let t of[!1,!0])for(let a of[-1,1])for(let s of[-1,1]){let c=B.x+a*n+(t?e*this.sun.x:0),l=B.y+s*r+(t?e*this.sun.y:0);i.push(new o(c,l,t?.002:e-V.thickness))}let a=this.haze.geometry.getAttribute(`position`);i.forEach((e,t)=>a.setXYZ(t,e.x,e.y,e.z)),a.needsUpdate=!0,this.haze.geometry.computeBoundingSphere();let s=i.reduce((e,t)=>e.add(t),new o).multiplyScalar(1/8),c=this.hazeMaterial.uniforms.uPlanes.value;[[0,1,4],[2,3,6],[0,2,4],[1,3,5],[0,1,2],[4,5,6]].forEach(([e,t,n],r)=>{let a=new o().subVectors(i[t],i[e]).cross(new o().subVectors(i[n],i[e])).normalize(),l=-a.dot(i[e]);a.dot(s)+l>0&&(a.negate(),l=-l),c[r].set(a.x,a.y,a.z,l)}),this.hazeMaterial.uniforms.uPane.value.set(B.x,B.y,e,0),this.hazeMaterial.uniforms.uSunXY.value.set(this.sun.x,this.sun.y)}viewRect(e){return P(V.width,V.height,this.sun,e,Qe)}renderLight(e,t,n={}){this.renderCaustic(e,n),this.renderDefocus(e,t)}renderCaustic(e,t={}){let n=this.caustic,r=this.bridge.getState();n.setFocus(this.dStar),n.setMistMap(this.mistTexture),n.setMist(t.mist??this.mistLevel());let i=t.glint??(this.glintT>=0?Math.sin(Math.PI*this.glintT/.3):0);if(n.setExposure(1+.3*Math.max(0,i)),t.hand!==!1&&(this.bridge.input().hand??r.hand)){let e=(this.handX.value-.5)*V.width,t=(.5-this.handY.value)*V.height;n.setOccluder({x0:e-.05,x1:e+.05,y0:t-.095,y1:t+.095,radius:.045,feather:.008,depth:.12}),this.hazeMaterial.uniforms.uHand.value.set(e-.05,t-.095,e+.05,t+.095),this.hazeMaterial.uniforms.uHandOn.value=1}else n.setOccluder(null),this.hazeMaterial.uniforms.uHandOn.value=0;this.hazeMaterial.uniforms.uDensity.value=.11*(1-.6*this.scatter(r))*(1+.3*Math.max(0,i)),n.setView(this.viewRect(this.dStar));let a=performance.now();n.render(e,this.lightRT,{output:`light`}),this.causticMs=performance.now()-a,this.downDirty=!0}defocusSigma(e){let t=Math.abs(e/Math.max(1e-6,this.dStar)-1);return ut.max*(1-Math.exp(-t/ut.scale))}pass(e,t,n,r){t.uniforms.uSrc.value=n,this.passQuad.material=t,e.setRenderTarget(r),e.render(this.passScene,this.blurCamera)}renderDefocus(e,t){let n=this.lightRT,r=this.dq0,i=this.dqA,a=this.dqB;if(!n||!r||!i||!a)return;let o=n.width/(V.width+2*Qe),s=this.defocusSigma(t)*o,c=Math.min(1,s/4);if(c>.001){this.downDirty&&=(this.downMat.uniforms.uTexel.value.set(1/n.width,1/n.height),this.pass(e,this.downMat,n.texture,r),!1);let t=Math.max(4,s)/4;this.gaussMat.uniforms.uStep.value.set(t/4/r.width,0),this.pass(e,this.gaussMat,r.texture,i),this.gaussMat.uniforms.uStep.value.set(0,t/4/r.height),this.pass(e,this.gaussMat,i.texture,a)}this.uniforms.uDefocus.value=c;let l=this.viewRect(t);if(this.uniforms.uLightRect.value.set(l.x0,l.y0,l.x1-l.x0,l.y1-l.y0),this.blurA&&this.blurB){let t=c>.5?a.texture:n.texture,r=this.blurMat.uniforms;e.setRenderTarget(this.blurA),r.uSrc.value=t,r.uStep.value.set(2/n.width,0),e.render(this.blurScene,this.blurCamera),e.setRenderTarget(this.blurB),r.uSrc.value=this.blurA.texture,r.uStep.value.set(0,2/this.blurA.height),e.render(this.blurScene,this.blurCamera),e.setRenderTarget(this.blurA),r.uSrc.value=this.blurB.texture,r.uStep.value.set(1.5/this.blurA.width,0),e.render(this.blurScene,this.blurCamera),e.setRenderTarget(this.blurB),r.uSrc.value=this.blurA.texture,r.uStep.value.set(0,1.5/this.blurA.height),e.render(this.blurScene,this.blurCamera)}let u=B.x+t*this.sun.x,d=B.y+t*this.sun.y,f=this.bridge.getState(),p=this.scatter(f),m=this.bridge.input().hand??f.hand,h=Xe*V.width*V.height*(1-.35*p)*(m?.9:1);this.uniforms.uBounce.value.set(u,d,h,0),this.bounceLight&&(this.bounceLight.position.set(u,d-.15,.45),this.bounceLight.intensity=h*.55)}renderShadow(e){if(!this.shadowRT)return;let t=new o(this.sun.x,this.sun.y,-1).normalize(),n=this.standHeight(),r=new o(this.standX(),n+.15,Q),i=this.shadowCamera;i.position.copy(r).addScaledVector(t,-3),i.up.set(0,1,0),i.lookAt(r),i.left=-.45,i.right=.45,i.top=.45,i.bottom=-.45,i.near=.5,i.far=5,i.updateProjectionMatrix(),i.updateMatrixWorld(),this.uniforms.uShadowMat.value.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse);let a=this.shadowScene.overrideMaterial;this.shadowScene.overrideMaterial=this.depthMat,this.stand.updateMatrixWorld(!0);let s=this.stand.parent;this.shadowScene.add(this.stand),e.setRenderTarget(this.shadowRT),e.setClearColor(16777215,1),e.clear(!0,!0,!1),e.render(this.shadowScene,i),this.shadowScene.remove(this.stand),s?.add(this.stand),this.shadowScene.overrideMaterial=a,this.uniforms.uShadowOn.value=+(this.standIn.value>.02)}render(e,t){if(!this.caustic||!this.lightRT)return;let n=performance.now(),r=new S;e.getClearColor(r);let i=e.getClearAlpha(),a=!1;this.causticDirty&&(this.renderCaustic(e),this.causticDirty=!1,this.defocusDirty=!0,a=!0),this.defocusDirty&&(this.renderDefocus(e,this.dist.value),this.defocusDirty=!1,a=!0),this.shadowDirty&&(this.renderShadow(e),this.shadowDirty=!1,a=!0),a&&(e.setClearColor(r,i),t.restore());let o=performance.now();if(e.render(this.scene,this.camera),this.frames++,this.renderMs=performance.now()-n,tt&&this.renderMs>50){let t=e.getContext(),r=performance.now();t.finish(),console.info(`[bench] slow frame ${this.frames}: light+shadow ${(o-n).toFixed(0)} ms, scene ${(r-o).toFixed(0)} ms, finish ${(performance.now()-r).toFixed(0)} ms, programs ${e.info.programs?.length}`)}this.layoutDirty&&(this.layoutDirty=!1,this.publishLayout())}fitCamera(){this.cameraDirty=!1,this.layoutDirty=!0;let e=this.aspect,t=this.size?.width??1,n=e<1.05,r=this.camera,i=n?{x:-2.9,y:1.05,z:9.6}:{x:-4.4,y:1.05,z:10.2},a=n?this.lowSunEye(i,F.lowSun):this.lowSunEye(i),o=n?1:this.camMix.value;r.position.set(i.x+(a.x-i.x)*o,i.y+(a.y-i.y)*o,i.z+(a.z-i.z)*o),n?r.lookAt(.45,1.3,.8):r.lookAt(.8,1.35,.8),r.updateMatrixWorld(!0);let s=Math.min(.94,Math.min(this.clearRight,t)/t*2-1-.04),c=n?{x0:-.94,x1:.94,y0:-.96,y1:.93}:{x0:-.95,x1:Math.max(-.2,s),y0:-.95,y1:.92},l=gt(r,e,this.roiPoints(n),c),u=n?dt:this.pushMix.value*.4,d=u>.001?gt(r,e,this.roiLocked(),c):null;l&&(this.frameTarget=d?ht(l,d,u):l,(!this.frame||this.snapFrame||this.ctx.engine.still)&&(this.frame={...this.frameTarget},this.snapFrame=!1),mt(r,this.frame))}stepFrame(e){let t=this.frame,n=this.frameTarget;if(!t||!n)return!1;let r=Math.abs(t.L-n.L)+Math.abs(t.B-n.B)+Math.abs(t.sx-n.sx)+Math.abs(t.sy-n.sy);if(r<1e-5)return!1;let i=1-Math.exp(-e*6);return t.L+=(n.L-t.L)*i,t.B+=(n.B-t.B)*i,t.sx+=(n.sx-t.sx)*i,t.sy+=(n.sy-t.sy)*i,r*(1-i)<1e-5&&Object.assign(t,n),mt(this.camera,t),this.layoutDirty=!0,!0}eyeSunFor(e){return e.word===null||this.paneKind===`visitor`?this.sun:F[e.light===`low`?`lowSun`:e.light]}needsLowEye(){let e={x:-4.4,y:1.05,z:10.2};return this.lowSunEye(e)!==e}lowSunEye(e,t=this.eyeSun){let n=B.y+P(V.width,V.height,t,this.dStar,0).y1-.1,r=U.y0;if(n<=r)return e;let i=(n-r)/this.dStar;if((r-e.y)/(e.z-this.dStar)>=i)return e;let a=.62,o=this.dStar+(r-a)/i;return{x:e.x*(o/e.z),y:a,z:Math.min(e.z,o)}}roiPoints(e){let n=[],r=.5*this.dStar,i=(e?t.max:this.paneKind===`visitor`?this.railMax():2.3)*this.dStar;n.push(new o(-U.width/2,U.y1,this.dStar),new o(W+.16,U.y1,this.dStar)),n.push(new o(-U.width/2,U.y0,r)),e&&n.push(new o(-U.width/2,U.y1,t.start*this.dStar),new o(W+.16,U.y1,t.start*this.dStar));for(let e of[r,i])n.push(new o(q.x-.08,q.y-.12,e+q.z+.06)),n.push(new o(q.x+.1,q.y+.06,e+q.z+.1));n.push(new o(K.x+K.halfWidth,0,this.dStar+K.halfDepth));for(let e of[.85,1,1.25]){let t=P(V.width,V.height,this.sun,e*this.dStar,.1);n.push(new o(B.x+t.x0,B.y+t.y0,0),new o(B.x+t.x1,B.y+t.y1,0))}e?n.push(new o(-1.85,0,1.25),new o(-1.7,0,2.8),new o(-.2,0,2.8)):n.push(new o(-2.2,0,1.1),new o(-1.8,0,2.9),new o(-.2,0,2.8));let a=B.x+this.dStar*this.sun.x-1.3;return n.push(new o(a-.2,0,Q)),n}roiLocked(){let e=this.dStar,t=P(V.width,V.height,this.sun,e,.12);return[new o(B.x+t.x0,B.y+t.y0,0),new o(B.x+t.x1,B.y+t.y1,0),new o(-U.width/2,U.y1,e),new o(W+.16,U.y0,e),new o(q.x-.08,q.y-.12,e+q.z+.06),new o(B.x+e*this.sun.x+.05,0,Q)]}railMax(){return Math.abs(this.sun.y)>.6?2.1:2.3}toScreen(e){let t=this.size,n=this.v3.copy(e).applyMatrix4(this.camera.matrixWorldInverse).applyMatrix4(this.camera.projectionMatrix);return{x:(n.x+1)/2*(t?.width??1),y:(1-n.y)/2*(t?.height??1)}}publishLayout(){let e=this.size;if(!e)return;let t=this.dist.value,n=-V.width/2+J.bladeInset+this.blade.value*(V.width-2*J.bladeInset),r=this.toScreen(new o(n,J.gripY,t+.14)),i=this.toScreen(new o(-V.width/2+J.bladeInset,J.gripY,t+.14)),a=this.toScreen(new o(V.width/2-J.bladeInset,J.gripY,t+.14)),s=this.toScreen(new o(q.x,q.y,t+q.z)),c=[],l=this.paneKind===`visitor`?this.railMax():2.3;for(let e=.5;e<=l+1e-6;e+=.05){let t=this.toScreen(new o(q.x,q.y,e*this.dStar+q.z));c.push({t:Math.round(e*1e3)/1e3,x:t.x,y:t.y})}let u=P(V.width,V.height,this.sun,t,.04),d=[this.toScreen(new o(B.x+u.x0,B.y+u.y0,0)),this.toScreen(new o(B.x+u.x1,B.y+u.y1,0))],f={width:e.width,height:e.height,squeegee:r,blade:{x0:i.x,y0:i.y,x1:a.x,y1:a.y},handle:s,rail:c,patch:{x0:Math.min(d[0].x,d[1].x),y0:Math.min(d[0].y,d[1].y),x1:Math.max(d[0].x,d[1].x),y1:Math.max(d[0].y,d[1].y)},clearRight:this.clearRight};this.bridge.setLayout(f)}ray(e,t){let n=this.size;if(!n)return null;let r=e/n.width*2-1,i=1-t/n.height*2,a=new o(r,i,.5).unproject(this.camera),s=this.camera.position.clone();return{o:s,dir:a.sub(s).normalize()}}rayToPlaneY(e,t,n){let r=this.ray(e,t);if(!r||Math.abs(r.dir.y)<1e-5)return null;let i=(n-r.o.y)/r.dir.y;return i<=0?null:r.o.clone().addScaledVector(r.dir,i)}handAt(e,t){let n=this.ray(e,t);if(!n||n.dir.z>=-1e-5)return null;let r=-n.o.z/n.dir.z,i=n.o.clone().addScaledVector(n.dir,r);if(i.y<0)return null;let a=this.dist.value,o=i.x-B.x-a*this.sun.x,s=i.y-B.y-a*this.sun.y,c=o/V.width+.5,l=.5-s/V.height;return c<-.05||c>1.05||l<-.05||l>1.05?null:{x:Math.min(1,Math.max(0,c)),y:Math.min(1,Math.max(0,l))}}floorAt(e,t){let n=this.rayToPlaneY(e,t,$e);return n?n.z>.02&&n.z<3.6&&Math.abs(n.x)<4.2:!1}stats(){return{tier:this.tier,causticMs:Math.round(this.causticMs*100)/100,renderMs:Math.round(this.renderMs*100)/100,frames:this.frames,pieces:this.pieces.length,piecesSource:this.piecesSource,awake:this.awake,warm:this.warmStats,pile:this.pile.bodies.map(e=>[Math.round(e.x*1e3)/1e3,Math.round(e.z*1e3)/1e3]),pileScreen:this.pile.bodies.map(e=>{let t=this.toScreen(new o(e.x,.06,e.z));return[Math.round(t.x),Math.round(t.y)]}),engine:(({fps:e,frameMs:t,cpuMs:n,gpuMs:r,drawCalls:i,triangles:a,renderScale:o,dpr:s})=>({fps:e,frameMs:t,cpuMs:n,gpuMs:r,drawCalls:i,triangles:a,renderScale:o,dpr:s}))(this.ctx.engine.stats)}}};function mt(e,t){let n=e.near;e.projectionMatrix.makePerspective(t.L*n,(t.L+2*t.sx)*n,(t.B+2*t.sy)*n,t.B*n,n,e.far),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}function ht(e,t,n){let r=Math.exp(Math.log(e.sx)+(Math.log(t.sx)-Math.log(e.sx))*n),i=(r-e.sx)/(t.sx-e.sx||1),a=Number.isFinite(i)?Math.min(1,Math.max(0,i)):n;return{sx:r,sy:e.sy+(t.sy-e.sy)*a,L:e.L+(t.L-e.L)*a,B:e.B+(t.B-e.B)*a}}function gt(e,t,n,r){let i=e.matrixWorldInverse,a=1/0,s=-1/0,c=1/0,l=-1/0,u=new o;for(let e of n){if(u.copy(e).applyMatrix4(i),u.z>-.2)continue;let t=u.x/-u.z,n=u.y/-u.z;a=Math.min(a,t),s=Math.max(s,t),c=Math.min(c,n),l=Math.max(l,n)}if(!Number.isFinite(a))return null;let d=Math.max((s-a)/(r.x1-r.x0),t*(l-c)/(r.y1-r.y0)),f=d/t;return{L:(a+s)/2-d*((r.x0+r.x1)/2+1),B:(c+l)/2-f*((r.y0+r.y1)/2+1),sx:d,sy:f}}function _t(e){let t=new Float32Array(43776),n=new Float32Array(43776),r=new Float32Array(43776),i=e.pane.mesh.positions,a=e.pane.mesh.slopes,o=e.pane.width,s=e.pane.height,l=1e-6;for(let c=0;c<i.length/2;c++){let u=Math.round((i[2*c]/o+.5)*255),d=Math.round((i[2*c+1]/s+.5)*170);if(u<0||d<0||u>=256||d>=171)continue;let f=d*256+u,p=a[2*c]-e.sun.x,m=a[2*c+1]-e.sun.y;t[f]+=p,n[f]+=m,r[f]+=1,l=Math.max(l,Math.abs(p),Math.abs(m))}for(let e=0;e<r.length;e++)r[e]>0&&(t[e]/=r[e],n[e]/=r[e]);for(let e=0;e<3;e++)for(let e=0;e<171;e++)for(let i=0;i<256;i++){let a=e*256+i;if(r[a]>0)continue;let o=0,s=0,c=0;for(let[a,l]of[[1,0],[-1,0],[0,1],[0,-1]]){let u=i+a,d=e+l;if(u<0||d<0||u>=256||d>=171)continue;let f=d*256+u;r[f]>0&&(o+=t[f],s+=n[f],c++)}c&&(t[a]=o/c,n[a]=s/c,r[a]=.5)}let u=new Uint8Array(175104),d=.22/l;for(let e=0;e<43776;e++){let r=-t[e]*d,i=-n[e]*d,a=Math.hypot(r,i,1);u[4*e]=Math.round((r/a*.5+.5)*255),u[4*e+1]=Math.round((i/a*.5+.5)*255),u[4*e+2]=Math.round((1/a*.5+.5)*255),u[4*e+3]=255}let f=new se(u,256,171,me);return f.magFilter=c,f.minFilter=c,f.needsUpdate=!0,f}function vt(t,n){let r=e[n],i=r.transmission&&!et;t.metalness=0,t.ior=1.52,t.specularIntensity=1,t.specularColor.set(`#ffffff`),t.clearcoat=0,t.depthWrite=!1,i?(t.transmission=1,t.thickness=V.thickness,t.color.set(`#ffffff`),t.attenuationColor.set(ee.edgeLight),t.attenuationDistance=.28,t.roughness=.02,t.transparent=!1,t.opacity=1,t.envMapIntensity=2.4,t.normalScale.set(.3,.3),t.dispersion=r.dispersion?.35:0):(t.transmission=0,t.thickness=0,t.color.set(`#0f1c1a`),t.attenuationDistance=1/0,t.roughness=.035,t.transparent=!0,t.opacity=.14,t.envMapIntensity=7,t.normalScale.set(.7,.7),t.dispersion=0),t.needsUpdate=!0}function yt(){let e=new se(new Uint8Array([128,128,255,255]),1,1,me);return e.needsUpdate=!0,e}function bt(e){let t=typeof location>`u`||new URLSearchParams(location.search).get(`benchaa`)!==`0`;return y(`bench`,t=>new pt(t,e),{clear:`shade`,msaa:t,cache:!0,pointer:!1,still:`render`,minTier:1})}export{bt as registerBench};