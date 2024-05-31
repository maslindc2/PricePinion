var se = globalThis;
function ee(e) {
    return (se.__Zone_symbol_prefix || "__zone_symbol__") + e;
}
function ut() {
    let e = se.performance;
    function n(A) {
        e && e.mark && e.mark(A);
    }
    function a(A, r) {
        e && e.measure && e.measure(A, r);
    }
    n("Zone");
    let Y = class Y {
        static assertZonePatched() {
            if (se.Promise !== N.ZoneAwarePromise)
                throw new Error(
                    "Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)"
                );
        }
        static get root() {
            let r = Y.current;
            for (; r.parent; ) r = r.parent;
            return r;
        }
        static get current() {
            return m.zone;
        }
        static get currentTask() {
            return O;
        }
        static __load_patch(r, i, s = !1) {
            if (N.hasOwnProperty(r)) {
                let v = se[ee("forceDuplicateZoneCheck")] === !0;
                if (!s && v) throw Error("Already loaded patch: " + r);
            } else if (!se["__Zone_disable_" + r]) {
                let v = "Zone:" + r;
                n(v), (N[r] = i(se, Y, R)), a(v, v);
            }
        }
        get parent() {
            return this._parent;
        }
        get name() {
            return this._name;
        }
        constructor(r, i) {
            (this._parent = r),
                (this._name = i ? i.name || "unnamed" : "<root>"),
                (this._properties = (i && i.properties) || {}),
                (this._zoneDelegate = new u(
                    this,
                    this._parent && this._parent._zoneDelegate,
                    i
                ));
        }
        get(r) {
            let i = this.getZoneWith(r);
            if (i) return i._properties[r];
        }
        getZoneWith(r) {
            let i = this;
            for (; i; ) {
                if (i._properties.hasOwnProperty(r)) return i;
                i = i._parent;
            }
            return null;
        }
        fork(r) {
            if (!r) throw new Error("ZoneSpec required!");
            return this._zoneDelegate.fork(this, r);
        }
        wrap(r, i) {
            if (typeof r != "function")
                throw new Error("Expecting function got: " + r);
            let s = this._zoneDelegate.intercept(this, r, i),
                v = this;
            return function () {
                return v.runGuarded(s, this, arguments, i);
            };
        }
        run(r, i, s, v) {
            m = { parent: m, zone: this };
            try {
                return this._zoneDelegate.invoke(this, r, i, s, v);
            } finally {
                m = m.parent;
            }
        }
        runGuarded(r, i = null, s, v) {
            m = { parent: m, zone: this };
            try {
                try {
                    return this._zoneDelegate.invoke(this, r, i, s, v);
                } catch (x) {
                    if (this._zoneDelegate.handleError(this, x)) throw x;
                }
            } finally {
                m = m.parent;
            }
        }
        runTask(r, i, s) {
            if (r.zone != this)
                throw new Error(
                    "A task can only be run in the zone of creation! (Creation: " +
                        (r.zone || ne).name +
                        "; Execution: " +
                        this.name +
                        ")"
                );
            if (r.state === z && (r.type === F || r.type === g)) return;
            let v = r.state != G;
            v && r._transitionTo(G, d), r.runCount++;
            let x = O;
            (O = r), (m = { parent: m, zone: this });
            try {
                r.type == g &&
                    r.data &&
                    !r.data.isPeriodic &&
                    (r.cancelFn = void 0);
                try {
                    return this._zoneDelegate.invokeTask(this, r, i, s);
                } catch (M) {
                    if (this._zoneDelegate.handleError(this, M)) throw M;
                }
            } finally {
                r.state !== z &&
                    r.state !== X &&
                    (r.type == F || (r.data && r.data.isPeriodic)
                        ? v && r._transitionTo(d, G)
                        : ((r.runCount = 0),
                          this._updateTaskCount(r, -1),
                          v && r._transitionTo(z, G, z))),
                    (m = m.parent),
                    (O = x);
            }
        }
        scheduleTask(r) {
            if (r.zone && r.zone !== this) {
                let s = this;
                for (; s; ) {
                    if (s === r.zone)
                        throw Error(
                            `can not reschedule task to ${this.name} which is descendants of the original zone ${r.zone.name}`
                        );
                    s = s.parent;
                }
            }
            r._transitionTo(k, z);
            let i = [];
            (r._zoneDelegates = i), (r._zone = this);
            try {
                r = this._zoneDelegate.scheduleTask(this, r);
            } catch (s) {
                throw (
                    (r._transitionTo(X, k, z),
                    this._zoneDelegate.handleError(this, s),
                    s)
                );
            }
            return (
                r._zoneDelegates === i && this._updateTaskCount(r, 1),
                r.state == k && r._transitionTo(d, k),
                r
            );
        }
        scheduleMicroTask(r, i, s, v) {
            return this.scheduleTask(new _(V, r, i, s, v, void 0));
        }
        scheduleMacroTask(r, i, s, v, x) {
            return this.scheduleTask(new _(g, r, i, s, v, x));
        }
        scheduleEventTask(r, i, s, v, x) {
            return this.scheduleTask(new _(F, r, i, s, v, x));
        }
        cancelTask(r) {
            if (r.zone != this)
                throw new Error(
                    "A task can only be cancelled in the zone of creation! (Creation: " +
                        (r.zone || ne).name +
                        "; Execution: " +
                        this.name +
                        ")"
                );
            if (!(r.state !== d && r.state !== G)) {
                r._transitionTo(W, d, G);
                try {
                    this._zoneDelegate.cancelTask(this, r);
                } catch (i) {
                    throw (
                        (r._transitionTo(X, W),
                        this._zoneDelegate.handleError(this, i),
                        i)
                    );
                }
                return (
                    this._updateTaskCount(r, -1),
                    r._transitionTo(z, W),
                    (r.runCount = 0),
                    r
                );
            }
        }
        _updateTaskCount(r, i) {
            let s = r._zoneDelegates;
            i == -1 && (r._zoneDelegates = null);
            for (let v = 0; v < s.length; v++) s[v]._updateTaskCount(r.type, i);
        }
    };
    Y.__symbol__ = ee;
    let t = Y,
        c = {
            name: "",
            onHasTask: (A, r, i, s) => A.hasTask(i, s),
            onScheduleTask: (A, r, i, s) => A.scheduleTask(i, s),
            onInvokeTask: (A, r, i, s, v, x) => A.invokeTask(i, s, v, x),
            onCancelTask: (A, r, i, s) => A.cancelTask(i, s),
        };
    class u {
        get zone() {
            return this._zone;
        }
        constructor(r, i, s) {
            (this._taskCounts = { microTask: 0, macroTask: 0, eventTask: 0 }),
                (this._zone = r),
                (this._parentDelegate = i),
                (this._forkZS = s && (s && s.onFork ? s : i._forkZS)),
                (this._forkDlgt = s && (s.onFork ? i : i._forkDlgt)),
                (this._forkCurrZone =
                    s && (s.onFork ? this._zone : i._forkCurrZone)),
                (this._interceptZS = s && (s.onIntercept ? s : i._interceptZS)),
                (this._interceptDlgt =
                    s && (s.onIntercept ? i : i._interceptDlgt)),
                (this._interceptCurrZone =
                    s && (s.onIntercept ? this._zone : i._interceptCurrZone)),
                (this._invokeZS = s && (s.onInvoke ? s : i._invokeZS)),
                (this._invokeDlgt = s && (s.onInvoke ? i : i._invokeDlgt)),
                (this._invokeCurrZone =
                    s && (s.onInvoke ? this._zone : i._invokeCurrZone)),
                (this._handleErrorZS =
                    s && (s.onHandleError ? s : i._handleErrorZS)),
                (this._handleErrorDlgt =
                    s && (s.onHandleError ? i : i._handleErrorDlgt)),
                (this._handleErrorCurrZone =
                    s &&
                    (s.onHandleError ? this._zone : i._handleErrorCurrZone)),
                (this._scheduleTaskZS =
                    s && (s.onScheduleTask ? s : i._scheduleTaskZS)),
                (this._scheduleTaskDlgt =
                    s && (s.onScheduleTask ? i : i._scheduleTaskDlgt)),
                (this._scheduleTaskCurrZone =
                    s &&
                    (s.onScheduleTask ? this._zone : i._scheduleTaskCurrZone)),
                (this._invokeTaskZS =
                    s && (s.onInvokeTask ? s : i._invokeTaskZS)),
                (this._invokeTaskDlgt =
                    s && (s.onInvokeTask ? i : i._invokeTaskDlgt)),
                (this._invokeTaskCurrZone =
                    s && (s.onInvokeTask ? this._zone : i._invokeTaskCurrZone)),
                (this._cancelTaskZS =
                    s && (s.onCancelTask ? s : i._cancelTaskZS)),
                (this._cancelTaskDlgt =
                    s && (s.onCancelTask ? i : i._cancelTaskDlgt)),
                (this._cancelTaskCurrZone =
                    s && (s.onCancelTask ? this._zone : i._cancelTaskCurrZone)),
                (this._hasTaskZS = null),
                (this._hasTaskDlgt = null),
                (this._hasTaskDlgtOwner = null),
                (this._hasTaskCurrZone = null);
            let v = s && s.onHasTask,
                x = i && i._hasTaskZS;
            (v || x) &&
                ((this._hasTaskZS = v ? s : c),
                (this._hasTaskDlgt = i),
                (this._hasTaskDlgtOwner = this),
                (this._hasTaskCurrZone = this._zone),
                s.onScheduleTask ||
                    ((this._scheduleTaskZS = c),
                    (this._scheduleTaskDlgt = i),
                    (this._scheduleTaskCurrZone = this._zone)),
                s.onInvokeTask ||
                    ((this._invokeTaskZS = c),
                    (this._invokeTaskDlgt = i),
                    (this._invokeTaskCurrZone = this._zone)),
                s.onCancelTask ||
                    ((this._cancelTaskZS = c),
                    (this._cancelTaskDlgt = i),
                    (this._cancelTaskCurrZone = this._zone)));
        }
        fork(r, i) {
            return this._forkZS
                ? this._forkZS.onFork(this._forkDlgt, this.zone, r, i)
                : new t(r, i);
        }
        intercept(r, i, s) {
            return this._interceptZS
                ? this._interceptZS.onIntercept(
                      this._interceptDlgt,
                      this._interceptCurrZone,
                      r,
                      i,
                      s
                  )
                : i;
        }
        invoke(r, i, s, v, x) {
            return this._invokeZS
                ? this._invokeZS.onInvoke(
                      this._invokeDlgt,
                      this._invokeCurrZone,
                      r,
                      i,
                      s,
                      v,
                      x
                  )
                : i.apply(s, v);
        }
        handleError(r, i) {
            return this._handleErrorZS
                ? this._handleErrorZS.onHandleError(
                      this._handleErrorDlgt,
                      this._handleErrorCurrZone,
                      r,
                      i
                  )
                : !0;
        }
        scheduleTask(r, i) {
            let s = i;
            if (this._scheduleTaskZS)
                this._hasTaskZS &&
                    s._zoneDelegates.push(this._hasTaskDlgtOwner),
                    (s = this._scheduleTaskZS.onScheduleTask(
                        this._scheduleTaskDlgt,
                        this._scheduleTaskCurrZone,
                        r,
                        i
                    )),
                    s || (s = i);
            else if (i.scheduleFn) i.scheduleFn(i);
            else if (i.type == V) U(i);
            else throw new Error("Task is missing scheduleFn.");
            return s;
        }
        invokeTask(r, i, s, v) {
            return this._invokeTaskZS
                ? this._invokeTaskZS.onInvokeTask(
                      this._invokeTaskDlgt,
                      this._invokeTaskCurrZone,
                      r,
                      i,
                      s,
                      v
                  )
                : i.callback.apply(s, v);
        }
        cancelTask(r, i) {
            let s;
            if (this._cancelTaskZS)
                s = this._cancelTaskZS.onCancelTask(
                    this._cancelTaskDlgt,
                    this._cancelTaskCurrZone,
                    r,
                    i
                );
            else {
                if (!i.cancelFn) throw Error("Task is not cancelable");
                s = i.cancelFn(i);
            }
            return s;
        }
        hasTask(r, i) {
            try {
                this._hasTaskZS &&
                    this._hasTaskZS.onHasTask(
                        this._hasTaskDlgt,
                        this._hasTaskCurrZone,
                        r,
                        i
                    );
            } catch (s) {
                this.handleError(r, s);
            }
        }
        _updateTaskCount(r, i) {
            let s = this._taskCounts,
                v = s[r],
                x = (s[r] = v + i);
            if (x < 0)
                throw new Error("More tasks executed then were scheduled.");
            if (v == 0 || x == 0) {
                let M = {
                    microTask: s.microTask > 0,
                    macroTask: s.macroTask > 0,
                    eventTask: s.eventTask > 0,
                    change: r,
                };
                this.hasTask(this._zone, M);
            }
        }
    }
    class _ {
        constructor(r, i, s, v, x, M) {
            if (
                ((this._zone = null),
                (this.runCount = 0),
                (this._zoneDelegates = null),
                (this._state = "notScheduled"),
                (this.type = r),
                (this.source = i),
                (this.data = v),
                (this.scheduleFn = x),
                (this.cancelFn = M),
                !s)
            )
                throw new Error("callback is not defined");
            this.callback = s;
            let he = this;
            r === F && v && v.useG
                ? (this.invoke = _.invokeTask)
                : (this.invoke = function () {
                      return _.invokeTask.call(se, he, this, arguments);
                  });
        }
        static invokeTask(r, i, s) {
            r || (r = this), K++;
            try {
                return r.runCount++, r.zone.runTask(r, i, s);
            } finally {
                K == 1 && j(), K--;
            }
        }
        get zone() {
            return this._zone;
        }
        get state() {
            return this._state;
        }
        cancelScheduleRequest() {
            this._transitionTo(z, k);
        }
        _transitionTo(r, i, s) {
            if (this._state === i || this._state === s)
                (this._state = r), r == z && (this._zoneDelegates = null);
            else
                throw new Error(
                    `${this.type} '${this.source}': can not transition to '${r}', expecting state '${i}'${s ? " or '" + s + "'" : ""}, was '${this._state}'.`
                );
        }
        toString() {
            return this.data && typeof this.data.handleId < "u"
                ? this.data.handleId.toString()
                : Object.prototype.toString.call(this);
        }
        toJSON() {
            return {
                type: this.type,
                state: this.state,
                source: this.source,
                zone: this.zone.name,
                runCount: this.runCount,
            };
        }
    }
    let E = ee("setTimeout"),
        y = ee("Promise"),
        C = ee("then"),
        T = [],
        I = !1,
        w;
    function Z(A) {
        if ((w || (se[y] && (w = se[y].resolve(0))), w)) {
            let r = w[C];
            r || (r = w.then), r.call(w, A);
        } else se[E](A, 0);
    }
    function U(A) {
        K === 0 && T.length === 0 && Z(j), A && T.push(A);
    }
    function j() {
        if (!I) {
            for (I = !0; T.length; ) {
                let A = T;
                T = [];
                for (let r = 0; r < A.length; r++) {
                    let i = A[r];
                    try {
                        i.zone.runTask(i, null, null);
                    } catch (s) {
                        R.onUnhandledError(s);
                    }
                }
            }
            R.microtaskDrainDone(), (I = !1);
        }
    }
    let ne = { name: "NO ZONE" },
        z = "notScheduled",
        k = "scheduling",
        d = "scheduled",
        G = "running",
        W = "canceling",
        X = "unknown",
        V = "microTask",
        g = "macroTask",
        F = "eventTask",
        N = {},
        R = {
            symbol: ee,
            currentZoneFrame: () => m,
            onUnhandledError: q,
            microtaskDrainDone: q,
            scheduleMicroTask: U,
            showUncaughtError: () => !t[ee("ignoreConsoleErrorUncaughtError")],
            patchEventTarget: () => [],
            patchOnProperties: q,
            patchMethod: () => q,
            bindArguments: () => [],
            patchThen: () => q,
            patchMacroTask: () => q,
            patchEventPrototype: () => q,
            isIEOrEdge: () => !1,
            getGlobalObjects: () => {},
            ObjectDefineProperty: () => q,
            ObjectGetOwnPropertyDescriptor: () => {},
            ObjectCreate: () => {},
            ArraySlice: () => [],
            patchClass: () => q,
            wrapWithCurrentZone: () => q,
            filterProperties: () => [],
            attachOriginToPatched: () => q,
            _redefineProperty: () => q,
            patchCallbacks: () => q,
            nativeScheduleMicroTask: Z,
        },
        m = { parent: null, zone: new t(null, null) },
        O = null,
        K = 0;
    function q() {}
    return a("Zone", "Zone"), t;
}
function ft() {
    let e = globalThis,
        n = e[ee("forceDuplicateZoneCheck")] === !0;
    if (e.Zone && (n || typeof e.Zone.__symbol__ != "function"))
        throw new Error("Zone already loaded.");
    return (e.Zone ??= ut()), e.Zone;
}
var ke = Object.getOwnPropertyDescriptor,
    Ze = Object.defineProperty,
    je = Object.getPrototypeOf,
    ht = Object.create,
    dt = Array.prototype.slice,
    Ae = "addEventListener",
    He = "removeEventListener",
    Ne = ee(Ae),
    Ie = ee(He),
    ie = "true",
    ce = "false",
    ve = ee("");
