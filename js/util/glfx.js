/*
 * glfx.js
 * http://evanw.github.com/glfx.js/
 *
 * Copyright 2011 Evan Wallace
 * Released under the MIT license
 */
var fx = (function () {
  function q(a, d, c) {
    return Math.max(a, Math.min(d, c));
  }

  function w(b) {
    return {
      _: b,
      loadContentsOf: function (b) {
        a = this._.gl;
        this._.loadContentsOf(b);
      },
      destroy: function () {
        a = this._.gl;
        this._.destroy();
      },
    };
  }

  function A(a) {
    return w(r.fromElement(a));
  }

  function B(b, d) {
    var c = a.UNSIGNED_BYTE;
    if (
      a.getExtension("OES_texture_float") &&
      a.getExtension("OES_texture_float_linear")
    ) {
      var e = new r(100, 100, a.RGBA, a.FLOAT);
      try {
        e.drawTo(function () {
          c = a.FLOAT;
        });
      } catch (g) {
        // Ignore WebGL errors
      }
      e.destroy();
    }
    this._.texture && this._.texture.destroy();
    this._.spareTexture && this._.spareTexture.destroy();
    this.width = b;
    this.height = d;
    this._.texture = new r(b, d, a.RGBA, c);
    this._.spareTexture = new r(b, d, a.RGBA, c);
    this._.extraTexture = this._.extraTexture || new r(0, 0, a.RGBA, c);
    this._.flippedShader =
      this._.flippedShader ||
      new h(
        null,
        "uniform sampler2D texture;varying vec2 texCoord;void main(){gl_FragColor=texture2D(texture,vec2(texCoord.x,1.0-texCoord.y));}",
      );
    this._.isInitialized = !0;
  }

  function C(a, d, c) {
    (this._.isInitialized &&
      a._.width == this.width &&
      a._.height == this.height) ||
      B.call(this, d ? d : a._.width, c ? c : a._.height);
    a._.use();
    this._.texture.drawTo(function () {
      h.getDefaultShader().drawRect();
    });
    return this;
  }

  function D() {
    this._.texture.use();
    this._.flippedShader.drawRect();
    return this;
  }

  function f(a, d, c, e) {
    (c || this._.texture).use();
    this._.spareTexture.drawTo(function () {
      a.uniforms(d).drawRect();
    });
    this._.spareTexture.swapWith(e || this._.texture);
  }

  function E(a) {
    a.parentNode.insertBefore(this, a);
    a.parentNode.removeChild(a);
    return this;
  }

  function F() {
    var b = new r(
      this._.texture.width,
      this._.texture.height,
      a.RGBA,
      a.UNSIGNED_BYTE,
    );
    this._.texture.use();
    b.drawTo(function () {
      h.getDefaultShader().drawRect();
    });
    return w(b);
  }

  function G() {
    var b = this._.texture.width,
      d = this._.texture.height,
      c = new Uint8Array(4 * b * d);
    this._.texture.drawTo(function () {
      a.readPixels(0, 0, b, d, a.RGBA, a.UNSIGNED_BYTE, c);
    });
    return c;
  }

  function k(b) {
    return function () {
      a = this._.gl;
      return b.apply(this, arguments);
    };
  }

  function x(a, d, c, e, g, l, n, p) {
    var m = c - g,
      h = e - l,
      f = n - g,
      k = p - l;
    g = a - c + g - n;
    l = d - e + l - p;
    var q = m * k - f * h,
      f = (g * k - f * l) / q,
      m = (m * l - g * h) / q;
    return [
      c - a + f * c,
      e - d + f * e,
      f,
      n - a + m * n,
      p - d + m * p,
      m,
      a,
      d,
      1,
    ];
  }

  function y(a) {
    var d = a[0],
      c = a[1],
      e = a[2],
      g = a[3],
      l = a[4],
      n = a[5],
      p = a[6],
      m = a[7];
    a = a[8];
    var f =
      d * l * a - d * n * m - c * g * a + c * n * p + e * g * m - e * l * p;
    return [
      (l * a - n * m) / f,
      (e * m - c * a) / f,
      (c * n - e * l) / f,
      (n * p - g * a) / f,
      (d * a - e * p) / f,
      (e * g - d * n) / f,
      (g * m - l * p) / f,
      (c * p - d * m) / f,
      (d * l - c * g) / f,
    ];
  }

  function z(a) {
    var d = a.length;
    this.xa = [];
    this.ya = [];
    this.u = [];
    this.y2 = [];
    a.sort(function (a, b) {
      return a[0] - b[0];
    });
    for (var c = 0; c < d; c++) this.xa.push(a[c][0]), this.ya.push(a[c][1]);
    this.u[0] = 0;
    this.y2[0] = 0;
    for (c = 1; c < d - 1; ++c) {
      a = this.xa[c + 1] - this.xa[c - 1];
      var e = (this.xa[c] - this.xa[c - 1]) / a,
        g = e * this.y2[c - 1] + 2;
      this.y2[c] = (e - 1) / g;
      this.u[c] =
        ((6 *
          ((this.ya[c + 1] - this.ya[c]) / (this.xa[c + 1] - this.xa[c]) -
            (this.ya[c] - this.ya[c - 1]) / (this.xa[c] - this.xa[c - 1]))) /
          a -
          e * this.u[c - 1]) /
        g;
    }
    this.y2[d - 1] = 0;
    for (c = d - 2; 0 <= c; --c)
      this.y2[c] = this.y2[c] * this.y2[c + 1] + this.u[c];
  }

  function u(a, d) {
    return new h(
      null,
      a +
        "uniform sampler2D texture;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 coord=texCoord*texSize;" +
        d +
        "gl_FragColor=texture2D(texture,coord/texSize);vec2 clampedCoord=clamp(coord,vec2(0.0),texSize);if(coord!=clampedCoord){gl_FragColor.a*=max(0.0,1.0-length(coord-clampedCoord));}}",
    );
  }

  function H(b, d) {
    a.brightnessContrast =
      a.brightnessContrast ||
      new h(
        null,
        "uniform sampler2D texture;uniform float brightness;uniform float contrast;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color.rgb+=brightness;if(contrast>0.0){color.rgb=(color.rgb-0.5)/(1.0-contrast)+0.5;}else{color.rgb=(color.rgb-0.5)*(1.0+contrast)+0.5;}gl_FragColor=color;}",
      );
    f.call(this, a.brightnessContrast, {
      brightness: q(-1, b, 1),
      contrast: q(-1, d, 1),
    });
    return this;
  }

  function t(a) {
    a = new z(a);
    for (var d = [], c = 0; 256 > c; c++)
      d.push(q(0, Math.floor(256 * a.interpolate(c / 255)), 255));
    return d;
  }

  function I(b, d, c) {
    b = t(b);
    1 == arguments.length ? (d = c = b) : ((d = t(d)), (c = t(c)));
    for (var e = [], g = 0; 256 > g; g++)
      e.splice(e.length, 0, b[g], d[g], c[g], 255);
    this._.extraTexture.initFromBytes(256, 1, e);
    this._.extraTexture.use(1);
    a.curves =
      a.curves ||
      new h(
        null,
        "uniform sampler2D texture;uniform sampler2D map;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color.r=texture2D(map,vec2(color.r)).r;color.g=texture2D(map,vec2(color.g)).g;color.b=texture2D(map,vec2(color.b)).b;gl_FragColor=color;}",
      );
    a.curves.textures({
      map: 1,
    });
    f.call(this, a.curves, {});
    return this;
  }

  function J(b) {
    a.denoise =
      a.denoise ||
      new h(
        null,
        "uniform sampler2D texture;uniform float exponent;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;void main(){vec4 center=texture2D(texture,texCoord);vec4 color=vec4(0.0);float total=0.0;for(float x=-4.0;x<=4.0;x+=1.0){for(float y=-4.0;y<=4.0;y+=1.0){vec4 sample=texture2D(texture,texCoord+vec2(x,y)/texSize);float weight=1.0-abs(dot(sample.rgb-center.rgb,vec3(0.25)));weight=pow(weight,exponent);color+=sample*weight;total+=weight;}}gl_FragColor=color/total;}",
      );
    for (var d = 0; 2 > d; d++)
      f.call(this, a.denoise, {
        exponent: Math.max(0, b),
        texSize: [this.width, this.height],
      });
    return this;
  }

  function K(b, d) {
    a.hueSaturation =
      a.hueSaturation ||
      new h(
        null,
        "uniform sampler2D texture;uniform float hue;uniform float saturation;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float angle=hue*3.14159265;float s=sin(angle),c=cos(angle);vec3 weights=(vec3(2.0*c,-sqrt(3.0)*s-c,sqrt(3.0)*s-c)+1.0)/3.0;float len=length(color.rgb);color.rgb=vec3(dot(color.rgb,weights.xyz),dot(color.rgb,weights.zxy),dot(color.rgb,weights.yzx));float average=(color.r+color.g+color.b)/3.0;if(saturation>0.0){color.rgb+=(average-color.rgb)*(1.0-1.0/(1.001-saturation));}else{color.rgb+=(average-color.rgb)*(-saturation);}gl_FragColor=color;}",
      );
    f.call(this, a.hueSaturation, {
      hue: q(-1, b, 1),
      saturation: q(-1, d, 1),
    });
    return this;
  }

  function L(b) {
    a.noise =
      a.noise ||
      new h(
        null,
        "uniform sampler2D texture;uniform float amount;varying vec2 texCoord;float rand(vec2 co){return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);}void main(){vec4 color=texture2D(texture,texCoord);float diff=(rand(texCoord)-0.5)*amount;color.r+=diff;color.g+=diff;color.b+=diff;gl_FragColor=color;}",
      );
    f.call(this, a.noise, {
      amount: q(0, b, 1),
    });
    return this;
  }

  function M(b) {
    a.sepia =
      a.sepia ||
      new h(
        null,
        "uniform sampler2D texture;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float r=color.r;float g=color.g;float b=color.b;color.r=min(1.0,(r*(1.0-(0.607*amount)))+(g*(0.769*amount))+(b*(0.189*amount)));color.g=min(1.0,(r*0.349*amount)+(g*(1.0-(0.314*amount)))+(b*0.168*amount));color.b=min(1.0,(r*0.272*amount)+(g*0.534*amount)+(b*(1.0-(0.869*amount))));gl_FragColor=color;}",
      );
    f.call(this, a.sepia, {
      amount: q(0, b, 1),
    });
    return this;
  }

  function N(b, d) {
    a.unsharpMask =
      a.unsharpMask ||
      new h(
        null,
        "uniform sampler2D blurredTexture;uniform sampler2D originalTexture;uniform float strength;uniform float threshold;varying vec2 texCoord;void main(){vec4 blurred=texture2D(blurredTexture,texCoord);vec4 original=texture2D(originalTexture,texCoord);gl_FragColor=mix(blurred,original,1.0+strength);}",
      );
    this._.extraTexture.ensureFormat(this._.texture);
    this._.texture.use();
    this._.extraTexture.drawTo(function () {
      h.getDefaultShader().drawRect();
    });
    this._.extraTexture.use(1);
    this.triangleBlur(b);
    a.unsharpMask.textures({
      originalTexture: 1,
    });
    f.call(this, a.unsharpMask, {
      strength: d,
    });
    this._.extraTexture.unuse(1);
    return this;
  }

  function O(b) {
    a.vibrance =
      a.vibrance ||
      new h(
        null,
        "uniform sampler2D texture;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float average=(color.r+color.g+color.b)/3.0;float mx=max(color.r,max(color.g,color.b));float amt=(mx-average)*(-amount*3.0);color.rgb=mix(color.rgb,vec3(mx),amt);gl_FragColor=color;}",
      );
    f.call(this, a.vibrance, {
      amount: q(-1, b, 1),
    });
    return this;
  }

  function P(b, d) {
    a.vignette =
      a.vignette ||
      new h(
        null,
        "uniform sampler2D texture;uniform float size;uniform float amount;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);float dist=distance(texCoord,vec2(0.5,0.5));color.rgb*=smoothstep(0.8,size*0.799,dist*(amount+size));gl_FragColor=color;}",
      );
    f.call(this, a.vignette, {
      size: q(0, b, 1),
      amount: q(0, d, 1),
    });
    return this;
  }

  function Q(b, d, c) {
    a.lensBlurPrePass =
      a.lensBlurPrePass ||
      new h(
        null,
        "uniform sampler2D texture;uniform float power;varying vec2 texCoord;void main(){vec4 color=texture2D(texture,texCoord);color=pow(color,vec4(power));gl_FragColor=vec4(color);}",
      );
    var e =
      "uniform sampler2D texture0;uniform sampler2D texture1;uniform vec2 delta0;uniform vec2 delta1;uniform float power;varying vec2 texCoord;" +
      s +
      "vec4 sample(vec2 delta){float offset=random(vec3(delta,151.7182),0.0);vec4 color=vec4(0.0);float total=0.0;for(float t=0.0;t<=30.0;t++){float percent=(t+offset)/30.0;color+=texture2D(texture0,texCoord+delta*percent);total+=1.0;}return color/total;}";
    a.lensBlur0 =
      a.lensBlur0 ||
      new h(null, e + "void main(){gl_FragColor=sample(delta0);}");
    a.lensBlur1 =
      a.lensBlur1 ||
      new h(
        null,
        e + "void main(){gl_FragColor=(sample(delta0)+sample(delta1))*0.5;}",
      );
    a.lensBlur2 =
      a.lensBlur2 ||
      new h(
        null,
        e +
          "void main(){vec4 color=(sample(delta0)+2.0*texture2D(texture1,texCoord))/3.0;gl_FragColor=pow(color,vec4(power));}",
      ).textures({
        texture1: 1,
      });
    for (var e = [], g = 0; 3 > g; g++) {
      var l = c + (2 * g * Math.PI) / 3;
      e.push([(b * Math.sin(l)) / this.width, (b * Math.cos(l)) / this.height]);
    }
    b = Math.pow(10, q(-1, d, 1));
    f.call(this, a.lensBlurPrePass, {
      power: b,
    });
    this._.extraTexture.ensureFormat(this._.texture);
    f.call(
      this,
      a.lensBlur0,
      {
        delta0: e[0],
      },
      this._.texture,
      this._.extraTexture,
    );
    f.call(
      this,
      a.lensBlur1,
      {
        delta0: e[1],
        delta1: e[2],
      },
      this._.extraTexture,
      this._.extraTexture,
    );
    f.call(this, a.lensBlur0, {
      delta0: e[1],
    });
    this._.extraTexture.use(1);
    f.call(this, a.lensBlur2, {
      power: 1 / b,
      delta0: e[2],
    });
    return this;
  }

  function R(b, d, c, e, g, l) {
    a.tiltShift =
      a.tiltShift ||
      new h(
        null,
        "uniform sampler2D texture;uniform float blurRadius;uniform float gradientRadius;uniform vec2 start;uniform vec2 end;uniform vec2 delta;uniform vec2 texSize;varying vec2 texCoord;" +
          s +
          "void main(){vec4 color=vec4(0.0);float total=0.0;float offset=random(vec3(12.9898,78.233,151.7182),0.0);vec2 normal=normalize(vec2(start.y-end.y,end.x-start.x));float radius=smoothstep(0.0,1.0,abs(dot(texCoord*texSize-start,normal))/gradientRadius)*blurRadius;for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec4 sample=texture2D(texture,texCoord+delta/texSize*percent*radius);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}",
      );
    var n = c - b,
      p = e - d,
      m = Math.sqrt(n * n + p * p);
    f.call(this, a.tiltShift, {
      blurRadius: g,
      gradientRadius: l,
      start: [b, d],
      end: [c, e],
      delta: [n / m, p / m],
      texSize: [this.width, this.height],
    });
    f.call(this, a.tiltShift, {
      blurRadius: g,
      gradientRadius: l,
      start: [b, d],
      end: [c, e],
      delta: [-p / m, n / m],
      texSize: [this.width, this.height],
    });
    return this;
  }

  function S(b) {
    a.triangleBlur =
      a.triangleBlur ||
      new h(
        null,
        "uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;" +
          s +
          "void main(){vec4 color=vec4(0.0);float total=0.0;float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec4 sample=texture2D(texture,texCoord+delta*percent);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}",
      );
    f.call(this, a.triangleBlur, {
      delta: [b / this.width, 0],
    });
    f.call(this, a.triangleBlur, {
      delta: [0, b / this.height],
    });
    return this;
  }

  function T(b, d, c) {
    a.zoomBlur =
      a.zoomBlur ||
      new h(
        null,
        "uniform sampler2D texture;uniform vec2 center;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;" +
          s +
          "void main(){vec4 color=vec4(0.0);float total=0.0;vec2 toCenter=center-texCoord*texSize;float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=0.0;t<=40.0;t++){float percent=(t+offset)/40.0;float weight=4.0*(percent-percent*percent);vec4 sample=texture2D(texture,texCoord+toCenter*percent*strength/texSize);sample.rgb*=sample.a;color+=sample*weight;total+=weight;}gl_FragColor=color/total;gl_FragColor.rgb/=gl_FragColor.a+0.00001;}",
      );
    f.call(this, a.zoomBlur, {
      center: [b, d],
      strength: c,
      texSize: [this.width, this.height],
    });
    return this;
  }

  function U(b, d, c, e) {
    a.colorHalftone =
      a.colorHalftone ||
      new h(
        null,
        "uniform sampler2D texture;uniform vec2 center;uniform float angle;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;float pattern(float angle){float s=sin(angle),c=cos(angle);vec2 tex=texCoord*texSize-center;vec2 point=vec2(c*tex.x-s*tex.y,s*tex.x+c*tex.y)*scale;return(sin(point.x)*sin(point.y))*4.0;}void main(){vec4 color=texture2D(texture,texCoord);vec3 cmy=1.0-color.rgb;float k=min(cmy.x,min(cmy.y,cmy.z));cmy=(cmy-k)/(1.0-k);cmy=clamp(cmy*10.0-3.0+vec3(pattern(angle+0.26179),pattern(angle+1.30899),pattern(angle)),0.0,1.0);k=clamp(k*10.0-5.0+pattern(angle+0.78539),0.0,1.0);gl_FragColor=vec4(1.0-cmy-k,color.a);}",
      );
    f.call(this, a.colorHalftone, {
      center: [b, d],
      angle: c,
      scale: Math.PI / e,
      texSize: [this.width, this.height],
    });
    return this;
  }

  function V(b, d, c, e) {
    a.dotScreen =
      a.dotScreen ||
      new h(
        null,
        "uniform sampler2D texture;uniform vec2 center;uniform float angle;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;float pattern(){float s=sin(angle),c=cos(angle);vec2 tex=texCoord*texSize-center;vec2 point=vec2(c*tex.x-s*tex.y,s*tex.x+c*tex.y)*scale;return(sin(point.x)*sin(point.y))*4.0;}void main(){vec4 color=texture2D(texture,texCoord);float average=(color.r+color.g+color.b)/3.0;gl_FragColor=vec4(vec3(average*10.0-5.0+pattern()),color.a);}",
      );
    f.call(this, a.dotScreen, {
      center: [b, d],
      angle: c,
      scale: Math.PI / e,
      texSize: [this.width, this.height],
    });
    return this;
  }

  function W(b) {
    a.edgeWork1 =
      a.edgeWork1 ||
      new h(
        null,
        "uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;" +
          s +
          "void main(){vec2 color=vec2(0.0);vec2 total=vec2(0.0);float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec3 sample=texture2D(texture,texCoord+delta*percent).rgb;float average=(sample.r+sample.g+sample.b)/3.0;color.x+=average*weight;total.x+=weight;if(abs(t)<15.0){weight=weight*2.0-1.0;color.y+=average*weight;total.y+=weight;}}gl_FragColor=vec4(color/total,0.0,1.0);}",
      );
    a.edgeWork2 =
      a.edgeWork2 ||
      new h(
        null,
        "uniform sampler2D texture;uniform vec2 delta;varying vec2 texCoord;" +
          s +
          "void main(){vec2 color=vec2(0.0);vec2 total=vec2(0.0);float offset=random(vec3(12.9898,78.233,151.7182),0.0);for(float t=-30.0;t<=30.0;t++){float percent=(t+offset-0.5)/30.0;float weight=1.0-abs(percent);vec2 sample=texture2D(texture,texCoord+delta*percent).xy;color.x+=sample.x*weight;total.x+=weight;if(abs(t)<15.0){weight=weight*2.0-1.0;color.y+=sample.y*weight;total.y+=weight;}}float c=clamp(10000.0*(color.y/total.y-color.x/total.x)+0.5,0.0,1.0);gl_FragColor=vec4(c,c,c,1.0);}",
      );
    f.call(this, a.edgeWork1, {
      delta: [b / this.width, 0],
    });
    f.call(this, a.edgeWork2, {
      delta: [0, b / this.height],
    });
    return this;
  }

  function X(b, d, c) {
    a.hexagonalPixelate =
      a.hexagonalPixelate ||
      new h(
        null,
        "uniform sampler2D texture;uniform vec2 center;uniform float scale;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 tex=(texCoord*texSize-center)/scale;tex.y/=0.866025404;tex.x-=tex.y*0.5;vec2 a;if(tex.x+tex.y-floor(tex.x)-floor(tex.y)<1.0)a=vec2(floor(tex.x),floor(tex.y));else a=vec2(ceil(tex.x),ceil(tex.y));vec2 b=vec2(ceil(tex.x),floor(tex.y));vec2 c=vec2(floor(tex.x),ceil(tex.y));vec3 TEX=vec3(tex.x,tex.y,1.0-tex.x-tex.y);vec3 A=vec3(a.x,a.y,1.0-a.x-a.y);vec3 B=vec3(b.x,b.y,1.0-b.x-b.y);vec3 C=vec3(c.x,c.y,1.0-c.x-c.y);float alen=length(TEX-A);float blen=length(TEX-B);float clen=length(TEX-C);vec2 choice;if(alen<blen){if(alen<clen)choice=a;else choice=c;}else{if(blen<clen)choice=b;else choice=c;}choice.x+=choice.y*0.5;choice.y*=0.866025404;choice*=scale/texSize;gl_FragColor=texture2D(texture,choice+center/texSize);}",
      );
    f.call(this, a.hexagonalPixelate, {
      center: [b, d],
      scale: c,
      texSize: [this.width, this.height],
    });
    return this;
  }

  function Y(b) {
    a.ink =
      a.ink ||
      new h(
        null,
        "uniform sampler2D texture;uniform float strength;uniform vec2 texSize;varying vec2 texCoord;void main(){vec2 dx=vec2(1.0/texSize.x,0.0);vec2 dy=vec2(0.0,1.0/texSize.y);vec4 color=texture2D(texture,texCoord);float bigTotal=0.0;float smallTotal=0.0;vec3 bigAverage=vec3(0.0);vec3 smallAverage=vec3(0.0);for(float x=-2.0;x<=2.0;x+=1.0){for(float y=-2.0;y<=2.0;y+=1.0){vec3 sample=texture2D(texture,texCoord+dx*x+dy*y).rgb;bigAverage+=sample;bigTotal+=1.0;if(abs(x)+abs(y)<2.0){smallAverage+=sample;smallTotal+=1.0;}}}vec3 edge=max(vec3(0.0),bigAverage/bigTotal-smallAverage/smallTotal);gl_FragColor=vec4(color.rgb-dot(edge,edge)*strength*100000.0,color.a);}",
      );
    f.call(this, a.ink, {
      strength: b * b * b * b * b,
      texSize: [this.width, this.height],
    });
    return this;
  }

  function Z(b, d, c, e) {
    a.bulgePinch =
      a.bulgePinch ||
      u(
        "uniform float radius;uniform float strength;uniform vec2 center;",
        "coord-=center;float distance=length(coord);if(distance<radius){float percent=distance/radius;if(strength>0.0){coord*=mix(1.0,smoothstep(0.0,radius/distance,percent),strength*0.75);}else{coord*=mix(1.0,pow(percent,1.0+strength*0.75)*radius/distance,1.0-percent);}}coord+=center;",
      );
    f.call(this, a.bulgePinch, {
      radius: c,
      strength: q(-1, e, 1),
      center: [b, d],
      texSize: [this.width, this.height],
    });
    return this;
  }

  function $(b, d, c) {
    a.matrixWarp =
      a.matrixWarp ||
      u(
        "uniform mat3 matrix;uniform bool useTextureSpace;",
        "if(useTextureSpace)coord=coord/texSize*2.0-1.0;vec3 warp=matrix*vec3(coord,1.0);coord=warp.xy/warp.z;if(useTextureSpace)coord=(coord*0.5+0.5)*texSize;",
      );
    b = Array.prototype.concat.apply([], b);
    if (4 == b.length) b = [b[0], b[1], 0, b[2], b[3], 0, 0, 0, 1];
    else if (9 != b.length) throw "can only warp with 2x2 or 3x3 matrix";
    f.call(this, a.matrixWarp, {
      matrix: d ? y(b) : b,
      texSize: [this.width, this.height],
      useTextureSpace: c | 0,
    });
    return this;
  }

  function aa(a, d) {
    var c = x.apply(null, d),
      e = x.apply(null, a),
      c = y(c);
    return this.matrixWarp([
      c[0] * e[0] + c[1] * e[3] + c[2] * e[6],
      c[0] * e[1] + c[1] * e[4] + c[2] * e[7],
      c[0] * e[2] + c[1] * e[5] + c[2] * e[8],
      c[3] * e[0] + c[4] * e[3] + c[5] * e[6],
      c[3] * e[1] + c[4] * e[4] + c[5] * e[7],
      c[3] * e[2] + c[4] * e[5] + c[5] * e[8],
      c[6] * e[0] + c[7] * e[3] + c[8] * e[6],
      c[6] * e[1] + c[7] * e[4] + c[8] * e[7],
      c[6] * e[2] + c[7] * e[5] + c[8] * e[8],
    ]);
  }

  function ba(b, d, c, e) {
    a.swirl =
      a.swirl ||
      u(
        "uniform float radius;uniform float angle;uniform vec2 center;",
        "coord-=center;float distance=length(coord);if(distance<radius){float percent=(radius-distance)/radius;float theta=percent*percent*angle;float s=sin(theta);float c=cos(theta);coord=vec2(coord.x*c-coord.y*s,coord.x*s+coord.y*c);}coord+=center;",
      );
    f.call(this, a.swirl, {
      radius: c,
      center: [b, d],
      angle: e,
      texSize: [this.width, this.height],
    });
    return this;
  }
  var v = {};
  (function () {
    function a(b) {
      if (!b.getExtension("OES_texture_float")) return !1;
      var c = b.createFramebuffer(),
        e = b.createTexture();
      b.bindTexture(b.TEXTURE_2D, e);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
      b.texImage2D(
        b.TEXTURE_2D,
        0,
        b.RGBA,
        1,
        1,
        0,
        b.RGBA,
        b.UNSIGNED_BYTE,
        null,
      );
      b.bindFramebuffer(b.FRAMEBUFFER, c);
      b.framebufferTexture2D(
        b.FRAMEBUFFER,
        b.COLOR_ATTACHMENT0,
        b.TEXTURE_2D,
        e,
        0,
      );
      c = b.createTexture();
      b.bindTexture(b.TEXTURE_2D, c);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.LINEAR);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
      b.texImage2D(
        b.TEXTURE_2D,
        0,
        b.RGBA,
        2,
        2,
        0,
        b.RGBA,
        b.FLOAT,
        new Float32Array([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      );
      var e = b.createProgram(),
        d = b.createShader(b.VERTEX_SHADER),
        g = b.createShader(b.FRAGMENT_SHADER);
      b.shaderSource(
        d,
        "attribute vec2 vertex;void main(){gl_Position=vec4(vertex,0.0,1.0);}",
      );
      b.shaderSource(
        g,
        "uniform sampler2D texture;void main(){gl_FragColor=texture2D(texture,vec2(0.5));}",
      );
      b.compileShader(d);
      b.compileShader(g);
      b.attachShader(e, d);
      b.attachShader(e, g);
      b.linkProgram(e);
      d = b.createBuffer();
      b.bindBuffer(b.ARRAY_BUFFER, d);
      b.bufferData(b.ARRAY_BUFFER, new Float32Array([0, 0]), b.STREAM_DRAW);
      b.enableVertexAttribArray(0);
      b.vertexAttribPointer(0, 2, b.FLOAT, !1, 0, 0);
      d = new Uint8Array(4);
      b.useProgram(e);
      b.viewport(0, 0, 1, 1);
      b.bindTexture(b.TEXTURE_2D, c);
      b.drawArrays(b.POINTS, 0, 1);
      b.readPixels(0, 0, 1, 1, b.RGBA, b.UNSIGNED_BYTE, d);
      return 127 === d[0] || 128 === d[0];
    }

    function d() {}

    function c(a) {
      "OES_texture_float_linear" === a
        ? (void 0 === this.$OES_texture_float_linear$ &&
            Object.defineProperty(this, "$OES_texture_float_linear$", {
              enumerable: !1,
              configurable: !1,
              writable: !1,
              value: new d(),
            }),
          (a = this.$OES_texture_float_linear$))
        : (a = n.call(this, a));
      return a;
    }

    function e() {
      var a = f.call(this);
      -1 === a.indexOf("OES_texture_float_linear") &&
        a.push("OES_texture_float_linear");
      return a;
    }
    try {
      var g = document.createElement("canvas").getContext("experimental-webgl");
    } catch (l) {
      // Ignore WebGL context errors
    }
    if (
      g &&
      -1 === g.getSupportedExtensions().indexOf("OES_texture_float_linear") &&
      a(g)
    ) {
      var n = WebGLRenderingContext.prototype.getExtension,
        f = WebGLRenderingContext.prototype.getSupportedExtensions;
      WebGLRenderingContext.prototype.getExtension = c;
      WebGLRenderingContext.prototype.getSupportedExtensions = e;
    }
  })();
  var a;
  v.canvas = function () {
    var b = document.createElement("canvas");
    try {
      a = b.getContext("experimental-webgl", {
        premultipliedAlpha: !1,
      });
    } catch (d) {
      a = null;
    }
    if (!a) throw "This browser does not support WebGL";
    b._ = {
      gl: a,
      isInitialized: !1,
      texture: null,
      spareTexture: null,
      flippedShader: null,
    };
    b.texture = k(A);
    b.draw = k(C);
    b.update = k(D);
    b.replace = k(E);
    b.contents = k(F);
    b.getPixelArray = k(G);
    b.brightnessContrast = k(H);
    b.hexagonalPixelate = k(X);
    b.hueSaturation = k(K);
    b.colorHalftone = k(U);
    b.triangleBlur = k(S);
    b.unsharpMask = k(N);
    b.perspective = k(aa);
    b.matrixWarp = k($);
    b.bulgePinch = k(Z);
    b.tiltShift = k(R);
    b.dotScreen = k(V);
    b.edgeWork = k(W);
    b.lensBlur = k(Q);
    b.zoomBlur = k(T);
    b.noise = k(L);
    b.denoise = k(J);
    b.curves = k(I);
    b.swirl = k(ba);
    b.ink = k(Y);
    b.vignette = k(P);
    b.vibrance = k(O);
    b.sepia = k(M);
    return b;
  };
  v.splineInterpolate = t;
  var h = (function () {
    function b(b, c) {
      var e = a.createShader(b);
      a.shaderSource(e, c);
      a.compileShader(e);
      if (!a.getShaderParameter(e, a.COMPILE_STATUS))
        throw "compile error: " + a.getShaderInfoLog(e);
      return e;
    }

    function d(d, l) {
      this.texCoordAttribute = this.vertexAttribute = null;
      this.program = a.createProgram();
      d = d || c;
      l = l || e;
      l = "precision highp float;" + l;
      a.attachShader(this.program, b(a.VERTEX_SHADER, d));
      a.attachShader(this.program, b(a.FRAGMENT_SHADER, l));
      a.linkProgram(this.program);
      if (!a.getProgramParameter(this.program, a.LINK_STATUS))
        throw "link error: " + a.getProgramInfoLog(this.program);
    }
    var c =
        "attribute vec2 vertex;attribute vec2 _texCoord;varying vec2 texCoord;void main(){texCoord=_texCoord;gl_Position=vec4(vertex*2.0-1.0,0.0,1.0);}",
      e =
        "uniform sampler2D texture;varying vec2 texCoord;void main(){gl_FragColor=texture2D(texture,texCoord);}";
    d.prototype.destroy = function () {
      a.deleteProgram(this.program);
      this.program = null;
    };
    d.prototype.uniforms = function (b) {
      a.useProgram(this.program);
      for (var e in b)
        if (Object.prototype.hasOwnProperty.call(b, e)) {
          var c = a.getUniformLocation(this.program, e);
          if (null !== c) {
            var d = b[e];
            if ("[object Array]" == Object.prototype.toString.call(d))
              switch (d.length) {
                case 1:
                  a.uniform1fv(c, new Float32Array(d));
                  break;
                case 2:
                  a.uniform2fv(c, new Float32Array(d));
                  break;
                case 3:
                  a.uniform3fv(c, new Float32Array(d));
                  break;
                case 4:
                  a.uniform4fv(c, new Float32Array(d));
                  break;
                case 9:
                  a.uniformMatrix3fv(c, !1, new Float32Array(d));
                  break;
                case 16:
                  a.uniformMatrix4fv(c, !1, new Float32Array(d));
                  break;
                default:
                  throw (
                    "dont't know how to load uniform \"" +
                    e +
                    '" of length ' +
                    d.length
                  );
              }
            else if ("[object Number]" == Object.prototype.toString.call(d))
              a.uniform1f(c, d);
            else
              throw (
                'attempted to set uniform "' +
                e +
                '" to invalid value ' +
                (d || "undefined").toString()
              );
          }
        }
      return this;
    };
    d.prototype.textures = function (b) {
      a.useProgram(this.program);
      for (var c in b)
        Object.prototype.hasOwnProperty.call(b, c) &&
          a.uniform1i(a.getUniformLocation(this.program, c), b[c]);
      return this;
    };
    d.prototype.drawRect = function (b, c, e, d) {
      var f = a.getParameter(a.VIEWPORT);
      c = void 0 !== c ? (c - f[1]) / f[3] : 0;
      b = void 0 !== b ? (b - f[0]) / f[2] : 0;
      e = void 0 !== e ? (e - f[0]) / f[2] : 1;
      d = void 0 !== d ? (d - f[1]) / f[3] : 1;
      null == a.vertexBuffer && (a.vertexBuffer = a.createBuffer());
      a.bindBuffer(a.ARRAY_BUFFER, a.vertexBuffer);
      a.bufferData(
        a.ARRAY_BUFFER,
        new Float32Array([b, c, b, d, e, c, e, d]),
        a.STATIC_DRAW,
      );
      null == a.texCoordBuffer &&
        ((a.texCoordBuffer = a.createBuffer()),
        a.bindBuffer(a.ARRAY_BUFFER, a.texCoordBuffer),
        a.bufferData(
          a.ARRAY_BUFFER,
          new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
          a.STATIC_DRAW,
        ));
      null == this.vertexAttribute &&
        ((this.vertexAttribute = a.getAttribLocation(this.program, "vertex")),
        a.enableVertexAttribArray(this.vertexAttribute));
      null == this.texCoordAttribute &&
        ((this.texCoordAttribute = a.getAttribLocation(
          this.program,
          "_texCoord",
        )),
        a.enableVertexAttribArray(this.texCoordAttribute));
      a.useProgram(this.program);
      a.bindBuffer(a.ARRAY_BUFFER, a.vertexBuffer);
      a.vertexAttribPointer(this.vertexAttribute, 2, a.FLOAT, !1, 0, 0);
      a.bindBuffer(a.ARRAY_BUFFER, a.texCoordBuffer);
      a.vertexAttribPointer(this.texCoordAttribute, 2, a.FLOAT, !1, 0, 0);
      a.drawArrays(a.TRIANGLE_STRIP, 0, 4);
    };
    d.getDefaultShader = function () {
      a.defaultShader = a.defaultShader || new d();
      return a.defaultShader;
    };
    return d;
  })();
  z.prototype.interpolate = function (a) {
    for (var d = 0, c = this.ya.length - 1; 1 < c - d; ) {
      var e = (c + d) >> 1;
      this.xa[e] > a ? (c = e) : (d = e);
    }
    var e = this.xa[c] - this.xa[d],
      g = (this.xa[c] - a) / e;
    a = (a - this.xa[d]) / e;
    return (
      g * this.ya[d] +
      a * this.ya[c] +
      (((g * g * g - g) * this.y2[d] + (a * a * a - a) * this.y2[c]) * e * e) /
        6
    );
  };
  var r = (function () {
      function b(b, c, d, f) {
        this.gl = a;
        this.id = a.createTexture();
        this.width = b;
        this.height = c;
        this.format = d;
        this.type = f;
        a.bindTexture(a.TEXTURE_2D, this.id);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE);
        b &&
          c &&
          a.texImage2D(
            a.TEXTURE_2D,
            0,
            this.format,
            b,
            c,
            0,
            this.format,
            this.type,
            null,
          );
      }

      function d(a) {
        null == c && (c = document.createElement("canvas"));
        c.width = a.width;
        c.height = a.height;
        a = c.getContext("2d");
        a.clearRect(0, 0, c.width, c.height);
        return a;
      }
      b.fromElement = function (c) {
        var d = new b(0, 0, a.RGBA, a.UNSIGNED_BYTE);
        d.loadContentsOf(c);
        return d;
      };
      b.prototype.loadContentsOf = function (b) {
        this.width = b.width || b.videoWidth;
        this.height = b.height || b.videoHeight;
        a.bindTexture(a.TEXTURE_2D, this.id);
        a.texImage2D(a.TEXTURE_2D, 0, this.format, this.format, this.type, b);
      };
      b.prototype.initFromBytes = function (b, c, d) {
        this.width = b;
        this.height = c;
        this.format = a.RGBA;
        this.type = a.UNSIGNED_BYTE;
        a.bindTexture(a.TEXTURE_2D, this.id);
        a.texImage2D(
          a.TEXTURE_2D,
          0,
          a.RGBA,
          b,
          c,
          0,
          a.RGBA,
          this.type,
          new Uint8Array(d),
        );
      };
      b.prototype.destroy = function () {
        a.deleteTexture(this.id);
        this.id = null;
      };
      b.prototype.use = function (b) {
        a.activeTexture(a.TEXTURE0 + (b || 0));
        a.bindTexture(a.TEXTURE_2D, this.id);
      };
      b.prototype.unuse = function (b) {
        a.activeTexture(a.TEXTURE0 + (b || 0));
        a.bindTexture(a.TEXTURE_2D, null);
      };
      b.prototype.ensureFormat = function (b, c, d, f) {
        if (1 == arguments.length) {
          var h = arguments[0];
          b = h.width;
          c = h.height;
          d = h.format;
          f = h.type;
        }
        if (
          b != this.width ||
          c != this.height ||
          d != this.format ||
          f != this.type
        )
          (this.width = b),
            (this.height = c),
            (this.format = d),
            (this.type = f),
            a.bindTexture(a.TEXTURE_2D, this.id),
            a.texImage2D(
              a.TEXTURE_2D,
              0,
              this.format,
              b,
              c,
              0,
              this.format,
              this.type,
              null,
            );
      };
      b.prototype.drawTo = function (b) {
        a.framebuffer = a.framebuffer || a.createFramebuffer();
        a.bindFramebuffer(a.FRAMEBUFFER, a.framebuffer);
        a.framebufferTexture2D(
          a.FRAMEBUFFER,
          a.COLOR_ATTACHMENT0,
          a.TEXTURE_2D,
          this.id,
          0,
        );
        if (a.checkFramebufferStatus(a.FRAMEBUFFER) !== a.FRAMEBUFFER_COMPLETE)
          throw Error("incomplete framebuffer");
        a.viewport(0, 0, this.width, this.height);
        b();
        a.bindFramebuffer(a.FRAMEBUFFER, null);
      };
      var c = null;
      b.prototype.fillUsingCanvas = function (b) {
        b(d(this));
        this.format = a.RGBA;
        this.type = a.UNSIGNED_BYTE;
        a.bindTexture(a.TEXTURE_2D, this.id);
        a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, c);
        return this;
      };
      b.prototype.toImage = function (b) {
        this.use();
        h.getDefaultShader().drawRect();
        var f = 4 * this.width * this.height,
          k = new Uint8Array(f),
          n = d(this),
          p = n.createImageData(this.width, this.height);
        a.readPixels(0, 0, this.width, this.height, a.RGBA, a.UNSIGNED_BYTE, k);
        for (var m = 0; m < f; m++) p.data[m] = k[m];
        n.putImageData(p, 0, 0);
        b.src = c.toDataURL();
      };
      b.prototype.swapWith = function (a) {
        var b;
        b = a.id;
        a.id = this.id;
        this.id = b;
        b = a.width;
        a.width = this.width;
        this.width = b;
        b = a.height;
        a.height = this.height;
        this.height = b;
        b = a.format;
        a.format = this.format;
        this.format = b;
      };
      return b;
    })(),
    s =
      "float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}";
  return v;
})();
