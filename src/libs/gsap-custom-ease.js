class CustomEase {
    constructor() {

        let e = this;

        function m(e) {
            return ~~(1e5 * e + (e < 0 ? -.5 : .5)) / 1e5
        }

        var E = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi, b = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/gi,
            Y = Math.PI / 180,
            k = Math.sin, B = Math.cos, F = Math.abs, J = Math.sqrt;

        function arcToSegment(e, t, n, s, i, r, o, a, h) {
            if (e !== a || t !== h) {
                n = F(n), s = F(s);
                var u = i % 360 * Y, f = B(u), c = k(u), l = Math.PI, g = 2 * l, d = (e - a) / 2, v = (t - h) / 2,
                    m = f * d + c * v, p = -c * d + f * v, x = m * m, y = p * p, w = x / (n * n) + y / (s * s);
                1 < w && (n = J(w) * n, s = J(w) * s);
                var C = n * n, M = s * s, E = (C * M - C * y - M * x) / (C * y + M * x);
                E < 0 && (E = 0);
                var b = (r === o ? -1 : 1) * J(E), P = n * p / s * b, S = -s * m / n * b,
                    N = f * P - c * S + (e + a) / 2,
                    D = c * P + f * S + (t + h) / 2, O = (m - P) / n, T = (p - S) / s, V = (-m - P) / n,
                    _ = (-p - S) / s,
                    q = O * O + T * T, A = (T < 0 ? -1 : 1) * Math.acos(O / J(q)),
                    R = (O * _ - T * V < 0 ? -1 : 1) * Math.acos((O * V + T * _) / J(q * (V * V + _ * _)));
                isNaN(R) && (R = l), !o && 0 < R ? R -= g : o && R < 0 && (R += g), A %= g, R %= g;
                var G, L = Math.ceil(F(R) / (g / 4)), j = [], z = R / L, I = 4 / 3 * k(z / 2) / (1 + B(z / 2)),
                    H = f * n,
                    Q = c * n, Z = c * -s, U = f * s;
                for (G = 0; G < L; G++) m = B(i = A + G * z), p = k(i), O = B(i += z), T = k(i), j.push(m - I * p, p + I * m, O + I * T, T - I * O, O, T);
                for (G = 0; G < j.length; G += 2) m = j[G], p = j[G + 1], j[G] = m * H + p * Z + N, j[G + 1] = m * Q + p * U + D;
                return j[G - 2] = a, j[G - 1] = h, j
            }
        }

        function stringToRawPath(e) {
            function ib(e, t, n, s) {
                f = (n - e) / 3, c = (s - t) / 3, a.push(e + f, t + c, n - f, s - c, n, s)
            }

            var t, n, s, i, r, o, a, h, u, f, c, l, g, d, v, m = (e + "").replace(b, function (e) {
                var t = +e;
                return t < 1e-4 && -1e-4 < t ? 0 : t
            }).match(E) || [], p = [], x = 0, y = 0, w = m.length, C = 0, M = "ERROR: malformed path: " + e;
            if (!e || !isNaN(m[0]) || isNaN(m[1])) return console.log(M), p;
            for (t = 0; t < w; t++) if (g = r, isNaN(m[t]) ? o = (r = m[t].toUpperCase()) !== m[t] : t--, s = +m[t + 1], i = +m[t + 2], o && (s += x, i += y), t || (h = s, u = i), "M" === r) a && (a.length < 8 ? --p.length : C += a.length), x = h = s, y = u = i, a = [s, i], p.push(a), t += 2, r = "L"; else if ("C" === r) o || (x = y = 0), (a = a || [0, 0]).push(s, i, x + 1 * m[t + 3], y + 1 * m[t + 4], x += 1 * m[t + 5], y += 1 * m[t + 6]), t += 6; else if ("S" === r) f = x, c = y, "C" !== g && "S" !== g || (f += x - a[a.length - 4], c += y - a[a.length - 3]), o || (x = y = 0), a.push(f, c, s, i, x += 1 * m[t + 3], y += 1 * m[t + 4]), t += 4; else if ("Q" === r) f = x + 2 / 3 * (s - x), c = y + 2 / 3 * (i - y), o || (x = y = 0), x += 1 * m[t + 3], y += 1 * m[t + 4], a.push(f, c, x + 2 / 3 * (s - x), y + 2 / 3 * (i - y), x, y), t += 4; else if ("T" === r) f = x - a[a.length - 4], c = y - a[a.length - 3], a.push(x + f, y + c, s + 2 / 3 * (x + 1.5 * f - s), i + 2 / 3 * (y + 1.5 * c - i), x = s, y = i), t += 2; else if ("H" === r) ib(x, y, x = s, y), t += 1; else if ("V" === r) ib(x, y, x, y = s + (o ? y - x : 0)), t += 1; else if ("L" === r || "Z" === r) "Z" === r && (s = h, i = u, a.closed = !0), ("L" === r || .5 < F(x - s) || .5 < F(y - i)) && (ib(x, y, s, i), "L" === r && (t += 2)), x = s, y = i; else if ("A" === r) {
                if (d = m[t + 4], v = m[t + 5], f = m[t + 6], c = m[t + 7], n = 7, 1 < d.length && (d.length < 3 ? (c = f, f = v, n--) : (c = v, f = d.substr(2), n -= 2), v = d.charAt(1), d = d.charAt(0)), l = arcToSegment(x, y, +m[t + 1], +m[t + 2], +m[t + 3], +d, +v, (o ? x : 0) + 1 * f, (o ? y : 0) + 1 * c), t += n, l) for (n = 0; n < l.length; n++) a.push(l[n]);
                x = a[a.length - 2], y = a[a.length - 1]
            } else console.log(M);
            return (t = a.length) < 6 ? (p.pop(), t = 0) : a[0] === a[t - 2] && a[1] === a[t - 1] && (a.closed = !0), p.totalPoints = C + t, p
        }

        function p() {
            return y || "undefined" != typeof window && (y = window.gsap)
        }

        function q() {
            return false;
        }

        function s(e) {
            return ~~(1e3 * e + (e < 0 ? -.5 : .5)) / 1e3
        }

        function v() {
            return String.fromCharCode.apply(null, arguments)
        }

        function C(e, t, n, s, i, r, o, a, h, u, f) {
            var c, l = (e + n) / 2, g = (t + s) / 2, d = (n + i) / 2, v = (s + r) / 2, m = (i + o) / 2, p = (r + a) / 2,
                x = (l + d) / 2, y = (g + v) / 2, w = (d + m) / 2, M = (v + p) / 2, E = (x + w) / 2, b = (y + M) / 2,
                P = o - e, S = a - t, N = Math.abs((n - o) * S - (s - a) * P), D = Math.abs((i - o) * S - (r - a) * P);
            return u || (u = [{x: e, y: t}, {x: o, y: a}], f = 1), u.splice(f || u.length - 1, 0, {
                x: E,
                y: b
            }), h * (P * P + S * S) < (N + D) * (N + D) && (c = u.length, C(e, t, l, g, x, y, E, b, h, u, f), C(E, b, w, M, m, p, o, a, h, u, f + 1 + (u.length - c))), u
        }

        var y, i, t, r = "CustomEase", o = v(103, 114, 101, 101, 110, 115, 111, 99, 107, 46, 99, 111, 109),
            a = function () {
            }, x = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi, w = /[cLlsSaAhHvVtTqQ]/g,
            n = ((t = CustomEase.prototype).setData = function setData(e, t) {
                t = t || {};
                var n, s, i, r, o, a, h, u, f, c = (e = e || "0,0,1,1").match(x), l = 1, g = [], d = [],
                    v = t.precision || 1, m = v <= 1;
                if (this.data = e, (w.test(e) || ~e.indexOf("M") && e.indexOf("C") < 0) && (c = stringToRawPath(e)[0]), 4 === (n = c.length)) c.unshift(0, 0), c.push(1, 1), n = 8; else if ((n - 2) % 6) throw"Invalid CustomEase";
                for (0 == +c[0] && 1 == +c[n - 2] || function _normalize(e, t, n) {
                    n || 0 === n || (n = Math.max(+e[e.length - 1], +e[1]));
                    var s, i = -1 * e[0], r = -n, o = e.length, a = 1 / (+e[o - 2] + i),
                        h = -t || (Math.abs(e[o - 1] - e[1]) < .01 * (e[o - 2] - e[0]) ? function _findMinimum(e) {
                            var t, n = e.length, s = 1e20;
                            for (t = 1; t < n; t += 6) +e[t] < s && (s = +e[t]);
                            return s
                        }(e) + r : +e[o - 1] + r);
                    for (h = h ? 1 / h : -a, s = 0; s < o; s += 2) e[s] = (+e[s] + i) * a, e[s + 1] = (+e[s + 1] + r) * h
                }(c, t.height, t.originY), this.segment = c, r = 2; r < n; r += 6) s = {
                    x: +c[r - 2],
                    y: +c[r - 1]
                }, i = {
                    x: +c[r + 4],
                    y: +c[r + 5]
                }, g.push(s, i), C(s.x, s.y, +c[r], +c[r + 1], +c[r + 2], +c[r + 3], i.x, i.y, 1 / (2e5 * v), g, g.length - 1);
                for (n = g.length, r = 0; r < n; r++) h = g[r], u = g[r - 1] || h, h.x > u.x || u.y !== h.y && u.x === h.x || h === u ? (u.cx = h.x - u.x, u.cy = h.y - u.y, u.n = h, u.nx = h.x, m && 1 < r && 2 < Math.abs(u.cy / u.cx - g[r - 2].cy / g[r - 2].cx) && (m = 0), u.cx < l && (u.cx ? l = u.cx : (u.cx = .001, r === n - 1 && (u.x -= .001, l = Math.min(l, .001), m = 0)))) : (g.splice(r--, 1), n--);
                if (o = 1 / (n = 1 / l + 1 | 0), h = g[a = 0], m) {
                    for (r = 0; r < n; r++) f = r * o, h.nx < f && (h = g[++a]), s = h.y + (f - h.x) / h.cx * h.cy, d[r] = {
                        x: f,
                        cx: o,
                        y: s,
                        cy: 0,
                        nx: 9
                    }, r && (d[r - 1].cy = s - d[r - 1].y);
                    d[n - 1].cy = g[g.length - 1].y - s
                } else {
                    for (r = 0; r < n; r++) h.nx < r * o && (h = g[++a]), d[r] = h;
                    a < g.length - 1 && (d[r - 1] = g[g.length - 2])
                }
                return this.ease = function (e) {
                    var t = d[e * n | 0] || d[n - 1];
                    return t.nx < e && (t = t.n), t.y + (e - t.x) / t.cx * t.cy
                }, (this.ease.custom = this).id && y.registerEase(this.id, this.ease), this
            }, t.getSVGData = function getSVGData(e) {
                return CustomEase.getSVGData(this, e)
            }, CustomEase.create = function create(e, t, n) {
                return new CustomEase(e, t, n).ease
            }, CustomEase.register = function register(e) {

            }, CustomEase.get = function get(e) {
                return y.parseEase(e)
            }, CustomEase.getSVGData = function getSVGData(e, t) {
                var n, i, r, o, a, h, u, f, c, l, g = (t = t || {}).width || 100, d = t.height || 100, v = t.x || 0,
                    p = (t.y || 0) + d, x = y.utils.toArray(t.path)[0];
                if (t.invert && (d = -d, p = 0), "string" == typeof e && (e = y.parseEase(e)), e.custom && (e = e.custom), e instanceof CustomEase) n = function rawPathToString(e) {
                    !function _isNumber(e) {
                        return "number" == typeof e
                    }(e[0]) || (e = [e]);
                    var t, n, s, i, r = "", o = e.length;
                    for (n = 0; n < o; n++) {
                        for (i = e[n], r += "M" + m(i[0]) + "," + m(i[1]) + " C", t = i.length, s = 2; s < t; s++) r += m(i[s++]) + "," + m(i[s++]) + " " + m(i[s++]) + "," + m(i[s++]) + " " + m(i[s++]) + "," + m(i[s]) + " ";
                        i.closed && (r += "z")
                    }
                    return r
                }(function transformRawPath(e, t, n, s, i, r, o) {
                    for (var a, h, u, f, c, l = e.length; -1 < --l;) for (h = (a = e[l]).length, u = 0; u < h; u += 2) f = a[u], c = a[u + 1], a[u] = f * t + c * s + r, a[u + 1] = f * n + c * i + o;
                    return e._dirty = 1, e
                }([e.segment], g, 0, 0, -d, v, p)); else {
                    for (n = [v, p], o = 1 / (u = Math.max(5, 200 * (t.precision || 1))), f = 5 / (u += 2), c = s(v + o * g), i = ((l = s(p + e(o) * -d)) - p) / (c - v), r = 2; r < u; r++) a = s(v + r * o * g), h = s(p + e(r * o) * -d), (Math.abs((h - l) / (a - c) - i) > f || r === u - 1) && (n.push(c, l), i = (h - l) / (a - c)), c = a, l = h;
                    n = "M" + n.join(",")
                }
                return x && x.setAttribute("d", n), n
            }, CustomEase);

        function CustomEase(e, t, n) {
            this.setData(t, n)
        }

        this.CustomEase = n;
        if (typeof (window) === "undefined" || window !== e) {
            Object.defineProperty(e, "__esModule", {value: !0})
        } else {
            delete e.default
        }
    }
}

export default CustomEase;