function xe(e, n) {
    return Zone.current.wrap(e, n);
}
function Ge(e, n, a, t, c) {
    return Zone.current.scheduleMacroTask(e, n, a, t, c);
}
var H = ee,
    Ce = typeof window < "u",
    Te = Ce ? window : void 0,
    $ = (Ce && Te) || globalThis,
    _t = "removeAttribute";
function Ve(e, n) {
    for (let a = e.length - 1; a >= 0; a--)
        typeof e[a] == "function" && (e[a] = xe(e[a], n + "_" + a));
    return e;
}
function Et(e, n) {
    let a = e.constructor.name;
    for (let t = 0; t < n.length; t++) {
        let c = n[t],
            u = e[c];
        if (u) {
            let _ = ke(e, c);
            if (!Ke(_)) continue;
            e[c] = ((E) => {
                let y = function () {
                    return E.apply(this, Ve(arguments, a + "." + c));
                };
                return le(y, E), y;
            })(u);
        }
    }
}
function Ke(e) {
    return e
        ? e.writable === !1
            ? !1
            : !(typeof e.get == "function" && typeof e.set > "u")
        : !0;
}
var Qe = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope,
    Se =
        !("nw" in $) &&
        typeof $.process < "u" &&
        {}.toString.call($.process) === "[object process]",
    Fe = !Se && !Qe && !!(Ce && Te.HTMLElement),
    et =
        typeof $.process < "u" &&
        {}.toString.call($.process) === "[object process]" &&
        !Qe &&
        !!(Ce && Te.HTMLElement),
    Re = {},
    Xe = function (e) {
        if (((e = e || $.event), !e)) return;
        let n = Re[e.type];
        n || (n = Re[e.type] = H("ON_PROPERTY" + e.type));
        let a = this || e.target || $,
            t = a[n],
            c;
        if (Fe && a === Te && e.type === "error") {
            let u = e;
            (c =
                t &&
                t.call(
                    this,
                    u.message,
                    u.filename,
                    u.lineno,
                    u.colno,
                    u.error
                )),
                c === !0 && e.preventDefault();
        } else
            (c = t && t.apply(this, arguments)),
                c != null && !c && e.preventDefault();
        return c;
    };
function Ye(e, n, a) {
    let t = ke(e, n);
    if (
        (!t && a && ke(a, n) && (t = { enumerable: !0, configurable: !0 }),
        !t || !t.configurable)
    )
        return;
    let c = H("on" + n + "patched");
    if (e.hasOwnProperty(c) && e[c]) return;
    delete t.writable, delete t.value;
    let u = t.get,
        _ = t.set,
        E = n.slice(2),
        y = Re[E];
    y || (y = Re[E] = H("ON_PROPERTY" + E)),
        (t.set = function (C) {
            let T = this;
            if ((!T && e === $ && (T = $), !T)) return;
            typeof T[y] == "function" && T.removeEventListener(E, Xe),
                _ && _.call(T, null),
                (T[y] = C),
                typeof C == "function" && T.addEventListener(E, Xe, !1);
        }),
        (t.get = function () {
            let C = this;
            if ((!C && e === $ && (C = $), !C)) return null;
            let T = C[y];
            if (T) return T;
            if (u) {
                let I = u.call(this);
                if (I)
                    return (
                        t.set.call(this, I),
                        typeof C[_t] == "function" && C.removeAttribute(n),
                        I
                    );
            }
            return null;
        }),
        Ze(e, n, t),
        (e[c] = !0);
}
function tt(e, n, a) {
    if (n) for (let t = 0; t < n.length; t++) Ye(e, "on" + n[t], a);
    else {
        let t = [];
        for (let c in e) c.slice(0, 2) == "on" && t.push(c);
        for (let c = 0; c < t.length; c++) Ye(e, t[c], a);
    }
}
var re = H("originalInstance");
function me(e) {
    let n = $[e];
    if (!n) return;
    ($[H(e)] = n),
        ($[e] = function () {
            let c = Ve(arguments, e);
            switch (c.length) {
                case 0:
                    this[re] = new n();
                    break;
                case 1:
                    this[re] = new n(c[0]);
                    break;
                case 2:
                    this[re] = new n(c[0], c[1]);
                    break;
                case 3:
                    this[re] = new n(c[0], c[1], c[2]);
                    break;
                case 4:
                    this[re] = new n(c[0], c[1], c[2], c[3]);
                    break;
                default:
                    throw new Error("Arg list too long.");
            }
        }),
        le($[e], n);
    let a = new n(function () {}),
        t;
    for (t in a)
        (e === "XMLHttpRequest" && t === "responseBlob") ||
            (function (c) {
                typeof a[c] == "function"
                    ? ($[e].prototype[c] = function () {
                          return this[re][c].apply(this[re], arguments);
                      })
                    : Ze($[e].prototype, c, {
                          set: function (u) {
                              typeof u == "function"
                                  ? ((this[re][c] = xe(u, e + "." + c)),
                                    le(this[re][c], u))
                                  : (this[re][c] = u);
                          },
                          get: function () {
                              return this[re][c];
                          },
                      });
            })(t);
    for (t in n) t !== "prototype" && n.hasOwnProperty(t) && ($[e][t] = n[t]);
}
function ae(e, n, a) {
    let t = e;
    for (; t && !t.hasOwnProperty(n); ) t = je(t);
    !t && e[n] && (t = e);
    let c = H(n),
        u = null;
    if (t && (!(u = t[c]) || !t.hasOwnProperty(c))) {
        u = t[c] = t[n];
        let _ = t && ke(t, n);
        if (Ke(_)) {
            let E = a(u, c, n);
            (t[n] = function () {
                return E(this, arguments);
            }),
                le(t[n], u);
        }
    }
    return u;
}
function Tt(e, n, a) {
    let t = null;
    function c(u) {
        let _ = u.data;
        return (
            (_.args[_.cbIdx] = function () {
                u.invoke.apply(this, arguments);
            }),
            t.apply(_.target, _.args),
            u
        );
    }
    t = ae(
        e,
        n,
        (u) =>
            function (_, E) {
                let y = a(_, E);
                return y.cbIdx >= 0 && typeof E[y.cbIdx] == "function"
                    ? Ge(y.name, E[y.cbIdx], y, c)
                    : u.apply(_, E);
            }
    );
}
function le(e, n) {
    e[H("OriginalDelegate")] = n;
}
var $e = !1,
    Me = !1;
function gt() {
    try {
        let e = Te.navigator.userAgent;
        if (e.indexOf("MSIE ") !== -1 || e.indexOf("Trident/") !== -1)
            return !0;
    } catch {}
    return !1;
}
function yt() {
    if ($e) return Me;
    $e = !0;
    try {
        let e = Te.navigator.userAgent;
        (e.indexOf("MSIE ") !== -1 ||
            e.indexOf("Trident/") !== -1 ||
            e.indexOf("Edge/") !== -1) &&
            (Me = !0);
    } catch {}
    return Me;
}
var Ee = !1;
if (typeof window < "u")
    try {
        let e = Object.defineProperty({}, "passive", {
            get: function () {
                Ee = !0;
            },
        });
        window.addEventListener("test", e, e),
            window.removeEventListener("test", e, e);
    } catch {
        Ee = !1;
    }
var pt = { useG: !0 },
    te = {},
    nt = {},
    rt = new RegExp("^" + ve + "(\\w+)(true|false)$"),
    ot = H("propagationStopped");
function st(e, n) {
    let a = (n ? n(e) : e) + ce,
        t = (n ? n(e) : e) + ie,
        c = ve + a,
        u = ve + t;
    (te[e] = {}), (te[e][ce] = c), (te[e][ie] = u);
}
function mt(e, n, a, t) {
    let c = (t && t.add) || Ae,
        u = (t && t.rm) || He,
        _ = (t && t.listeners) || "eventListeners",
        E = (t && t.rmAll) || "removeAllListeners",
        y = H(c),
        C = "." + c + ":",
        T = "prependListener",
        I = "." + T + ":",
        w = function (k, d, G) {
            if (k.isRemoved) return;
            let W = k.callback;
            typeof W == "object" &&
                W.handleEvent &&
                ((k.callback = (g) => W.handleEvent(g)),
                (k.originalDelegate = W));
            let X;
            try {
                k.invoke(k, d, [G]);
            } catch (g) {
                X = g;
            }
            let V = k.options;
            if (V && typeof V == "object" && V.once) {
                let g = k.originalDelegate ? k.originalDelegate : k.callback;
                d[u].call(d, G.type, g, V);
            }
            return X;
        };
    function Z(k, d, G) {
        if (((d = d || e.event), !d)) return;
        let W = k || d.target || e,
            X = W[te[d.type][G ? ie : ce]];
        if (X) {
            let V = [];
            if (X.length === 1) {
                let g = w(X[0], W, d);
                g && V.push(g);
            } else {
                let g = X.slice();
                for (let F = 0; F < g.length && !(d && d[ot] === !0); F++) {
                    let N = w(g[F], W, d);
                    N && V.push(N);
                }
            }
            if (V.length === 1) throw V[0];
            for (let g = 0; g < V.length; g++) {
                let F = V[g];
                n.nativeScheduleMicroTask(() => {
                    throw F;
                });
            }
        }
    }
    let U = function (k) {
            return Z(this, k, !1);
        },
        j = function (k) {
            return Z(this, k, !0);
        };
    function ne(k, d) {
        if (!k) return !1;
        let G = !0;
        d && d.useG !== void 0 && (G = d.useG);
        let W = d && d.vh,
            X = !0;
        d && d.chkDup !== void 0 && (X = d.chkDup);
        let V = !1;
        d && d.rt !== void 0 && (V = d.rt);
        let g = k;
        for (; g && !g.hasOwnProperty(c); ) g = je(g);
        if ((!g && k[c] && (g = k), !g || g[y])) return !1;
        let F = d && d.eventNameToString,
            N = {},
            R = (g[y] = g[c]),
            m = (g[H(u)] = g[u]),
            O = (g[H(_)] = g[_]),
            K = (g[H(E)] = g[E]),
            q;
        d && d.prepend && (q = g[H(d.prepend)] = g[d.prepend]);
        function Y(o, l) {
            return !Ee && typeof o == "object" && o
                ? !!o.capture
                : !Ee || !l
                  ? o
                  : typeof o == "boolean"
                    ? { capture: o, passive: !0 }
                    : o
                      ? typeof o == "object" && o.passive !== !1
                          ? { ...o, passive: !0 }
                          : o
                      : { passive: !0 };
        }
        let A = function (o) {
                if (!N.isExisting)
                    return R.call(
                        N.target,
                        N.eventName,
                        N.capture ? j : U,
                        N.options
                    );
            },
            r = function (o) {
                if (!o.isRemoved) {
                    let l = te[o.eventName],
                        h;
                    l && (h = l[o.capture ? ie : ce]);
                    let b = h && o.target[h];
                    if (b) {
                        for (let S = 0; S < b.length; S++)
                            if (b[S] === o) {
                                b.splice(S, 1),
                                    (o.isRemoved = !0),
                                    b.length === 0 &&
                                        ((o.allRemoved = !0),
                                        (o.target[h] = null));
                                break;
                            }
                    }
                }
                if (o.allRemoved)
                    return m.call(
                        o.target,
                        o.eventName,
                        o.capture ? j : U,
                        o.options
                    );
            },
            i = function (o) {
                return R.call(N.target, N.eventName, o.invoke, N.options);
            },
            s = function (o) {
                return q.call(N.target, N.eventName, o.invoke, N.options);
            },
            v = function (o) {
                return m.call(o.target, o.eventName, o.invoke, o.options);
            },
            x = G ? A : i,
            M = G ? r : v,
            he = function (o, l) {
                let h = typeof l;
                return (
                    (h === "function" && o.callback === l) ||
                    (h === "object" && o.originalDelegate === l)
                );
            },
            ge = d && d.diff ? d.diff : he,
            ue = Zone[H("UNPATCHED_EVENTS")],
            be = e[H("PASSIVE_EVENTS")],
            f = function (o, l, h, b, S = !1, p = !1) {
                return function () {
                    let P = this || e,
                        D = arguments[0];
                    d && d.transferEventName && (D = d.transferEventName(D));
                    let L = arguments[1];
                    if (!L) return o.apply(this, arguments);
                    if (Se && D === "uncaughtException")
                        return o.apply(this, arguments);
                    let B = !1;
                    if (typeof L != "function") {
                        if (!L.handleEvent) return o.apply(this, arguments);
                        B = !0;
                    }
                    if (W && !W(o, L, P, arguments)) return;
                    let J = Ee && !!be && be.indexOf(D) !== -1,
                        Q = Y(arguments[2], J),
                        ye =
                            Q &&
                            typeof Q == "object" &&
                            Q.signal &&
                            typeof Q.signal == "object"
                                ? Q.signal
                                : void 0;
                    if (ye?.aborted) return;
                    if (ue) {
                        for (let fe = 0; fe < ue.length; fe++)
                            if (D === ue[fe])
                                return J
                                    ? o.call(P, D, L, Q)
                                    : o.apply(this, arguments);
                    }
                    let De = Q ? (typeof Q == "boolean" ? !0 : Q.capture) : !1,
                        Be = Q && typeof Q == "object" ? Q.once : !1,
                        lt = Zone.current,
                        Oe = te[D];
                    Oe || (st(D, F), (Oe = te[D]));
                    let Ue = Oe[De ? ie : ce],
                        de = P[Ue],
                        We = !1;
                    if (de) {
                        if (((We = !0), X)) {
                            for (let fe = 0; fe < de.length; fe++)
                                if (ge(de[fe], L)) return;
                        }
                    } else de = P[Ue] = [];
                    let Pe,
                        qe = P.constructor.name,
                        ze = nt[qe];
                    ze && (Pe = ze[D]),
                        Pe || (Pe = qe + l + (F ? F(D) : D)),
                        (N.options = Q),
                        Be && (N.options.once = !1),
                        (N.target = P),
                        (N.capture = De),
                        (N.eventName = D),
                        (N.isExisting = We);
                    let pe = G ? pt : void 0;
                    pe && (pe.taskData = N), ye && (N.options.signal = void 0);
                    let oe = lt.scheduleEventTask(Pe, L, pe, h, b);
                    if (
                        (ye &&
                            ((N.options.signal = ye),
                            o.call(
                                ye,
                                "abort",
                                () => {
                                    oe.zone.cancelTask(oe);
                                },
                                { once: !0 }
                            )),
                        (N.target = null),
                        pe && (pe.taskData = null),
                        Be && (Q.once = !0),
                        (!Ee && typeof oe.options == "boolean") ||
                            (oe.options = Q),
                        (oe.target = P),
                        (oe.capture = De),
                        (oe.eventName = D),
                        B && (oe.originalDelegate = L),
                        p ? de.unshift(oe) : de.push(oe),
                        S)
                    )
                        return P;
                };
            };
        return (
            (g[c] = f(R, C, x, M, V)),
            q && (g[T] = f(q, I, s, M, V, !0)),
            (g[u] = function () {
                let o = this || e,
                    l = arguments[0];
                d && d.transferEventName && (l = d.transferEventName(l));
                let h = arguments[2],
                    b = h ? (typeof h == "boolean" ? !0 : h.capture) : !1,
                    S = arguments[1];
                if (!S) return m.apply(this, arguments);
                if (W && !W(m, S, o, arguments)) return;
                let p = te[l],
                    P;
                p && (P = p[b ? ie : ce]);
                let D = P && o[P];
                if (D)
                    for (let L = 0; L < D.length; L++) {
                        let B = D[L];
                        if (ge(B, S)) {
                            if (
                                (D.splice(L, 1),
                                (B.isRemoved = !0),
                                D.length === 0 &&
                                    ((B.allRemoved = !0),
                                    (o[P] = null),
                                    !b && typeof l == "string"))
                            ) {
                                let J = ve + "ON_PROPERTY" + l;
                                o[J] = null;
                            }
                            return B.zone.cancelTask(B), V ? o : void 0;
                        }
                    }
                return m.apply(this, arguments);
            }),
            (g[_] = function () {
                let o = this || e,
                    l = arguments[0];
                d && d.transferEventName && (l = d.transferEventName(l));
                let h = [],
                    b = it(o, F ? F(l) : l);
                for (let S = 0; S < b.length; S++) {
                    let p = b[S],
                        P = p.originalDelegate
                            ? p.originalDelegate
                            : p.callback;
                    h.push(P);
                }
                return h;
            }),
            (g[E] = function () {
                let o = this || e,
                    l = arguments[0];
                if (l) {
                    d && d.transferEventName && (l = d.transferEventName(l));
                    let h = te[l];
                    if (h) {
                        let b = h[ce],
                            S = h[ie],
                            p = o[b],
                            P = o[S];
                        if (p) {
                            let D = p.slice();
                            for (let L = 0; L < D.length; L++) {
                                let B = D[L],
                                    J = B.originalDelegate
                                        ? B.originalDelegate
                                        : B.callback;
                                this[u].call(this, l, J, B.options);
                            }
                        }
                        if (P) {
                            let D = P.slice();
                            for (let L = 0; L < D.length; L++) {
                                let B = D[L],
                                    J = B.originalDelegate
                                        ? B.originalDelegate
                                        : B.callback;
                                this[u].call(this, l, J, B.options);
                            }
                        }
                    }
                } else {
                    let h = Object.keys(o);
                    for (let b = 0; b < h.length; b++) {
                        let S = h[b],
                            p = rt.exec(S),
                            P = p && p[1];
                        P && P !== "removeListener" && this[E].call(this, P);
                    }
                    this[E].call(this, "removeListener");
                }
                if (V) return this;
            }),
            le(g[c], R),
            le(g[u], m),
            K && le(g[E], K),
            O && le(g[_], O),
            !0
        );
    }
    let z = [];
    for (let k = 0; k < a.length; k++) z[k] = ne(a[k], t);
    return z;
}
function it(e, n) {
    if (!n) {
        let u = [];
        for (let _ in e) {
            let E = rt.exec(_),
                y = E && E[1];
            if (y && (!n || y === n)) {
                let C = e[_];
                if (C) for (let T = 0; T < C.length; T++) u.push(C[T]);
            }
        }
        return u;
    }
    let a = te[n];
    a || (st(n), (a = te[n]));
    let t = e[a[ce]],
        c = e[a[ie]];
    return t ? (c ? t.concat(c) : t.slice()) : c ? c.slice() : [];
}
function kt(e, n) {
    let a = e.Event;
    a &&
        a.prototype &&
        n.patchMethod(
            a.prototype,
            "stopImmediatePropagation",
            (t) =>
                function (c, u) {
                    (c[ot] = !0), t && t.apply(c, u);
                }
        );
}
function vt(e, n) {
    n.patchMethod(
        e,
        "queueMicrotask",
        (a) =>
            function (t, c) {
                Zone.current.scheduleMicroTask("queueMicrotask", c[0]);
            }
    );
}
var we = H("zoneTask");
function _e(e, n, a, t) {
    let c = null,
        u = null;
    (n += t), (a += t);
    let _ = {};
    function E(C) {
        let T = C.data;
        return (
            (T.args[0] = function () {
                return C.invoke.apply(this, arguments);
            }),
            (T.handleId = c.apply(e, T.args)),
            C
        );
    }
    function y(C) {
        return u.call(e, C.data.handleId);
    }
    (c = ae(
        e,
        n,
        (C) =>
            function (T, I) {
                if (typeof I[0] == "function") {
                    let w = {
                            isPeriodic: t === "Interval",
                            delay:
                                t === "Timeout" || t === "Interval"
                                    ? I[1] || 0
                                    : void 0,
                            args: I,
                        },
                        Z = I[0];
                    I[0] = function () {
                        try {
                            return Z.apply(this, arguments);
                        } finally {
                            w.isPeriodic ||
                                (typeof w.handleId == "number"
                                    ? delete _[w.handleId]
                                    : w.handleId && (w.handleId[we] = null));
                        }
                    };
                    let U = Ge(n, I[0], w, E, y);
                    if (!U) return U;
                    let j = U.data.handleId;
                    return (
                        typeof j == "number" ? (_[j] = U) : j && (j[we] = U),
                        j &&
                            j.ref &&
                            j.unref &&
                            typeof j.ref == "function" &&
                            typeof j.unref == "function" &&
                            ((U.ref = j.ref.bind(j)),
                            (U.unref = j.unref.bind(j))),
                        typeof j == "number" || j ? j : U
                    );
                } else return C.apply(e, I);
            }
    )),
        (u = ae(
            e,
            a,
            (C) =>
                function (T, I) {
                    let w = I[0],
                        Z;
                    typeof w == "number"
                        ? (Z = _[w])
                        : ((Z = w && w[we]), Z || (Z = w)),
                        Z && typeof Z.type == "string"
                            ? Z.state !== "notScheduled" &&
                              ((Z.cancelFn && Z.data.isPeriodic) ||
                                  Z.runCount === 0) &&
                              (typeof w == "number"
                                  ? delete _[w]
                                  : w && (w[we] = null),
                              Z.zone.cancelTask(Z))
                            : C.apply(e, I);
                }
        ));
}
function bt(e, n) {
    let { isBrowser: a, isMix: t } = n.getGlobalObjects();
    if ((!a && !t) || !e.customElements || !("customElements" in e)) return;
    let c = [
        "connectedCallback",
        "disconnectedCallback",
        "adoptedCallback",
        "attributeChangedCallback",
        "formAssociatedCallback",
        "formDisabledCallback",
        "formResetCallback",
        "formStateRestoreCallback",
    ];
    n.patchCallbacks(n, e.customElements, "customElements", "define", c);
}
function Pt(e, n) {
    if (Zone[n.symbol("patchEventTarget")]) return;
    let {
        eventNames: a,
        zoneSymbolEventNames: t,
        TRUE_STR: c,
        FALSE_STR: u,
        ZONE_SYMBOL_PREFIX: _,
    } = n.getGlobalObjects();
    for (let y = 0; y < a.length; y++) {
        let C = a[y],
            T = C + u,
            I = C + c,
            w = _ + T,
            Z = _ + I;
        (t[C] = {}), (t[C][u] = w), (t[C][c] = Z);
    }
    let E = e.EventTarget;
    if (!(!E || !E.prototype))
        return n.patchEventTarget(e, n, [E && E.prototype]), !0;
}
function wt(e, n) {
    n.patchEventPrototype(e, n);
}
function ct(e, n, a) {
    if (!a || a.length === 0) return n;
    let t = a.filter((u) => u.target === e);
    if (!t || t.length === 0) return n;
    let c = t[0].ignoreProperties;
    return n.filter((u) => c.indexOf(u) === -1);
}
function Je(e, n, a, t) {
    if (!e) return;
    let c = ct(e, n, a);
    tt(e, c, t);
}
function Le(e) {
    return Object.getOwnPropertyNames(e)
        .filter((n) => n.startsWith("on") && n.length > 2)
        .map((n) => n.substring(2));
}
function Rt(e, n) {
    if ((Se && !et) || Zone[e.symbol("patchEvents")]) return;
    let a = n.__Zone_ignore_on_properties,
        t = [];
    if (Fe) {
        let c = window;
        t = t.concat([
            "Document",
            "SVGElement",
            "Element",
            "HTMLElement",
            "HTMLBodyElement",
            "HTMLMediaElement",
            "HTMLFrameSetElement",
            "HTMLFrameElement",
            "HTMLIFrameElement",
            "HTMLMarqueeElement",
            "Worker",
        ]);
        let u = gt() ? [{ target: c, ignoreProperties: ["error"] }] : [];
        Je(c, Le(c), a && a.concat(u), je(c));
    }
    t = t.concat([
        "XMLHttpRequest",
        "XMLHttpRequestEventTarget",
        "IDBIndex",
        "IDBRequest",
        "IDBOpenDBRequest",
        "IDBDatabase",
        "IDBTransaction",
        "IDBCursor",
        "WebSocket",
    ]);
    for (let c = 0; c < t.length; c++) {
        let u = n[t[c]];
        u && u.prototype && Je(u.prototype, Le(u.prototype), a);
    }
}
function Ct(e) {
    e.__load_patch("legacy", (n) => {
        let a = n[e.__symbol__("legacyPatch")];
        a && a();
    }),
        e.__load_patch("timers", (n) => {
            let a = "set",
                t = "clear";
            _e(n, a, t, "Timeout"),
                _e(n, a, t, "Interval"),
                _e(n, a, t, "Immediate");
        }),
        e.__load_patch("requestAnimationFrame", (n) => {
            _e(n, "request", "cancel", "AnimationFrame"),
                _e(n, "mozRequest", "mozCancel", "AnimationFrame"),
                _e(n, "webkitRequest", "webkitCancel", "AnimationFrame");
        }),
        e.__load_patch("blocking", (n, a) => {
            let t = ["alert", "prompt", "confirm"];
            for (let c = 0; c < t.length; c++) {
                let u = t[c];
                ae(
                    n,
                    u,
                    (_, E, y) =>
                        function (C, T) {
                            return a.current.run(_, n, T, y);
                        }
                );
            }
        }),
        e.__load_patch("EventTarget", (n, a, t) => {
            wt(n, t), Pt(n, t);
            let c = n.XMLHttpRequestEventTarget;
            c && c.prototype && t.patchEventTarget(n, t, [c.prototype]);
        }),
        e.__load_patch("MutationObserver", (n, a, t) => {
            me("MutationObserver"), me("WebKitMutationObserver");
        }),
        e.__load_patch("IntersectionObserver", (n, a, t) => {
            me("IntersectionObserver");
        }),
        e.__load_patch("FileReader", (n, a, t) => {
            me("FileReader");
        }),
        e.__load_patch("on_property", (n, a, t) => {
            Rt(t, n);
        }),
        e.__load_patch("customElements", (n, a, t) => {
            bt(n, t);
        }),
        e.__load_patch("XHR", (n, a) => {
            C(n);
            let t = H("xhrTask"),
                c = H("xhrSync"),
                u = H("xhrListener"),
                _ = H("xhrScheduled"),
                E = H("xhrURL"),
                y = H("xhrErrorBeforeScheduled");
            function C(T) {
                let I = T.XMLHttpRequest;
                if (!I) return;
                let w = I.prototype;
                function Z(R) {
                    return R[t];
                }
                let U = w[Ne],
                    j = w[Ie];
                if (!U) {
                    let R = T.XMLHttpRequestEventTarget;
                    if (R) {
                        let m = R.prototype;
                        (U = m[Ne]), (j = m[Ie]);
                    }
                }
                let ne = "readystatechange",
                    z = "scheduled";
                function k(R) {
                    let m = R.data,
                        O = m.target;
                    (O[_] = !1), (O[y] = !1);
                    let K = O[u];
                    U || ((U = O[Ne]), (j = O[Ie])), K && j.call(O, ne, K);
                    let q = (O[u] = () => {
                        if (O.readyState === O.DONE)
                            if (!m.aborted && O[_] && R.state === z) {
                                let A = O[a.__symbol__("loadfalse")];
                                if (O.status !== 0 && A && A.length > 0) {
                                    let r = R.invoke;
                                    (R.invoke = function () {
                                        let i = O[a.__symbol__("loadfalse")];
                                        for (let s = 0; s < i.length; s++)
                                            i[s] === R && i.splice(s, 1);
                                        !m.aborted &&
                                            R.state === z &&
                                            r.call(R);
                                    }),
                                        A.push(R);
                                } else R.invoke();
                            } else !m.aborted && O[_] === !1 && (O[y] = !0);
                    });
                    return (
                        U.call(O, ne, q),
                        O[t] || (O[t] = R),
                        F.apply(O, m.args),
                        (O[_] = !0),
                        R
                    );
                }
                function d() {}
                function G(R) {
                    let m = R.data;
                    return (m.aborted = !0), N.apply(m.target, m.args);
                }
                let W = ae(
                        w,
                        "open",
                        () =>
                            function (R, m) {
                                return (
                                    (R[c] = m[2] == !1),
                                    (R[E] = m[1]),
                                    W.apply(R, m)
                                );
                            }
                    ),
                    X = "XMLHttpRequest.send",
                    V = H("fetchTaskAborting"),
                    g = H("fetchTaskScheduling"),
                    F = ae(
                        w,
                        "send",
                        () =>
                            function (R, m) {
                                if (a.current[g] === !0 || R[c])
                                    return F.apply(R, m);
                                {
                                    let O = {
                                            target: R,
                                            url: R[E],
                                            isPeriodic: !1,
                                            args: m,
                                            aborted: !1,
                                        },
                                        K = Ge(X, d, O, k, G);
                                    R &&
                                        R[y] === !0 &&
                                        !O.aborted &&
                                        K.state === z &&
                                        K.invoke();
                                }
                            }
                    ),
                    N = ae(
                        w,
                        "abort",
                        () =>
                            function (R, m) {
                                let O = Z(R);
                                if (O && typeof O.type == "string") {
                                    if (
                                        O.cancelFn == null ||
                                        (O.data && O.data.aborted)
                                    )
                                        return;
                                    O.zone.cancelTask(O);
                                } else if (a.current[V] === !0)
                                    return N.apply(R, m);
                            }
                    );
            }
        }),
        e.__load_patch("geolocation", (n) => {
            n.navigator &&
                n.navigator.geolocation &&
                Et(n.navigator.geolocation, [
                    "getCurrentPosition",
                    "watchPosition",
                ]);
        }),
        e.__load_patch("PromiseRejectionEvent", (n, a) => {
            function t(c) {
                return function (u) {
                    it(n, c).forEach((E) => {
                        let y = n.PromiseRejectionEvent;
                        if (y) {
                            let C = new y(c, {
                                promise: u.promise,
                                reason: u.rejection,
                            });
                            E.invoke(C);
                        }
                    });
                };
            }
            n.PromiseRejectionEvent &&
                ((a[H("unhandledPromiseRejectionHandler")] =
                    t("unhandledrejection")),
                (a[H("rejectionHandledHandler")] = t("rejectionhandled")));
        }),
        e.__load_patch("queueMicrotask", (n, a, t) => {
            vt(n, t);
        });
}
function St(e) {
    e.__load_patch("ZoneAwarePromise", (n, a, t) => {
        let c = Object.getOwnPropertyDescriptor,
            u = Object.defineProperty;
        function _(f) {
            if (f && f.toString === Object.prototype.toString) {
                let o = f.constructor && f.constructor.name;
                return (o || "") + ": " + JSON.stringify(f);
            }
            return f ? f.toString() : Object.prototype.toString.call(f);
        }
        let E = t.symbol,
            y = [],
            C = n[E("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== !1,
            T = E("Promise"),
            I = E("then"),
            w = "__creationTrace__";
        (t.onUnhandledError = (f) => {
            if (t.showUncaughtError()) {
                let o = f && f.rejection;
                o
                    ? console.error(
                          "Unhandled Promise rejection:",
                          o instanceof Error ? o.message : o,
                          "; Zone:",
                          f.zone.name,
                          "; Task:",
                          f.task && f.task.source,
                          "; Value:",
                          o,
                          o instanceof Error ? o.stack : void 0
                      )
                    : console.error(f);
            }
        }),
            (t.microtaskDrainDone = () => {
                for (; y.length; ) {
                    let f = y.shift();
                    try {
                        f.zone.runGuarded(() => {
                            throw f.throwOriginal ? f.rejection : f;
                        });
                    } catch (o) {
                        U(o);
                    }
                }
            });
        let Z = E("unhandledPromiseRejectionHandler");
        function U(f) {
            t.onUnhandledError(f);
            try {
                let o = a[Z];
                typeof o == "function" && o.call(this, f);
            } catch {}
        }
        function j(f) {
            return f && f.then;
        }
        function ne(f) {
            return f;
        }
        function z(f) {
            return M.reject(f);
        }
        let k = E("state"),
            d = E("value"),
            G = E("finally"),
            W = E("parentPromiseValue"),
            X = E("parentPromiseState"),
            V = "Promise.then",
            g = null,
            F = !0,
            N = !1,
            R = 0;
        function m(f, o) {
            return (l) => {
                try {
                    Y(f, o, l);
                } catch (h) {
                    Y(f, !1, h);
                }
            };
        }
        let O = function () {
                let f = !1;
                return function (l) {
                    return function () {
                        f || ((f = !0), l.apply(null, arguments));
                    };
                };
            },
            K = "Promise resolved with itself",
            q = E("currentTaskTrace");
        function Y(f, o, l) {
            let h = O();
            if (f === l) throw new TypeError(K);
            if (f[k] === g) {
                let b = null;
                try {
                    (typeof l == "object" || typeof l == "function") &&
                        (b = l && l.then);
                } catch (S) {
                    return (
                        h(() => {
                            Y(f, !1, S);
                        })(),
                        f
                    );
                }
                if (
                    o !== N &&
                    l instanceof M &&
                    l.hasOwnProperty(k) &&
                    l.hasOwnProperty(d) &&
                    l[k] !== g
                )
                    r(l), Y(f, l[k], l[d]);
                else if (o !== N && typeof b == "function")
                    try {
                        b.call(l, h(m(f, o)), h(m(f, !1)));
                    } catch (S) {
                        h(() => {
                            Y(f, !1, S);
                        })();
                    }
                else {
                    f[k] = o;
                    let S = f[d];
                    if (
                        ((f[d] = l),
                        f[G] === G && o === F && ((f[k] = f[X]), (f[d] = f[W])),
                        o === N && l instanceof Error)
                    ) {
                        let p =
                            a.currentTask &&
                            a.currentTask.data &&
                            a.currentTask.data[w];
                        p &&
                            u(l, q, {
                                configurable: !0,
                                enumerable: !1,
                                writable: !0,
                                value: p,
                            });
                    }
                    for (let p = 0; p < S.length; )
                        i(f, S[p++], S[p++], S[p++], S[p++]);
                    if (S.length == 0 && o == N) {
                        f[k] = R;
                        let p = l;
                        try {
                            throw new Error(
                                "Uncaught (in promise): " +
                                    _(l) +
                                    (l && l.stack
                                        ? `
` + l.stack
                                        : "")
                            );
                        } catch (P) {
                            p = P;
                        }
                        C && (p.throwOriginal = !0),
                            (p.rejection = l),
                            (p.promise = f),
                            (p.zone = a.current),
                            (p.task = a.currentTask),
                            y.push(p),
                            t.scheduleMicroTask();
                    }
                }
            }
            return f;
        }
        let A = E("rejectionHandledHandler");
        function r(f) {
            if (f[k] === R) {
                try {
                    let o = a[A];
                    o &&
                        typeof o == "function" &&
                        o.call(this, { rejection: f[d], promise: f });
                } catch {}
                f[k] = N;
                for (let o = 0; o < y.length; o++)
                    f === y[o].promise && y.splice(o, 1);
            }
        }
        function i(f, o, l, h, b) {
            r(f);
            let S = f[k],
                p = S
                    ? typeof h == "function"
                        ? h
                        : ne
                    : typeof b == "function"
                      ? b
                      : z;
            o.scheduleMicroTask(
                V,
                () => {
                    try {
                        let P = f[d],
                            D = !!l && G === l[G];
                        D && ((l[W] = P), (l[X] = S));
                        let L = o.run(
                            p,
                            void 0,
                            D && p !== z && p !== ne ? [] : [P]
                        );
                        Y(l, !0, L);
                    } catch (P) {
                        Y(l, !1, P);
                    }
                },
                l
            );
        }
        let s = "function ZoneAwarePromise() { [native code] }",
            v = function () {},
            x = n.AggregateError;
        class M {
            static toString() {
                return s;
            }
            static resolve(o) {
                return o instanceof M ? o : Y(new this(null), F, o);
            }
            static reject(o) {
                return Y(new this(null), N, o);
            }
            static withResolvers() {
                let o = {};
                return (
                    (o.promise = new M((l, h) => {
                        (o.resolve = l), (o.reject = h);
                    })),
                    o
                );
            }
            static any(o) {
                if (!o || typeof o[Symbol.iterator] != "function")
                    return Promise.reject(
                        new x([], "All promises were rejected")
                    );
                let l = [],
                    h = 0;
                try {
                    for (let p of o) h++, l.push(M.resolve(p));
                } catch {
                    return Promise.reject(
                        new x([], "All promises were rejected")
                    );
                }
                if (h === 0)
                    return Promise.reject(
                        new x([], "All promises were rejected")
                    );
                let b = !1,
                    S = [];
                return new M((p, P) => {
                    for (let D = 0; D < l.length; D++)
                        l[D].then(
                            (L) => {
                                b || ((b = !0), p(L));
                            },
                            (L) => {
                                S.push(L),
                                    h--,
                                    h === 0 &&
                                        ((b = !0),
                                        P(
                                            new x(
                                                S,
                                                "All promises were rejected"
                                            )
                                        ));
                            }
                        );
                });
            }
            static race(o) {
                let l,
                    h,
                    b = new this((P, D) => {
                        (l = P), (h = D);
                    });
                function S(P) {
                    l(P);
                }
                function p(P) {
                    h(P);
                }
                for (let P of o) j(P) || (P = this.resolve(P)), P.then(S, p);
                return b;
            }
            static all(o) {
                return M.allWithCallback(o);
            }
            static allSettled(o) {
                return (
                    this && this.prototype instanceof M ? this : M
                ).allWithCallback(o, {
                    thenCallback: (h) => ({ status: "fulfilled", value: h }),
                    errorCallback: (h) => ({ status: "rejected", reason: h }),
                });
            }
            static allWithCallback(o, l) {
                let h,
                    b,
                    S = new this((L, B) => {
                        (h = L), (b = B);
                    }),
                    p = 2,
                    P = 0,
                    D = [];
                for (let L of o) {
                    j(L) || (L = this.resolve(L));
                    let B = P;
                    try {
                        L.then(
                            (J) => {
                                (D[B] = l ? l.thenCallback(J) : J),
                                    p--,
                                    p === 0 && h(D);
                            },
                            (J) => {
                                l
                                    ? ((D[B] = l.errorCallback(J)),
                                      p--,
                                      p === 0 && h(D))
                                    : b(J);
                            }
                        );
                    } catch (J) {
                        b(J);
                    }
                    p++, P++;
                }
                return (p -= 2), p === 0 && h(D), S;
            }
            constructor(o) {
                let l = this;
                if (!(l instanceof M))
                    throw new Error("Must be an instanceof Promise.");
                (l[k] = g), (l[d] = []);
                try {
                    let h = O();
                    o && o(h(m(l, F)), h(m(l, N)));
                } catch (h) {
                    Y(l, !1, h);
                }
            }
            get [Symbol.toStringTag]() {
                return "Promise";
            }
            get [Symbol.species]() {
                return M;
            }
            then(o, l) {
                let h = this.constructor?.[Symbol.species];
                (!h || typeof h != "function") && (h = this.constructor || M);
                let b = new h(v),
                    S = a.current;
                return (
                    this[k] == g
                        ? this[d].push(S, b, o, l)
                        : i(this, S, b, o, l),
                    b
                );
            }
            catch(o) {
                return this.then(null, o);
            }
            finally(o) {
                let l = this.constructor?.[Symbol.species];
                (!l || typeof l != "function") && (l = M);
                let h = new l(v);
                h[G] = G;
                let b = a.current;
                return (
                    this[k] == g
                        ? this[d].push(b, h, o, o)
                        : i(this, b, h, o, o),
                    h
                );
            }
        }
        (M.resolve = M.resolve),
            (M.reject = M.reject),
            (M.race = M.race),
            (M.all = M.all);
        let he = (n[T] = n.Promise);
        n.Promise = M;
        let ge = E("thenPatched");
        function ue(f) {
            let o = f.prototype,
                l = c(o, "then");
            if (l && (l.writable === !1 || !l.configurable)) return;
            let h = o.then;
            (o[I] = h),
                (f.prototype.then = function (b, S) {
                    return new M((P, D) => {
                        h.call(this, P, D);
                    }).then(b, S);
                }),
                (f[ge] = !0);
        }
        t.patchThen = ue;
        function be(f) {
            return function (o, l) {
                let h = f.apply(o, l);
                if (h instanceof M) return h;
                let b = h.constructor;
                return b[ge] || ue(b), h;
            };
        }
        return (
            he && (ue(he), ae(n, "fetch", (f) => be(f))),
            (Promise[a.__symbol__("uncaughtPromiseErrors")] = y),
            M
        );
    });
}
function Dt(e) {
    e.__load_patch("toString", (n) => {
        let a = Function.prototype.toString,
            t = H("OriginalDelegate"),
            c = H("Promise"),
            u = H("Error"),
            _ = function () {
                if (typeof this == "function") {
                    let T = this[t];
                    if (T)
                        return typeof T == "function"
                            ? a.call(T)
                            : Object.prototype.toString.call(T);
                    if (this === Promise) {
                        let I = n[c];
                        if (I) return a.call(I);
                    }
                    if (this === Error) {
                        let I = n[u];
                        if (I) return a.call(I);
                    }
                }
                return a.call(this);
            };
        (_[t] = a), (Function.prototype.toString = _);
        let E = Object.prototype.toString,
            y = "[object Promise]";
        Object.prototype.toString = function () {
            return typeof Promise == "function" && this instanceof Promise
                ? y
                : E.call(this);
        };
    });
}
function Ot(e, n, a, t, c) {
    let u = Zone.__symbol__(t);
    if (n[u]) return;
    let _ = (n[u] = n[t]);
    (n[t] = function (E, y, C) {
        return (
            y &&
                y.prototype &&
                c.forEach(function (T) {
                    let I = `${a}.${t}::` + T,
                        w = y.prototype;
                    try {
                        if (w.hasOwnProperty(T)) {
                            let Z = e.ObjectGetOwnPropertyDescriptor(w, T);
                            Z && Z.value
                                ? ((Z.value = e.wrapWithCurrentZone(
                                      Z.value,
                                      I
                                  )),
                                  e._redefineProperty(y.prototype, T, Z))
                                : w[T] &&
                                  (w[T] = e.wrapWithCurrentZone(w[T], I));
                        } else w[T] && (w[T] = e.wrapWithCurrentZone(w[T], I));
                    } catch {}
                }),
            _.call(n, E, y, C)
        );
    }),
        e.attachOriginToPatched(n[t], _);
}
function Nt(e) {
    e.__load_patch("util", (n, a, t) => {
        let c = Le(n);
        (t.patchOnProperties = tt),
            (t.patchMethod = ae),
            (t.bindArguments = Ve),
            (t.patchMacroTask = Tt);
        let u = a.__symbol__("BLACK_LISTED_EVENTS"),
            _ = a.__symbol__("UNPATCHED_EVENTS");
        n[_] && (n[u] = n[_]),
            n[u] && (a[u] = a[_] = n[u]),
            (t.patchEventPrototype = kt),
            (t.patchEventTarget = mt),
            (t.isIEOrEdge = yt),
            (t.ObjectDefineProperty = Ze),
            (t.ObjectGetOwnPropertyDescriptor = ke),
            (t.ObjectCreate = ht),
            (t.ArraySlice = dt),
            (t.patchClass = me),
            (t.wrapWithCurrentZone = xe),
            (t.filterProperties = ct),
            (t.attachOriginToPatched = le),
            (t._redefineProperty = Object.defineProperty),
            (t.patchCallbacks = Ot),
            (t.getGlobalObjects = () => ({
                globalSources: nt,
                zoneSymbolEventNames: te,
                eventNames: c,
                isBrowser: Fe,
                isMix: et,
                isNode: Se,
                TRUE_STR: ie,
                FALSE_STR: ce,
                ZONE_SYMBOL_PREFIX: ve,
                ADD_EVENT_LISTENER_STR: Ae,
                REMOVE_EVENT_LISTENER_STR: He,
            }));
    });
}
function It(e) {
    St(e), Dt(e), Nt(e);
}
var at = ft();
It(at);
Ct(at);
