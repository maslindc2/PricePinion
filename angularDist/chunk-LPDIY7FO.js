var Xl = Object.defineProperty,
    ed = Object.defineProperties;
var td = Object.getOwnPropertyDescriptors;
var fn = Object.getOwnPropertySymbols;
var $s = Object.prototype.hasOwnProperty,
    Hs = Object.prototype.propertyIsEnumerable;
var Bs = (e, t, n) =>
        t in e
            ? Xl(e, t, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: n,
              })
            : (e[t] = n),
    xe = (e, t) => {
        for (var n in (t ||= {})) $s.call(t, n) && Bs(e, n, t[n]);
        if (fn) for (var n of fn(t)) Hs.call(t, n) && Bs(e, n, t[n]);
        return e;
    },
    lt = (e, t) => ed(e, td(t));
var XD = (e, t) => {
    var n = {};
    for (var r in e) $s.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
    if (e != null && fn)
        for (var r of fn(e)) t.indexOf(r) < 0 && Hs.call(e, r) && (n[r] = e[r]);
    return n;
};
var nd = (e, t, n) =>
    new Promise((r, o) => {
        var i = (u) => {
                try {
                    a(n.next(u));
                } catch (c) {
                    o(c);
                }
            },
            s = (u) => {
                try {
                    a(n.throw(u));
                } catch (c) {
                    o(c);
                }
            },
            a = (u) =>
                u.done ? r(u.value) : Promise.resolve(u.value).then(i, s);
        a((n = n.apply(e, t)).next());
    });
var Us = null,
    pn = !1,
    Wr = 1,
    gn = Symbol("SIGNAL");
function M(e) {
    let t = Us;
    return (Us = e), t;
}
function rd() {
    return pn;
}
var Yr = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: !1,
    producerNode: void 0,
    producerLastReadVersion: void 0,
    producerIndexOfThis: void 0,
    nextProducerIndex: 0,
    liveConsumerNode: void 0,
    liveConsumerIndexOfThis: void 0,
    consumerAllowSignalWrites: !1,
    consumerIsAlwaysLive: !1,
    producerMustRecompute: () => !1,
    producerRecomputeValue: () => {},
    consumerMarkedDirty: () => {},
    consumerOnSignalRead: () => {},
};
function od(e) {
    if (!(Xr(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Wr)) {
        if (!e.producerMustRecompute(e) && !mn(e)) {
            (e.dirty = !1), (e.lastCleanEpoch = Wr);
            return;
        }
        e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = Wr);
    }
}
function id(e) {
    if (e.liveConsumerNode === void 0) return;
    let t = pn;
    pn = !0;
    try {
        for (let n of e.liveConsumerNode) n.dirty || Gs(n);
    } finally {
        pn = t;
    }
}
function Gs(e) {
    (e.dirty = !0), id(e), e.consumerMarkedDirty?.(e);
}
function Qr(e) {
    return e && (e.nextProducerIndex = 0), M(e);
}
function Zr(e, t) {
    if (
        (M(t),
        !(
            !e ||
            e.producerNode === void 0 ||
            e.producerIndexOfThis === void 0 ||
            e.producerLastReadVersion === void 0
        ))
    ) {
        if (Xr(e))
            for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
                Jr(e.producerNode[n], e.producerIndexOfThis[n]);
        for (; e.producerNode.length > e.nextProducerIndex; )
            e.producerNode.pop(),
                e.producerLastReadVersion.pop(),
                e.producerIndexOfThis.pop();
    }
}
function mn(e) {
    hn(e);
    for (let t = 0; t < e.producerNode.length; t++) {
        let n = e.producerNode[t],
            r = e.producerLastReadVersion[t];
        if (r !== n.version || (od(n), r !== n.version)) return !0;
    }
    return !1;
}
function Kr(e) {
    if ((hn(e), Xr(e)))
        for (let t = 0; t < e.producerNode.length; t++)
            Jr(e.producerNode[t], e.producerIndexOfThis[t]);
    (e.producerNode.length =
        e.producerLastReadVersion.length =
        e.producerIndexOfThis.length =
            0),
        e.liveConsumerNode &&
            (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Jr(e, t) {
    if ((sd(e), hn(e), e.liveConsumerNode.length === 1))
        for (let r = 0; r < e.producerNode.length; r++)
            Jr(e.producerNode[r], e.producerIndexOfThis[r]);
    let n = e.liveConsumerNode.length - 1;
    if (
        ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
        (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
        e.liveConsumerNode.length--,
        e.liveConsumerIndexOfThis.length--,
        t < e.liveConsumerNode.length)
    ) {
        let r = e.liveConsumerIndexOfThis[t],
            o = e.liveConsumerNode[t];
        hn(o), (o.producerIndexOfThis[r] = t);
    }
}
function Xr(e) {
    return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function hn(e) {
    (e.producerNode ??= []),
        (e.producerIndexOfThis ??= []),
        (e.producerLastReadVersion ??= []);
}
function sd(e) {
    (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function ad() {
    throw new Error();
}
var ud = ad;
function zs(e) {
    ud = e;
}
function Ws(e, t, n) {
    let r = Object.create(cd);
    n && (r.consumerAllowSignalWrites = !0), (r.fn = e), (r.schedule = t);
    let o = (u) => {
        r.cleanupFn = u;
    };
    function i(u) {
        return u.fn === null && u.schedule === null;
    }
    function s(u) {
        i(u) ||
            (Kr(u),
            u.cleanupFn(),
            (u.fn = null),
            (u.schedule = null),
            (u.cleanupFn = qr));
    }
    let a = () => {
        if (r.fn === null) return;
        if (rd())
            throw new Error(
                "Schedulers cannot synchronously execute watches while scheduling."
            );
        if (((r.dirty = !1), r.hasRun && !mn(r))) return;
        r.hasRun = !0;
        let u = Qr(r);
        try {
            r.cleanupFn(), (r.cleanupFn = qr), r.fn(o);
        } finally {
            Zr(r, u);
        }
    };
    return (
        (r.ref = {
            notify: () => Gs(r),
            run: a,
            cleanup: () => r.cleanupFn(),
            destroy: () => s(r),
            [gn]: r,
        }),
        r.ref
    );
}
var qr = () => {},
    cd = lt(xe({}, Yr), {
        consumerIsAlwaysLive: !0,
        consumerAllowSignalWrites: !1,
        consumerMarkedDirty: (e) => {
            e.schedule !== null && e.schedule(e.ref);
        },
        hasRun: !1,
        cleanupFn: qr,
    });
function g(e) {
    return typeof e == "function";
}
function dt(e) {
    let n = e((r) => {
        Error.call(r), (r.stack = new Error().stack);
    });
    return (
        (n.prototype = Object.create(Error.prototype)),
        (n.prototype.constructor = n),
        n
    );
}
var yn = dt(
    (e) =>
        function (n) {
            e(this),
                (this.message = n
                    ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
                    : ""),
                (this.name = "UnsubscriptionError"),
                (this.errors = n);
        }
);
function Ve(e, t) {
    if (e) {
        let n = e.indexOf(t);
        0 <= n && e.splice(n, 1);
    }
}
var L = class e {
    constructor(t) {
        (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
    }
    unsubscribe() {
        let t;
        if (!this.closed) {
            this.closed = !0;
            let { _parentage: n } = this;
            if (n)
                if (((this._parentage = null), Array.isArray(n)))
                    for (let i of n) i.remove(this);
                else n.remove(this);
            let { initialTeardown: r } = this;
            if (g(r))
                try {
                    r();
                } catch (i) {
                    t = i instanceof yn ? i.errors : [i];
                }
            let { _finalizers: o } = this;
            if (o) {
                this._finalizers = null;
                for (let i of o)
                    try {
                        qs(i);
                    } catch (s) {
                        (t = t ?? []),
                            s instanceof yn
                                ? (t = [...t, ...s.errors])
                                : t.push(s);
                    }
            }
            if (t) throw new yn(t);
        }
    }
    add(t) {
        var n;
        if (t && t !== this)
            if (this.closed) qs(t);
            else {
                if (t instanceof e) {
                    if (t.closed || t._hasParent(this)) return;
                    t._addParent(this);
                }
                (this._finalizers =
                    (n = this._finalizers) !== null && n !== void 0
                        ? n
                        : []).push(t);
            }
    }
    _hasParent(t) {
        let { _parentage: n } = this;
        return n === t || (Array.isArray(n) && n.includes(t));
    }
    _addParent(t) {
        let { _parentage: n } = this;
        this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
    }
    _removeParent(t) {
        let { _parentage: n } = this;
        n === t ? (this._parentage = null) : Array.isArray(n) && Ve(n, t);
    }
    remove(t) {
        let { _finalizers: n } = this;
        n && Ve(n, t), t instanceof e && t._removeParent(this);
    }
};
L.EMPTY = (() => {
    let e = new L();
    return (e.closed = !0), e;
})();
var eo = L.EMPTY;
function Dn(e) {
    return (
        e instanceof L ||
        (e && "closed" in e && g(e.remove) && g(e.add) && g(e.unsubscribe))
    );
}
function qs(e) {
    g(e) ? e() : e.unsubscribe();
}
var te = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1,
};
var ft = {
    setTimeout(e, t, ...n) {
        let { delegate: r } = ft;
        return r?.setTimeout
            ? r.setTimeout(e, t, ...n)
            : setTimeout(e, t, ...n);
    },
    clearTimeout(e) {
        let { delegate: t } = ft;
        return (t?.clearTimeout || clearTimeout)(e);
    },
    delegate: void 0,
};
function vn(e) {
    ft.setTimeout(() => {
        let { onUnhandledError: t } = te;
        if (t) t(e);
        else throw e;
    });
}
function Be() {}
var Ys = to("C", void 0, void 0);
function Qs(e) {
    return to("E", void 0, e);
}
function Zs(e) {
    return to("N", e, void 0);
}
function to(e, t, n) {
    return { kind: e, value: t, error: n };
}
var $e = null;
function pt(e) {
    if (te.useDeprecatedSynchronousErrorHandling) {
        let t = !$e;
        if ((t && ($e = { errorThrown: !1, error: null }), e(), t)) {
            let { errorThrown: n, error: r } = $e;
            if ((($e = null), n)) throw r;
        }
    } else e();
}
function Ks(e) {
    te.useDeprecatedSynchronousErrorHandling &&
        $e &&
        (($e.errorThrown = !0), ($e.error = e));
}
var He = class extends L {
        constructor(t) {
            super(),
                (this.isStopped = !1),
                t
                    ? ((this.destination = t), Dn(t) && t.add(this))
                    : (this.destination = fd);
        }
        static create(t, n, r) {
            return new ye(t, n, r);
        }
        next(t) {
            this.isStopped ? ro(Zs(t), this) : this._next(t);
        }
        error(t) {
            this.isStopped
                ? ro(Qs(t), this)
                : ((this.isStopped = !0), this._error(t));
        }
        complete() {
            this.isStopped
                ? ro(Ys, this)
                : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
            this.closed ||
                ((this.isStopped = !0),
                super.unsubscribe(),
                (this.destination = null));
        }
        _next(t) {
            this.destination.next(t);
        }
        _error(t) {
            try {
                this.destination.error(t);
            } finally {
                this.unsubscribe();
            }
        }
        _complete() {
            try {
                this.destination.complete();
            } finally {
                this.unsubscribe();
            }
        }
    },
    ld = Function.prototype.bind;
function no(e, t) {
    return ld.call(e, t);
}
var oo = class {
        constructor(t) {
            this.partialObserver = t;
        }
        next(t) {
            let { partialObserver: n } = this;
            if (n.next)
                try {
                    n.next(t);
                } catch (r) {
                    In(r);
                }
        }
        error(t) {
            let { partialObserver: n } = this;
            if (n.error)
                try {
                    n.error(t);
                } catch (r) {
                    In(r);
                }
            else In(t);
        }
        complete() {
            let { partialObserver: t } = this;
            if (t.complete)
                try {
                    t.complete();
                } catch (n) {
                    In(n);
                }
        }
    },
    ye = class extends He {
        constructor(t, n, r) {
            super();
            let o;
            if (g(t) || !t)
                o = {
                    next: t ?? void 0,
                    error: n ?? void 0,
                    complete: r ?? void 0,
                };
            else {
                let i;
                this && te.useDeprecatedNextContext
                    ? ((i = Object.create(t)),
                      (i.unsubscribe = () => this.unsubscribe()),
                      (o = {
                          next: t.next && no(t.next, i),
                          error: t.error && no(t.error, i),
                          complete: t.complete && no(t.complete, i),
                      }))
                    : (o = t);
            }
            this.destination = new oo(o);
        }
    };
function In(e) {
    te.useDeprecatedSynchronousErrorHandling ? Ks(e) : vn(e);
}
function dd(e) {
    throw e;
}
function ro(e, t) {
    let { onStoppedNotification: n } = te;
    n && ft.setTimeout(() => n(e, t));
}
var fd = { closed: !0, next: Be, error: dd, complete: Be };
var ht = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function B(e) {
    return e;
}
function pd(...e) {
    return io(e);
}
function io(e) {
    return e.length === 0
        ? B
        : e.length === 1
          ? e[0]
          : function (n) {
                return e.reduce((r, o) => o(r), n);
            };
}
var C = (() => {
    class e {
        constructor(n) {
            n && (this._subscribe = n);
        }
        lift(n) {
            let r = new e();
            return (r.source = this), (r.operator = n), r;
        }
        subscribe(n, r, o) {
            let i = gd(n) ? n : new ye(n, r, o);
            return (
                pt(() => {
                    let { operator: s, source: a } = this;
                    i.add(
                        s
                            ? s.call(i, a)
                            : a
                              ? this._subscribe(i)
                              : this._trySubscribe(i)
                    );
                }),
                i
            );
        }
        _trySubscribe(n) {
            try {
                return this._subscribe(n);
            } catch (r) {
                n.error(r);
            }
        }
        forEach(n, r) {
            return (
                (r = Js(r)),
                new r((o, i) => {
                    let s = new ye({
                        next: (a) => {
                            try {
                                n(a);
                            } catch (u) {
                                i(u), s.unsubscribe();
                            }
                        },
                        error: i,
                        complete: o,
                    });
                    this.subscribe(s);
                })
            );
        }
        _subscribe(n) {
            var r;
            return (r = this.source) === null || r === void 0
                ? void 0
                : r.subscribe(n);
        }
        [ht]() {
            return this;
        }
        pipe(...n) {
            return io(n)(this);
        }
        toPromise(n) {
            return (
                (n = Js(n)),
                new n((r, o) => {
                    let i;
                    this.subscribe(
                        (s) => (i = s),
                        (s) => o(s),
                        () => r(i)
                    );
                })
            );
        }
    }
    return (e.create = (t) => new e(t)), e;
})();
function Js(e) {
    var t;
    return (t = e ?? te.Promise) !== null && t !== void 0 ? t : Promise;
}
function hd(e) {
    return e && g(e.next) && g(e.error) && g(e.complete);
}
function gd(e) {
    return (e && e instanceof He) || (hd(e) && Dn(e));
}
function so(e) {
    return g(e?.lift);
}
function D(e) {
    return (t) => {
        if (so(t))
            return t.lift(function (n) {
                try {
                    return e(n, this);
                } catch (r) {
                    this.error(r);
                }
            });
        throw new TypeError("Unable to lift unknown Observable type");
    };
}
function y(e, t, n, r, o) {
    return new ao(e, t, n, r, o);
}
var ao = class extends He {
    constructor(t, n, r, o, i, s) {
        super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
                ? function (a) {
                      try {
                          n(a);
                      } catch (u) {
                          t.error(u);
                      }
                  }
                : super._next),
            (this._error = o
                ? function (a) {
                      try {
                          o(a);
                      } catch (u) {
                          t.error(u);
                      } finally {
                          this.unsubscribe();
                      }
                  }
                : super._error),
            (this._complete = r
                ? function () {
                      try {
                          r();
                      } catch (a) {
                          t.error(a);
                      } finally {
                          this.unsubscribe();
                      }
                  }
                : super._complete);
    }
    unsubscribe() {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            let { closed: n } = this;
            super.unsubscribe(),
                !n &&
                    ((t = this.onFinalize) === null ||
                        t === void 0 ||
                        t.call(this));
        }
    }
};
function uo() {
    return D((e, t) => {
        let n = null;
        e._refCount++;
        let r = y(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount) {
                n = null;
                return;
            }
            let o = e._connection,
                i = n;
            (n = null),
                o && (!i || o === i) && o.unsubscribe(),
                t.unsubscribe();
        });
        e.subscribe(r), r.closed || (n = e.connect());
    });
}
var co = class extends C {
    constructor(t, n) {
        super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            so(t) && (this.lift = t.lift);
    }
    _subscribe(t) {
        return this.getSubject().subscribe(t);
    }
    getSubject() {
        let t = this._subject;
        return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
        );
    }
    _teardown() {
        this._refCount = 0;
        let { _connection: t } = this;
        (this._subject = this._connection = null), t?.unsubscribe();
    }
    connect() {
        let t = this._connection;
        if (!t) {
            t = this._connection = new L();
            let n = this.getSubject();
            t.add(
                this.source.subscribe(
                    y(
                        n,
                        void 0,
                        () => {
                            this._teardown(), n.complete();
                        },
                        (r) => {
                            this._teardown(), n.error(r);
                        },
                        () => this._teardown()
                    )
                )
            ),
                t.closed && ((this._connection = null), (t = L.EMPTY));
        }
        return t;
    }
    refCount() {
        return uo()(this);
    }
};
var Xs = dt(
    (e) =>
        function () {
            e(this),
                (this.name = "ObjectUnsubscribedError"),
                (this.message = "object unsubscribed");
        }
);
var ce = (() => {
        class e extends C {
            constructor() {
                super(),
                    (this.closed = !1),
                    (this.currentObservers = null),
                    (this.observers = []),
                    (this.isStopped = !1),
                    (this.hasError = !1),
                    (this.thrownError = null);
            }
            lift(n) {
                let r = new wn(this, this);
                return (r.operator = n), r;
            }
            _throwIfClosed() {
                if (this.closed) throw new Xs();
            }
            next(n) {
                pt(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        this.currentObservers ||
                            (this.currentObservers = Array.from(
                                this.observers
                            ));
                        for (let r of this.currentObservers) r.next(n);
                    }
                });
            }
            error(n) {
                pt(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        (this.hasError = this.isStopped = !0),
                            (this.thrownError = n);
                        let { observers: r } = this;
                        for (; r.length; ) r.shift().error(n);
                    }
                });
            }
            complete() {
                pt(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        this.isStopped = !0;
                        let { observers: n } = this;
                        for (; n.length; ) n.shift().complete();
                    }
                });
            }
            unsubscribe() {
                (this.isStopped = this.closed = !0),
                    (this.observers = this.currentObservers = null);
            }
            get observed() {
                var n;
                return (
                    ((n = this.observers) === null || n === void 0
                        ? void 0
                        : n.length) > 0
                );
            }
            _trySubscribe(n) {
                return this._throwIfClosed(), super._trySubscribe(n);
            }
            _subscribe(n) {
                return (
                    this._throwIfClosed(),
                    this._checkFinalizedStatuses(n),
                    this._innerSubscribe(n)
                );
            }
            _innerSubscribe(n) {
                let { hasError: r, isStopped: o, observers: i } = this;
                return r || o
                    ? eo
                    : ((this.currentObservers = null),
                      i.push(n),
                      new L(() => {
                          (this.currentObservers = null), Ve(i, n);
                      }));
            }
            _checkFinalizedStatuses(n) {
                let { hasError: r, thrownError: o, isStopped: i } = this;
                r ? n.error(o) : i && n.complete();
            }
            asObservable() {
                let n = new C();
                return (n.source = this), n;
            }
        }
        return (e.create = (t, n) => new wn(t, n)), e;
    })(),
    wn = class extends ce {
        constructor(t, n) {
            super(), (this.destination = t), (this.source = n);
        }
        next(t) {
            var n, r;
            (r =
                (n = this.destination) === null || n === void 0
                    ? void 0
                    : n.next) === null ||
                r === void 0 ||
                r.call(n, t);
        }
        error(t) {
            var n, r;
            (r =
                (n = this.destination) === null || n === void 0
                    ? void 0
                    : n.error) === null ||
                r === void 0 ||
                r.call(n, t);
        }
        complete() {
            var t, n;
            (n =
                (t = this.destination) === null || t === void 0
                    ? void 0
                    : t.complete) === null ||
                n === void 0 ||
                n.call(t);
        }
        _subscribe(t) {
            var n, r;
            return (r =
                (n = this.source) === null || n === void 0
                    ? void 0
                    : n.subscribe(t)) !== null && r !== void 0
                ? r
                : eo;
        }
    };
var $t = class extends ce {
    constructor(t) {
        super(), (this._value = t);
    }
    get value() {
        return this.getValue();
    }
    _subscribe(t) {
        let n = super._subscribe(t);
        return !n.closed && t.next(this._value), n;
    }
    getValue() {
        let { hasError: t, thrownError: n, _value: r } = this;
        if (t) throw n;
        return this._throwIfClosed(), r;
    }
    next(t) {
        super.next((this._value = t));
    }
};
var lo = {
    now() {
        return (lo.delegate || Date).now();
    },
    delegate: void 0,
};
var En = class extends L {
    constructor(t, n) {
        super();
    }
    schedule(t, n = 0) {
        return this;
    }
};
var Ht = {
    setInterval(e, t, ...n) {
        let { delegate: r } = Ht;
        return r?.setInterval
            ? r.setInterval(e, t, ...n)
            : setInterval(e, t, ...n);
    },
    clearInterval(e) {
        let { delegate: t } = Ht;
        return (t?.clearInterval || clearInterval)(e);
    },
    delegate: void 0,
};
var gt = class extends En {
    constructor(t, n) {
        super(t, n), (this.scheduler = t), (this.work = n), (this.pending = !1);
    }
    schedule(t, n = 0) {
        var r;
        if (this.closed) return this;
        this.state = t;
        let o = this.id,
            i = this.scheduler;
        return (
            o != null && (this.id = this.recycleAsyncId(i, o, n)),
            (this.pending = !0),
            (this.delay = n),
            (this.id =
                (r = this.id) !== null && r !== void 0
                    ? r
                    : this.requestAsyncId(i, this.id, n)),
            this
        );
    }
    requestAsyncId(t, n, r = 0) {
        return Ht.setInterval(t.flush.bind(t, this), r);
    }
    recycleAsyncId(t, n, r = 0) {
        if (r != null && this.delay === r && this.pending === !1) return n;
        n != null && Ht.clearInterval(n);
    }
    execute(t, n) {
        if (this.closed) return new Error("executing a cancelled action");
        this.pending = !1;
        let r = this._execute(t, n);
        if (r) return r;
        this.pending === !1 &&
            this.id != null &&
            (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
    }
    _execute(t, n) {
        let r = !1,
            o;
        try {
            this.work(t);
        } catch (i) {
            (r = !0),
                (o = i || new Error("Scheduled action threw falsy error"));
        }
        if (r) return this.unsubscribe(), o;
    }
    unsubscribe() {
        if (!this.closed) {
            let { id: t, scheduler: n } = this,
                { actions: r } = n;
            (this.work = this.state = this.scheduler = null),
                (this.pending = !1),
                Ve(r, this),
                t != null && (this.id = this.recycleAsyncId(n, t, null)),
                (this.delay = null),
                super.unsubscribe();
        }
    }
};
var md = 1,
    fo,
    po = {};
function ea(e) {
    return e in po ? (delete po[e], !0) : !1;
}
var ta = {
    setImmediate(e) {
        let t = md++;
        return (
            (po[t] = !0),
            fo || (fo = Promise.resolve()),
            fo.then(() => ea(t) && e()),
            t
        );
    },
    clearImmediate(e) {
        ea(e);
    },
};
var { setImmediate: yd, clearImmediate: Dd } = ta,
    Ut = {
        setImmediate(...e) {
            let { delegate: t } = Ut;
            return (t?.setImmediate || yd)(...e);
        },
        clearImmediate(e) {
            let { delegate: t } = Ut;
            return (t?.clearImmediate || Dd)(e);
        },
        delegate: void 0,
    };
var Cn = class extends gt {
    constructor(t, n) {
        super(t, n), (this.scheduler = t), (this.work = n);
    }
    requestAsyncId(t, n, r = 0) {
        return r !== null && r > 0
            ? super.requestAsyncId(t, n, r)
            : (t.actions.push(this),
              t._scheduled ||
                  (t._scheduled = Ut.setImmediate(t.flush.bind(t, void 0))));
    }
    recycleAsyncId(t, n, r = 0) {
        var o;
        if (r != null ? r > 0 : this.delay > 0)
            return super.recycleAsyncId(t, n, r);
        let { actions: i } = t;
        n != null &&
            ((o = i[i.length - 1]) === null || o === void 0 ? void 0 : o.id) !==
                n &&
            (Ut.clearImmediate(n),
            t._scheduled === n && (t._scheduled = void 0));
    }
};
var mt = class e {
    constructor(t, n = e.now) {
        (this.schedulerActionCtor = t), (this.now = n);
    }
    schedule(t, n = 0, r) {
        return new this.schedulerActionCtor(this, t).schedule(r, n);
    }
};
mt.now = lo.now;
var yt = class extends mt {
    constructor(t, n = mt.now) {
        super(t, n), (this.actions = []), (this._active = !1);
    }
    flush(t) {
        let { actions: n } = this;
        if (this._active) {
            n.push(t);
            return;
        }
        let r;
        this._active = !0;
        do if ((r = t.execute(t.state, t.delay))) break;
        while ((t = n.shift()));
        if (((this._active = !1), r)) {
            for (; (t = n.shift()); ) t.unsubscribe();
            throw r;
        }
    }
};
var bn = class extends yt {
    flush(t) {
        this._active = !0;
        let n = this._scheduled;
        this._scheduled = void 0;
        let { actions: r } = this,
            o;
        t = t || r.shift();
        do if ((o = t.execute(t.state, t.delay))) break;
        while ((t = r[0]) && t.id === n && r.shift());
        if (((this._active = !1), o)) {
            for (; (t = r[0]) && t.id === n && r.shift(); ) t.unsubscribe();
            throw o;
        }
    }
};
var vd = new bn(Cn);
var Ue = new yt(gt),
    na = Ue;
var Ge = new C((e) => e.complete());
function _n(e) {
    return e && g(e.schedule);
}
function ho(e) {
    return e[e.length - 1];
}
function Mn(e) {
    return g(ho(e)) ? e.pop() : void 0;
}
function le(e) {
    return _n(ho(e)) ? e.pop() : void 0;
}
function ra(e, t) {
    return typeof ho(e) == "number" ? e.pop() : t;
}
function ia(e, t, n, r) {
    function o(i) {
        return i instanceof n
            ? i
            : new n(function (s) {
                  s(i);
              });
    }
    return new (n || (n = Promise))(function (i, s) {
        function a(l) {
            try {
                c(r.next(l));
            } catch (d) {
                s(d);
            }
        }
        function u(l) {
            try {
                c(r.throw(l));
            } catch (d) {
                s(d);
            }
        }
        function c(l) {
            l.done ? i(l.value) : o(l.value).then(a, u);
        }
        c((r = r.apply(e, t || [])).next());
    });
}
function oa(e) {
    var t = typeof Symbol == "function" && Symbol.iterator,
        n = t && e[t],
        r = 0;
    if (n) return n.call(e);
    if (e && typeof e.length == "number")
        return {
            next: function () {
                return (
                    e && r >= e.length && (e = void 0),
                    { value: e && e[r++], done: !e }
                );
            },
        };
    throw new TypeError(
        t ? "Object is not iterable." : "Symbol.iterator is not defined."
    );
}
function ze(e) {
    return this instanceof ze ? ((this.v = e), this) : new ze(e);
}
function sa(e, t, n) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e, t || []),
        o,
        i = [];
    return (
        (o = {}),
        s("next"),
        s("throw"),
        s("return"),
        (o[Symbol.asyncIterator] = function () {
            return this;
        }),
        o
    );
    function s(f) {
        r[f] &&
            (o[f] = function (p) {
                return new Promise(function (h, w) {
                    i.push([f, p, h, w]) > 1 || a(f, p);
                });
            });
    }
    function a(f, p) {
        try {
            u(r[f](p));
        } catch (h) {
            d(i[0][3], h);
        }
    }
    function u(f) {
        f.value instanceof ze
            ? Promise.resolve(f.value.v).then(c, l)
            : d(i[0][2], f);
    }
    function c(f) {
        a("next", f);
    }
    function l(f) {
        a("throw", f);
    }
    function d(f, p) {
        f(p), i.shift(), i.length && a(i[0][0], i[0][1]);
    }
}
function aa(e) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e[Symbol.asyncIterator],
        n;
    return t
        ? t.call(e)
        : ((e = typeof oa == "function" ? oa(e) : e[Symbol.iterator]()),
          (n = {}),
          r("next"),
          r("throw"),
          r("return"),
          (n[Symbol.asyncIterator] = function () {
              return this;
          }),
          n);
    function r(i) {
        n[i] =
            e[i] &&
            function (s) {
                return new Promise(function (a, u) {
                    (s = e[i](s)), o(a, u, s.done, s.value);
                });
            };
    }
    function o(i, s, a, u) {
        Promise.resolve(u).then(function (c) {
            i({ value: c, done: a });
        }, s);
    }
}
var Dt = (e) => e && typeof e.length == "number" && typeof e != "function";
function xn(e) {
    return g(e?.then);
}
function Sn(e) {
    return g(e[ht]);
}
function Tn(e) {
    return Symbol.asyncIterator && g(e?.[Symbol.asyncIterator]);
}
function Nn(e) {
    return new TypeError(
        `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
    );
}
function Id() {
    return typeof Symbol != "function" || !Symbol.iterator
        ? "@@iterator"
        : Symbol.iterator;
}
var An = Id();
function On(e) {
    return g(e?.[An]);
}
function Fn(e) {
    return sa(this, arguments, function* () {
        let n = e.getReader();
        try {
            for (;;) {
                let { value: r, done: o } = yield ze(n.read());
                if (o) return yield ze(void 0);
                yield yield ze(r);
            }
        } finally {
            n.releaseLock();
        }
    });
}
function Rn(e) {
    return g(e?.getReader);
}
function x(e) {
    if (e instanceof C) return e;
    if (e != null) {
        if (Sn(e)) return wd(e);
        if (Dt(e)) return Ed(e);
        if (xn(e)) return Cd(e);
        if (Tn(e)) return ua(e);
        if (On(e)) return bd(e);
        if (Rn(e)) return _d(e);
    }
    throw Nn(e);
}
function wd(e) {
    return new C((t) => {
        let n = e[ht]();
        if (g(n.subscribe)) return n.subscribe(t);
        throw new TypeError(
            "Provided object does not correctly implement Symbol.observable"
        );
    });
}
function Ed(e) {
    return new C((t) => {
        for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
        t.complete();
    });
}
function Cd(e) {
    return new C((t) => {
        e.then(
            (n) => {
                t.closed || (t.next(n), t.complete());
            },
            (n) => t.error(n)
        ).then(null, vn);
    });
}
function bd(e) {
    return new C((t) => {
        for (let n of e) if ((t.next(n), t.closed)) return;
        t.complete();
    });
}
function ua(e) {
    return new C((t) => {
        Md(e, t).catch((n) => t.error(n));
    });
}
function _d(e) {
    return ua(Fn(e));
}
function Md(e, t) {
    var n, r, o, i;
    return ia(this, void 0, void 0, function* () {
        try {
            for (n = aa(e); (r = yield n.next()), !r.done; ) {
                let s = r.value;
                if ((t.next(s), t.closed)) return;
            }
        } catch (s) {
            o = { error: s };
        } finally {
            try {
                r && !r.done && (i = n.return) && (yield i.call(n));
            } finally {
                if (o) throw o.error;
            }
        }
        t.complete();
    });
}
function G(e, t, n, r = 0, o = !1) {
    let i = t.schedule(function () {
        n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
    }, r);
    if ((e.add(i), !o)) return i;
}
function Pn(e, t = 0) {
    return D((n, r) => {
        n.subscribe(
            y(
                r,
                (o) => G(r, e, () => r.next(o), t),
                () => G(r, e, () => r.complete(), t),
                (o) => G(r, e, () => r.error(o), t)
            )
        );
    });
}
function kn(e, t = 0) {
    return D((n, r) => {
        r.add(e.schedule(() => n.subscribe(r), t));
    });
}
function ca(e, t) {
    return x(e).pipe(kn(t), Pn(t));
}
function la(e, t) {
    return x(e).pipe(kn(t), Pn(t));
}
function da(e, t) {
    return new C((n) => {
        let r = 0;
        return t.schedule(function () {
            r === e.length
                ? n.complete()
                : (n.next(e[r++]), n.closed || this.schedule());
        });
    });
}
function fa(e, t) {
    return new C((n) => {
        let r;
        return (
            G(n, t, () => {
                (r = e[An]()),
                    G(
                        n,
                        t,
                        () => {
                            let o, i;
                            try {
                                ({ value: o, done: i } = r.next());
                            } catch (s) {
                                n.error(s);
                                return;
                            }
                            i ? n.complete() : n.next(o);
                        },
                        0,
                        !0
                    );
            }),
            () => g(r?.return) && r.return()
        );
    });
}
function Ln(e, t) {
    if (!e) throw new Error("Iterable cannot be null");
    return new C((n) => {
        G(n, t, () => {
            let r = e[Symbol.asyncIterator]();
            G(
                n,
                t,
                () => {
                    r.next().then((o) => {
                        o.done ? n.complete() : n.next(o.value);
                    });
                },
                0,
                !0
            );
        });
    });
}
function pa(e, t) {
    return Ln(Fn(e), t);
}
function ha(e, t) {
    if (e != null) {
        if (Sn(e)) return ca(e, t);
        if (Dt(e)) return da(e, t);
        if (xn(e)) return la(e, t);
        if (Tn(e)) return Ln(e, t);
        if (On(e)) return fa(e, t);
        if (Rn(e)) return pa(e, t);
    }
    throw Nn(e);
}
function de(e, t) {
    return t ? ha(e, t) : x(e);
}
function xd(...e) {
    let t = le(e);
    return de(e, t);
}
function Sd(e, t) {
    let n = g(e) ? e : () => e,
        r = (o) => o.error(n());
    return new C(t ? (o) => t.schedule(r, 0, o) : r);
}
function Td(e) {
    return !!e && (e instanceof C || (g(e.lift) && g(e.subscribe)));
}
var We = dt(
    (e) =>
        function () {
            e(this),
                (this.name = "EmptyError"),
                (this.message = "no elements in sequence");
        }
);
function ga(e) {
    return e instanceof Date && !isNaN(e);
}
function De(e, t) {
    return D((n, r) => {
        let o = 0;
        n.subscribe(
            y(r, (i) => {
                r.next(e.call(t, i, o++));
            })
        );
    });
}
var { isArray: Nd } = Array;
function Ad(e, t) {
    return Nd(t) ? e(...t) : e(t);
}
function vt(e) {
    return De((t) => Ad(e, t));
}
var { isArray: Od } = Array,
    { getPrototypeOf: Fd, prototype: Rd, keys: Pd } = Object;
function jn(e) {
    if (e.length === 1) {
        let t = e[0];
        if (Od(t)) return { args: t, keys: null };
        if (kd(t)) {
            let n = Pd(t);
            return { args: n.map((r) => t[r]), keys: n };
        }
    }
    return { args: e, keys: null };
}
function kd(e) {
    return e && typeof e == "object" && Fd(e) === Rd;
}
function Vn(e, t) {
    return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function Ld(...e) {
    let t = le(e),
        n = Mn(e),
        { args: r, keys: o } = jn(e);
    if (r.length === 0) return de([], t);
    let i = new C(jd(r, t, o ? (s) => Vn(o, s) : B));
    return n ? i.pipe(vt(n)) : i;
}
function jd(e, t, n = B) {
    return (r) => {
        ma(
            t,
            () => {
                let { length: o } = e,
                    i = new Array(o),
                    s = o,
                    a = o;
                for (let u = 0; u < o; u++)
                    ma(
                        t,
                        () => {
                            let c = de(e[u], t),
                                l = !1;
                            c.subscribe(
                                y(
                                    r,
                                    (d) => {
                                        (i[u] = d),
                                            l || ((l = !0), a--),
                                            a || r.next(n(i.slice()));
                                    },
                                    () => {
                                        --s || r.complete();
                                    }
                                )
                            );
                        },
                        r
                    );
            },
            r
        );
    };
}
function ma(e, t, n) {
    e ? G(n, e, t) : t();
}
function ya(e, t, n, r, o, i, s, a) {
    let u = [],
        c = 0,
        l = 0,
        d = !1,
        f = () => {
            d && !u.length && !c && t.complete();
        },
        p = (w) => (c < r ? h(w) : u.push(w)),
        h = (w) => {
            i && t.next(w), c++;
            let k = !1;
            x(n(w, l++)).subscribe(
                y(
                    t,
                    (N) => {
                        o?.(N), i ? p(N) : t.next(N);
                    },
                    () => {
                        k = !0;
                    },
                    void 0,
                    () => {
                        if (k)
                            try {
                                for (c--; u.length && c < r; ) {
                                    let N = u.shift();
                                    s ? G(t, s, () => h(N)) : h(N);
                                }
                                f();
                            } catch (N) {
                                t.error(N);
                            }
                    }
                )
            );
        };
    return (
        e.subscribe(
            y(t, p, () => {
                (d = !0), f();
            })
        ),
        () => {
            a?.();
        }
    );
}
function ne(e, t, n = 1 / 0) {
    return g(t)
        ? ne((r, o) => De((i, s) => t(r, i, o, s))(x(e(r, o))), n)
        : (typeof t == "number" && (n = t), D((r, o) => ya(r, o, e, n)));
}
function Gt(e = 1 / 0) {
    return ne(B, e);
}
function Da() {
    return Gt(1);
}
function It(...e) {
    return Da()(de(e, le(e)));
}
function Vd(e) {
    return new C((t) => {
        x(e()).subscribe(t);
    });
}
function Bd(...e) {
    let t = Mn(e),
        { args: n, keys: r } = jn(e),
        o = new C((i) => {
            let { length: s } = n;
            if (!s) {
                i.complete();
                return;
            }
            let a = new Array(s),
                u = s,
                c = s;
            for (let l = 0; l < s; l++) {
                let d = !1;
                x(n[l]).subscribe(
                    y(
                        i,
                        (f) => {
                            d || ((d = !0), c--), (a[l] = f);
                        },
                        () => u--,
                        void 0,
                        () => {
                            (!u || !d) &&
                                (c || i.next(r ? Vn(r, a) : a), i.complete());
                        }
                    )
                );
            }
        });
    return t ? o.pipe(vt(t)) : o;
}
var $d = ["addListener", "removeListener"],
    Hd = ["addEventListener", "removeEventListener"],
    Ud = ["on", "off"];
function go(e, t, n, r) {
    if ((g(n) && ((r = n), (n = void 0)), r)) return go(e, t, n).pipe(vt(r));
    let [o, i] = Wd(e)
        ? Hd.map((s) => (a) => e[s](t, a, n))
        : Gd(e)
          ? $d.map(va(e, t))
          : zd(e)
            ? Ud.map(va(e, t))
            : [];
    if (!o && Dt(e)) return ne((s) => go(s, t, n))(x(e));
    if (!o) throw new TypeError("Invalid event target");
    return new C((s) => {
        let a = (...u) => s.next(1 < u.length ? u : u[0]);
        return o(a), () => i(a);
    });
}
function va(e, t) {
    return (n) => (r) => e[n](t, r);
}
function Gd(e) {
    return g(e.addListener) && g(e.removeListener);
}
function zd(e) {
    return g(e.on) && g(e.off);
}
function Wd(e) {
    return g(e.addEventListener) && g(e.removeEventListener);
}
function Bn(e = 0, t, n = na) {
    let r = -1;
    return (
        t != null && (_n(t) ? (n = t) : (r = t)),
        new C((o) => {
            let i = ga(e) ? +e - n.now() : e;
            i < 0 && (i = 0);
            let s = 0;
            return n.schedule(function () {
                o.closed ||
                    (o.next(s++),
                    0 <= r ? this.schedule(void 0, r) : o.complete());
            }, i);
        })
    );
}
function qd(...e) {
    let t = le(e),
        n = ra(e, 1 / 0),
        r = e;
    return r.length ? (r.length === 1 ? x(r[0]) : Gt(n)(de(r, t))) : Ge;
}
function qe(e, t) {
    return D((n, r) => {
        let o = 0;
        n.subscribe(y(r, (i) => e.call(t, i, o++) && r.next(i)));
    });
}
function Ia(e) {
    return D((t, n) => {
        let r = !1,
            o = null,
            i = null,
            s = !1,
            a = () => {
                if ((i?.unsubscribe(), (i = null), r)) {
                    r = !1;
                    let c = o;
                    (o = null), n.next(c);
                }
                s && n.complete();
            },
            u = () => {
                (i = null), s && n.complete();
            };
        t.subscribe(
            y(
                n,
                (c) => {
                    (r = !0), (o = c), i || x(e(c)).subscribe((i = y(n, a, u)));
                },
                () => {
                    (s = !0), (!r || !i || i.closed) && n.complete();
                }
            )
        );
    });
}
function Yd(e, t = Ue) {
    return Ia(() => Bn(e, t));
}
function wa(e) {
    return D((t, n) => {
        let r = null,
            o = !1,
            i;
        (r = t.subscribe(
            y(n, void 0, void 0, (s) => {
                (i = x(e(s, wa(e)(t)))),
                    r
                        ? (r.unsubscribe(), (r = null), i.subscribe(n))
                        : (o = !0);
            })
        )),
            o && (r.unsubscribe(), (r = null), i.subscribe(n));
    });
}
function Ea(e, t, n, r, o) {
    return (i, s) => {
        let a = n,
            u = t,
            c = 0;
        i.subscribe(
            y(
                s,
                (l) => {
                    let d = c++;
                    (u = a ? e(u, l, d) : ((a = !0), l)), r && s.next(u);
                },
                o &&
                    (() => {
                        a && s.next(u), s.complete();
                    })
            )
        );
    };
}
function Qd(e, t) {
    return g(t) ? ne(e, t, 1) : ne(e, 1);
}
function Zd(e, t = Ue) {
    return D((n, r) => {
        let o = null,
            i = null,
            s = null,
            a = () => {
                if (o) {
                    o.unsubscribe(), (o = null);
                    let c = i;
                    (i = null), r.next(c);
                }
            };
        function u() {
            let c = s + e,
                l = t.now();
            if (l < c) {
                (o = this.schedule(void 0, c - l)), r.add(o);
                return;
            }
            a();
        }
        n.subscribe(
            y(
                r,
                (c) => {
                    (i = c),
                        (s = t.now()),
                        o || ((o = t.schedule(u, e)), r.add(o));
                },
                () => {
                    a(), r.complete();
                },
                void 0,
                () => {
                    i = o = null;
                }
            )
        );
    });
}
function zt(e) {
    return D((t, n) => {
        let r = !1;
        t.subscribe(
            y(
                n,
                (o) => {
                    (r = !0), n.next(o);
                },
                () => {
                    r || n.next(e), n.complete();
                }
            )
        );
    });
}
function wt(e) {
    return e <= 0
        ? () => Ge
        : D((t, n) => {
              let r = 0;
              t.subscribe(
                  y(n, (o) => {
                      ++r <= e && (n.next(o), e <= r && n.complete());
                  })
              );
          });
}
function Ca() {
    return D((e, t) => {
        e.subscribe(y(t, Be));
    });
}
function mo(e) {
    return De(() => e);
}
function yo(e, t) {
    return t
        ? (n) => It(t.pipe(wt(1), Ca()), n.pipe(yo(e)))
        : ne((n, r) => x(e(n, r)).pipe(wt(1), mo(n)));
}
function Kd(e, t = Ue) {
    let n = Bn(e, t);
    return yo(() => n);
}
function Jd(e, t = B) {
    return (
        (e = e ?? Xd),
        D((n, r) => {
            let o,
                i = !0;
            n.subscribe(
                y(r, (s) => {
                    let a = t(s);
                    (i || !e(o, a)) && ((i = !1), (o = a), r.next(s));
                })
            );
        })
    );
}
function Xd(e, t) {
    return e === t;
}
function $n(e = ef) {
    return D((t, n) => {
        let r = !1;
        t.subscribe(
            y(
                n,
                (o) => {
                    (r = !0), n.next(o);
                },
                () => (r ? n.complete() : n.error(e()))
            )
        );
    });
}
function ef() {
    return new We();
}
function tf(e) {
    return D((t, n) => {
        try {
            t.subscribe(n);
        } finally {
            n.add(e);
        }
    });
}
function ba(e, t) {
    let n = arguments.length >= 2;
    return (r) =>
        r.pipe(
            e ? qe((o, i) => e(o, i, r)) : B,
            wt(1),
            n ? zt(t) : $n(() => new We())
        );
}
function Do(e) {
    return e <= 0
        ? () => Ge
        : D((t, n) => {
              let r = [];
              t.subscribe(
                  y(
                      n,
                      (o) => {
                          r.push(o), e < r.length && r.shift();
                      },
                      () => {
                          for (let o of r) n.next(o);
                          n.complete();
                      },
                      void 0,
                      () => {
                          r = null;
                      }
                  )
              );
          });
}
function nf(e, t) {
    let n = arguments.length >= 2;
    return (r) =>
        r.pipe(
            e ? qe((o, i) => e(o, i, r)) : B,
            Do(1),
            n ? zt(t) : $n(() => new We())
        );
}
function rf(e, t) {
    return D(Ea(e, t, arguments.length >= 2, !0));
}
function of(e = {}) {
    let {
        connector: t = () => new ce(),
        resetOnError: n = !0,
        resetOnComplete: r = !0,
        resetOnRefCountZero: o = !0,
    } = e;
    return (i) => {
        let s,
            a,
            u,
            c = 0,
            l = !1,
            d = !1,
            f = () => {
                a?.unsubscribe(), (a = void 0);
            },
            p = () => {
                f(), (s = u = void 0), (l = d = !1);
            },
            h = () => {
                let w = s;
                p(), w?.unsubscribe();
            };
        return D((w, k) => {
            c++, !d && !l && f();
            let N = (u = u ?? t());
            k.add(() => {
                c--, c === 0 && !d && !l && (a = vo(h, o));
            }),
                N.subscribe(k),
                !s &&
                    c > 0 &&
                    ((s = new ye({
                        next: (Z) => N.next(Z),
                        error: (Z) => {
                            (d = !0), f(), (a = vo(p, n, Z)), N.error(Z);
                        },
                        complete: () => {
                            (l = !0), f(), (a = vo(p, r)), N.complete();
                        },
                    })),
                    x(w).subscribe(s));
        })(i);
    };
}
function vo(e, t, ...n) {
    if (t === !0) {
        e();
        return;
    }
    if (t === !1) return;
    let r = new ye({
        next: () => {
            r.unsubscribe(), e();
        },
    });
    return x(t(...n)).subscribe(r);
}
function sf(e) {
    return qe((t, n) => e <= n);
}
function af(...e) {
    let t = le(e);
    return D((n, r) => {
        (t ? It(e, n, t) : It(e, n)).subscribe(r);
    });
}
function uf(e, t) {
    return D((n, r) => {
        let o = null,
            i = 0,
            s = !1,
            a = () => s && !o && r.complete();
        n.subscribe(
            y(
                r,
                (u) => {
                    o?.unsubscribe();
                    let c = 0,
                        l = i++;
                    x(e(u, l)).subscribe(
                        (o = y(
                            r,
                            (d) => r.next(t ? t(u, d, l, c++) : d),
                            () => {
                                (o = null), a();
                            }
                        ))
                    );
                },
                () => {
                    (s = !0), a();
                }
            )
        );
    });
}
function cf(e) {
    return D((t, n) => {
        x(e).subscribe(y(n, () => n.complete(), Be)),
            !n.closed && t.subscribe(n);
    });
}
function lf(e, t, n) {
    let r = g(e) || t || n ? { next: e, error: t, complete: n } : e;
    return r
        ? D((o, i) => {
              var s;
              (s = r.subscribe) === null || s === void 0 || s.call(r);
              let a = !0;
              o.subscribe(
                  y(
                      i,
                      (u) => {
                          var c;
                          (c = r.next) === null || c === void 0 || c.call(r, u),
                              i.next(u);
                      },
                      () => {
                          var u;
                          (a = !1),
                              (u = r.complete) === null ||
                                  u === void 0 ||
                                  u.call(r),
                              i.complete();
                      },
                      (u) => {
                          var c;
                          (a = !1),
                              (c = r.error) === null ||
                                  c === void 0 ||
                                  c.call(r, u),
                              i.error(u);
                      },
                      () => {
                          var u, c;
                          a &&
                              ((u = r.unsubscribe) === null ||
                                  u === void 0 ||
                                  u.call(r)),
                              (c = r.finalize) === null ||
                                  c === void 0 ||
                                  c.call(r);
                      }
                  )
              );
          })
        : B;
}
var lu = "https://g.co/ng/security#xss",
    _ = class extends Error {
        constructor(t, n) {
            super(du(t, n)), (this.code = t);
        }
    };
function du(e, t) {
    return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function on(e) {
    return { toString: e }.toString();
}
var Hn = "__parameters__";
function df(e) {
    return function (...n) {
        if (e) {
            let r = e(...n);
            for (let o in r) this[o] = r[o];
        }
    };
}
function fu(e, t, n) {
    return on(() => {
        let r = df(t);
        function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            let s = new o(...i);
            return (a.annotation = s), a;
            function a(u, c, l) {
                let d = u.hasOwnProperty(Hn)
                    ? u[Hn]
                    : Object.defineProperty(u, Hn, { value: [] })[Hn];
                for (; d.length <= l; ) d.push(null);
                return (d[l] = d[l] || []).push(s), u;
            }
        }
        return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
        );
    });
}
var ve = globalThis;
function A(e) {
    for (let t in e) if (e[t] === A) return t;
    throw Error("Could not find renamed property on target object.");
}
function ff(e, t) {
    for (let n in t)
        t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function H(e) {
    if (typeof e == "string") return e;
    if (Array.isArray(e)) return "[" + e.map(H).join(", ") + "]";
    if (e == null) return "" + e;
    if (e.overriddenName) return `${e.overriddenName}`;
    if (e.name) return `${e.name}`;
    let t = e.toString();
    if (t == null) return "" + t;
    let n = t.indexOf(`
`);
    return n === -1 ? t : t.substring(0, n);
}
function Fo(e, t) {
    return e == null || e === ""
        ? t === null
            ? ""
            : t
        : t == null || t === ""
          ? e
          : e + " " + t;
}
var pf = A({ __forward_ref__: A });
function pu(e) {
    return (
        (e.__forward_ref__ = pu),
        (e.toString = function () {
            return H(this());
        }),
        e
    );
}
function $(e) {
    return hu(e) ? e() : e;
}
function hu(e) {
    return (
        typeof e == "function" &&
        e.hasOwnProperty(pf) &&
        e.__forward_ref__ === pu
    );
}
function O(e) {
    return {
        token: e.token,
        providedIn: e.providedIn || null,
        factory: e.factory,
        value: void 0,
    };
}
function Bi(e) {
    return { providers: e.providers || [], imports: e.imports || [] };
}
function Mr(e) {
    return _a(e, gu) || _a(e, mu);
}
function R_(e) {
    return Mr(e) !== null;
}
function _a(e, t) {
    return e.hasOwnProperty(t) ? e[t] : null;
}
function hf(e) {
    let t = e && (e[gu] || e[mu]);
    return t || null;
}
function Ma(e) {
    return e && (e.hasOwnProperty(xa) || e.hasOwnProperty(gf)) ? e[xa] : null;
}
var gu = A({ ɵprov: A }),
    xa = A({ ɵinj: A }),
    mu = A({ ngInjectableDef: A }),
    gf = A({ ngInjectorDef: A }),
    T = class {
        constructor(t, n) {
            (this._desc = t),
                (this.ngMetadataName = "InjectionToken"),
                (this.ɵprov = void 0),
                typeof n == "number"
                    ? (this.__NG_ELEMENT_ID__ = n)
                    : n !== void 0 &&
                      (this.ɵprov = O({
                          token: this,
                          providedIn: n.providedIn || "root",
                          factory: n.factory,
                      }));
        }
        get multi() {
            return this;
        }
        toString() {
            return `InjectionToken ${this._desc}`;
        }
    };
function yu(e) {
    return e && !!e.ɵproviders;
}
var mf = A({ ɵcmp: A }),
    yf = A({ ɵdir: A }),
    Df = A({ ɵpipe: A }),
    vf = A({ ɵmod: A }),
    nr = A({ ɵfac: A }),
    Wt = A({ __NG_ELEMENT_ID__: A }),
    Sa = A({ __NG_ENV_ID__: A });
function xr(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e);
}
function If(e) {
    return typeof e == "function"
        ? e.name || e.toString()
        : typeof e == "object" && e != null && typeof e.type == "function"
          ? e.type.name || e.type.toString()
          : xr(e);
}
function wf(e, t) {
    let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
    throw new _(-200, e);
}
function $i(e, t) {
    throw new _(-201, !1);
}
var b = (function (e) {
        return (
            (e[(e.Default = 0)] = "Default"),
            (e[(e.Host = 1)] = "Host"),
            (e[(e.Self = 2)] = "Self"),
            (e[(e.SkipSelf = 4)] = "SkipSelf"),
            (e[(e.Optional = 8)] = "Optional"),
            e
        );
    })(b || {}),
    Ro;
function Du() {
    return Ro;
}
function K(e) {
    let t = Ro;
    return (Ro = e), t;
}
function vu(e, t, n) {
    let r = Mr(e);
    if (r && r.providedIn == "root")
        return r.value === void 0 ? (r.value = r.factory()) : r.value;
    if (n & b.Optional) return null;
    if (t !== void 0) return t;
    $i(e, "Injector");
}
var Ef = {},
    Yt = Ef,
    Po = "__NG_DI_FLAG__",
    rr = "ngTempTokenPath",
    Cf = "ngTokenPath",
    bf = /\n/gm,
    _f = "\u0275",
    Ta = "__source",
    Mt;
function Mf() {
    return Mt;
}
function Se(e) {
    let t = Mt;
    return (Mt = e), t;
}
function xf(e, t = b.Default) {
    if (Mt === void 0) throw new _(-203, !1);
    return Mt === null
        ? vu(e, void 0, t)
        : Mt.get(e, t & b.Optional ? null : void 0, t);
}
function R(e, t = b.Default) {
    return (Du() || xf)($(e), t);
}
function S(e, t = b.Default) {
    return R(e, Sr(t));
}
function Sr(e) {
    return typeof e > "u" || typeof e == "number"
        ? e
        : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
}
function ko(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
        let r = $(e[n]);
        if (Array.isArray(r)) {
            if (r.length === 0) throw new _(900, !1);
            let o,
                i = b.Default;
            for (let s = 0; s < r.length; s++) {
                let a = r[s],
                    u = Sf(a);
                typeof u == "number"
                    ? u === -1
                        ? (o = a.token)
                        : (i |= u)
                    : (o = a);
            }
            t.push(R(o, i));
        } else t.push(R(r));
    }
    return t;
}
function Iu(e, t) {
    return (e[Po] = t), (e.prototype[Po] = t), e;
}
function Sf(e) {
    return e[Po];
}
function Tf(e, t, n, r) {
    let o = e[rr];
    throw (
        (t[Ta] && o.unshift(t[Ta]),
        (e.message = Nf(
            `
` + e.message,
            o,
            n,
            r
        )),
        (e[Cf] = o),
        (e[rr] = null),
        e)
    );
}
function Nf(e, t, n, r = null) {
    e =
        e &&
        e.charAt(0) ===
            `
` &&
        e.charAt(1) == _f
            ? e.slice(2)
            : e;
    let o = H(t);
    if (Array.isArray(t)) o = t.map(H).join(" -> ");
    else if (typeof t == "object") {
        let i = [];
        for (let s in t)
            if (t.hasOwnProperty(s)) {
                let a = t[s];
                i.push(
                    s + ":" + (typeof a == "string" ? JSON.stringify(a) : H(a))
                );
            }
        o = `{${i.join(", ")}}`;
    }
    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
        bf,
        `
  `
    )}`;
}
var Af = Iu(fu("Optional"), 8);
var Of = Iu(fu("SkipSelf"), 4);
function St(e, t) {
    let n = e.hasOwnProperty(nr);
    return n ? e[nr] : null;
}
function Ff(e, t, n) {
    if (e.length !== t.length) return !1;
    for (let r = 0; r < e.length; r++) {
        let o = e[r],
            i = t[r];
        if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
    }
    return !0;
}
function Rf(e) {
    return e.flat(Number.POSITIVE_INFINITY);
}
function Hi(e, t) {
    e.forEach((n) => (Array.isArray(n) ? Hi(n, t) : t(n)));
}
function wu(e, t, n) {
    t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function or(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function Pf(e, t) {
    let n = [];
    for (let r = 0; r < e; r++) n.push(t);
    return n;
}
function kf(e, t, n, r) {
    let o = e.length;
    if (o == t) e.push(n, r);
    else if (o === 1) e.push(r, e[0]), (e[0] = n);
    else {
        for (o--, e.push(e[o - 1], e[o]); o > t; ) {
            let i = o - 2;
            (e[o] = e[i]), o--;
        }
        (e[t] = n), (e[t + 1] = r);
    }
}
function Ui(e, t, n) {
    let r = sn(e, t);
    return r >= 0 ? (e[r | 1] = n) : ((r = ~r), kf(e, r, t, n)), r;
}
function Io(e, t) {
    let n = sn(e, t);
    if (n >= 0) return e[n | 1];
}
function sn(e, t) {
    return Lf(e, t, 1);
}
function Lf(e, t, n) {
    let r = 0,
        o = e.length >> n;
    for (; o !== r; ) {
        let i = r + ((o - r) >> 1),
            s = e[i << n];
        if (t === s) return i << n;
        s > t ? (o = i) : (r = i + 1);
    }
    return ~(o << n);
}
var Tt = {},
    z = [],
    ir = new T(""),
    Eu = new T("", -1),
    Cu = new T(""),
    sr = class {
        get(t, n = Yt) {
            if (n === Yt) {
                let r = new Error(
                    `NullInjectorError: No provider for ${H(t)}!`
                );
                throw ((r.name = "NullInjectorError"), r);
            }
            return n;
        }
    },
    bu = (function (e) {
        return (
            (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e
        );
    })(bu || {}),
    Qt = (function (e) {
        return (
            (e[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            e
        );
    })(Qt || {}),
    Ze = (function (e) {
        return (
            (e[(e.None = 0)] = "None"),
            (e[(e.SignalBased = 1)] = "SignalBased"),
            (e[(e.HasDecoratorInputTransform = 2)] =
                "HasDecoratorInputTransform"),
            e
        );
    })(Ze || {});
function jf(e, t, n) {
    let r = e.length;
    for (;;) {
        let o = e.indexOf(t, n);
        if (o === -1) return o;
        if (o === 0 || e.charCodeAt(o - 1) <= 32) {
            let i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
        }
        n = o + 1;
    }
}
function Lo(e, t, n) {
    let r = 0;
    for (; r < n.length; ) {
        let o = n[r];
        if (typeof o == "number") {
            if (o !== 0) break;
            r++;
            let i = n[r++],
                s = n[r++],
                a = n[r++];
            e.setAttribute(t, s, a, i);
        } else {
            let i = o,
                s = n[++r];
            Vf(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
        }
    }
    return r;
}
function _u(e) {
    return e === 3 || e === 4 || e === 6;
}
function Vf(e) {
    return e.charCodeAt(0) === 64;
}
function Zt(e, t) {
    if (!(t === null || t.length === 0))
        if (e === null || e.length === 0) e = t.slice();
        else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
                let o = t[r];
                typeof o == "number"
                    ? (n = o)
                    : n === 0 ||
                      (n === -1 || n === 2
                          ? Na(e, n, o, null, t[++r])
                          : Na(e, n, o, null, null));
            }
        }
    return e;
}
function Na(e, t, n, r, o) {
    let i = 0,
        s = e.length;
    if (t === -1) s = -1;
    else
        for (; i < e.length; ) {
            let a = e[i++];
            if (typeof a == "number") {
                if (a === t) {
                    s = -1;
                    break;
                } else if (a > t) {
                    s = i - 1;
                    break;
                }
            }
        }
    for (; i < e.length; ) {
        let a = e[i];
        if (typeof a == "number") break;
        if (a === n) {
            if (r === null) {
                o !== null && (e[i + 1] = o);
                return;
            } else if (r === e[i + 1]) {
                e[i + 2] = o;
                return;
            }
        }
        i++, r !== null && i++, o !== null && i++;
    }
    s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
        e.splice(i++, 0, n),
        r !== null && e.splice(i++, 0, r),
        o !== null && e.splice(i++, 0, o);
}
var Mu = "ng-template";
function Bf(e, t, n, r) {
    let o = 0;
    if (r) {
        for (; o < t.length && typeof t[o] == "string"; o += 2)
            if (t[o] === "class" && jf(t[o + 1].toLowerCase(), n, 0) !== -1)
                return !0;
    } else if (Gi(e)) return !1;
    if (((o = t.indexOf(1, o)), o > -1)) {
        let i;
        for (; ++o < t.length && typeof (i = t[o]) == "string"; )
            if (i.toLowerCase() === n) return !0;
    }
    return !1;
}
function Gi(e) {
    return e.type === 4 && e.value !== Mu;
}
function $f(e, t, n) {
    let r = e.type === 4 && !n ? Mu : e.value;
    return t === r;
}
function Hf(e, t, n) {
    let r = 4,
        o = e.attrs,
        i = o !== null ? zf(o) : 0,
        s = !1;
    for (let a = 0; a < t.length; a++) {
        let u = t[a];
        if (typeof u == "number") {
            if (!s && !re(r) && !re(u)) return !1;
            if (s && re(u)) continue;
            (s = !1), (r = u | (r & 1));
            continue;
        }
        if (!s)
            if (r & 4) {
                if (
                    ((r = 2 | (r & 1)),
                    (u !== "" && !$f(e, u, n)) || (u === "" && t.length === 1))
                ) {
                    if (re(r)) return !1;
                    s = !0;
                }
            } else if (r & 8) {
                if (o === null || !Bf(e, o, u, n)) {
                    if (re(r)) return !1;
                    s = !0;
                }
            } else {
                let c = t[++a],
                    l = Uf(u, o, Gi(e), n);
                if (l === -1) {
                    if (re(r)) return !1;
                    s = !0;
                    continue;
                }
                if (c !== "") {
                    let d;
                    if (
                        (l > i ? (d = "") : (d = o[l + 1].toLowerCase()),
                        r & 2 && c !== d)
                    ) {
                        if (re(r)) return !1;
                        s = !0;
                    }
                }
            }
    }
    return re(r) || s;
}
function re(e) {
    return (e & 1) === 0;
}
function Uf(e, t, n, r) {
    if (t === null) return -1;
    let o = 0;
    if (r || !n) {
        let i = !1;
        for (; o < t.length; ) {
            let s = t[o];
            if (s === e) return o;
            if (s === 3 || s === 6) i = !0;
            else if (s === 1 || s === 2) {
                let a = t[++o];
                for (; typeof a == "string"; ) a = t[++o];
                continue;
            } else {
                if (s === 4) break;
                if (s === 0) {
                    o += 4;
                    continue;
                }
            }
            o += i ? 1 : 2;
        }
        return -1;
    } else return Wf(t, e);
}
function xu(e, t, n = !1) {
    for (let r = 0; r < t.length; r++) if (Hf(e, t[r], n)) return !0;
    return !1;
}
function Gf(e) {
    let t = e.attrs;
    if (t != null) {
        let n = t.indexOf(5);
        if (!(n & 1)) return t[n + 1];
    }
    return null;
}
function zf(e) {
    for (let t = 0; t < e.length; t++) {
        let n = e[t];
        if (_u(n)) return t;
    }
    return e.length;
}
function Wf(e, t) {
    let n = e.indexOf(4);
    if (n > -1)
        for (n++; n < e.length; ) {
            let r = e[n];
            if (typeof r == "number") return -1;
            if (r === t) return n;
            n++;
        }
    return -1;
}
function qf(e, t) {
    e: for (let n = 0; n < t.length; n++) {
        let r = t[n];
        if (e.length === r.length) {
            for (let o = 0; o < e.length; o++) if (e[o] !== r[o]) continue e;
            return !0;
        }
    }
    return !1;
}
function Aa(e, t) {
    return e ? ":not(" + t.trim() + ")" : t;
}
function Yf(e) {
    let t = e[0],
        n = 1,
        r = 2,
        o = "",
        i = !1;
    for (; n < e.length; ) {
        let s = e[n];
        if (typeof s == "string")
            if (r & 2) {
                let a = e[++n];
                o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
        else
            o !== "" && !re(s) && ((t += Aa(i, o)), (o = "")),
                (r = s),
                (i = i || !re(r));
        n++;
    }
    return o !== "" && (t += Aa(i, o)), t;
}
function Qf(e) {
    return e.map(Yf).join(",");
}
function Zf(e) {
    let t = [],
        n = [],
        r = 1,
        o = 2;
    for (; r < e.length; ) {
        let i = e[r];
        if (typeof i == "string")
            o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
        else {
            if (!re(o)) break;
            o = i;
        }
        r++;
    }
    return { attrs: t, classes: n };
}
function P_(e) {
    return on(() => {
        let t = Au(e),
            n = lt(xe({}, t), {
                decls: e.decls,
                vars: e.vars,
                template: e.template,
                consts: e.consts || null,
                ngContentSelectors: e.ngContentSelectors,
                onPush: e.changeDetection === bu.OnPush,
                directiveDefs: null,
                pipeDefs: null,
                dependencies: (t.standalone && e.dependencies) || null,
                getStandaloneInjector: null,
                signals: e.signals ?? !1,
                data: e.data || {},
                encapsulation: e.encapsulation || Qt.Emulated,
                styles: e.styles || z,
                _: null,
                schemas: e.schemas || null,
                tView: null,
                id: "",
            });
        Ou(n);
        let r = e.dependencies;
        return (
            (n.directiveDefs = Fa(r, !1)),
            (n.pipeDefs = Fa(r, !0)),
            (n.id = ep(n)),
            n
        );
    });
}
function Kf(e) {
    return Ne(e) || Su(e);
}
function Jf(e) {
    return e !== null;
}
function zi(e) {
    return on(() => ({
        type: e.type,
        bootstrap: e.bootstrap || z,
        declarations: e.declarations || z,
        imports: e.imports || z,
        exports: e.exports || z,
        transitiveCompileScopes: null,
        schemas: e.schemas || null,
        id: e.id || null,
    }));
}
function Oa(e, t) {
    if (e == null) return Tt;
    let n = {};
    for (let r in e)
        if (e.hasOwnProperty(r)) {
            let o = e[r],
                i,
                s,
                a = Ze.None;
            Array.isArray(o)
                ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
                : ((i = o), (s = o)),
                t
                    ? ((n[i] = a !== Ze.None ? [r, a] : r), (t[i] = s))
                    : (n[i] = r);
        }
    return n;
}
function Wi(e) {
    return on(() => {
        let t = Au(e);
        return Ou(t), t;
    });
}
function Ne(e) {
    return e[mf] || null;
}
function Su(e) {
    return e[yf] || null;
}
function Tu(e) {
    return e[Df] || null;
}
function Xf(e) {
    let t = Ne(e) || Su(e) || Tu(e);
    return t !== null ? t.standalone : !1;
}
function Nu(e, t) {
    let n = e[vf] || null;
    if (!n && t === !0)
        throw new Error(`Type ${H(e)} does not have '\u0275mod' property.`);
    return n;
}
function Au(e) {
    let t = {};
    return {
        type: e.type,
        providersResolver: null,
        factory: null,
        hostBindings: e.hostBindings || null,
        hostVars: e.hostVars || 0,
        hostAttrs: e.hostAttrs || null,
        contentQueries: e.contentQueries || null,
        declaredInputs: t,
        inputTransforms: null,
        inputConfig: e.inputs || Tt,
        exportAs: e.exportAs || null,
        standalone: e.standalone === !0,
        signals: e.signals === !0,
        selectors: e.selectors || z,
        viewQuery: e.viewQuery || null,
        features: e.features || null,
        setInput: null,
        findHostDirectiveDefs: null,
        hostDirectives: null,
        inputs: Oa(e.inputs, t),
        outputs: Oa(e.outputs),
        debugInfo: null,
    };
}
function Ou(e) {
    e.features?.forEach((t) => t(e));
}
function Fa(e, t) {
    if (!e) return null;
    let n = t ? Tu : Kf;
    return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(Jf);
}
function ep(e) {
    let t = 0,
        n = [
            e.selectors,
            e.ngContentSelectors,
            e.hostVars,
            e.hostAttrs,
            e.consts,
            e.vars,
            e.decls,
            e.encapsulation,
            e.standalone,
            e.signals,
            e.exportAs,
            JSON.stringify(e.inputs),
            JSON.stringify(e.outputs),
            Object.getOwnPropertyNames(e.type.prototype),
            !!e.contentQueries,
            !!e.viewQuery,
        ].join("|");
    for (let o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
    return (t += 2147483648), "c" + t;
}
function k_(e) {
    return { ɵproviders: e };
}
function tp(...e) {
    return { ɵproviders: Fu(!0, e), ɵfromNgModule: !0 };
}
function Fu(e, ...t) {
    let n = [],
        r = new Set(),
        o,
        i = (s) => {
            n.push(s);
        };
    return (
        Hi(t, (s) => {
            let a = s;
            jo(a, i, [], r) && ((o ||= []), o.push(a));
        }),
        o !== void 0 && Ru(o, i),
        n
    );
}
function Ru(e, t) {
    for (let n = 0; n < e.length; n++) {
        let { ngModule: r, providers: o } = e[n];
        qi(o, (i) => {
            t(i, r);
        });
    }
}
function jo(e, t, n, r) {
    if (((e = $(e)), !e)) return !1;
    let o = null,
        i = Ma(e),
        s = !i && Ne(e);
    if (!i && !s) {
        let u = e.ngModule;
        if (((i = Ma(u)), i)) o = u;
        else return !1;
    } else {
        if (s && !s.standalone) return !1;
        o = e;
    }
    let a = r.has(o);
    if (s) {
        if (a) return !1;
        if ((r.add(o), s.dependencies)) {
            let u =
                typeof s.dependencies == "function"
                    ? s.dependencies()
                    : s.dependencies;
            for (let c of u) jo(c, t, n, r);
        }
    } else if (i) {
        if (i.imports != null && !a) {
            r.add(o);
            let c;
            try {
                Hi(i.imports, (l) => {
                    jo(l, t, n, r) && ((c ||= []), c.push(l));
                });
            } finally {
            }
            c !== void 0 && Ru(c, t);
        }
        if (!a) {
            let c = St(o) || (() => new o());
            t({ provide: o, useFactory: c, deps: z }, o),
                t({ provide: Cu, useValue: o, multi: !0 }, o),
                t({ provide: ir, useValue: () => R(o), multi: !0 }, o);
        }
        let u = i.providers;
        if (u != null && !a) {
            let c = e;
            qi(u, (l) => {
                t(l, c);
            });
        }
    } else return !1;
    return o !== e && e.providers !== void 0;
}
function qi(e, t) {
    for (let n of e)
        yu(n) && (n = n.ɵproviders), Array.isArray(n) ? qi(n, t) : t(n);
}
var np = A({ provide: String, useValue: A });
function Pu(e) {
    return e !== null && typeof e == "object" && np in e;
}
function rp(e) {
    return !!(e && e.useExisting);
}
function op(e) {
    return !!(e && e.useFactory);
}
function Nt(e) {
    return typeof e == "function";
}
function ip(e) {
    return !!e.useClass;
}
var ku = new T(""),
    Qn = {},
    sp = {},
    wo;
function Yi() {
    return wo === void 0 && (wo = new sr()), wo;
}
var Ae = class {},
    Kt = class extends Ae {
        get destroyed() {
            return this._destroyed;
        }
        constructor(t, n, r, o) {
            super(),
                (this.parent = n),
                (this.source = r),
                (this.scopes = o),
                (this.records = new Map()),
                (this._ngOnDestroyHooks = new Set()),
                (this._onDestroyHooks = []),
                (this._destroyed = !1),
                Bo(t, (s) => this.processProvider(s)),
                this.records.set(Eu, Et(void 0, this)),
                o.has("environment") && this.records.set(Ae, Et(void 0, this));
            let i = this.records.get(ku);
            i != null && typeof i.value == "string" && this.scopes.add(i.value),
                (this.injectorDefTypes = new Set(this.get(Cu, z, b.Self)));
        }
        destroy() {
            this.assertNotDestroyed(), (this._destroyed = !0);
            let t = M(null);
            try {
                for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
                let n = this._onDestroyHooks;
                this._onDestroyHooks = [];
                for (let r of n) r();
            } finally {
                this.records.clear(),
                    this._ngOnDestroyHooks.clear(),
                    this.injectorDefTypes.clear(),
                    M(t);
            }
        }
        onDestroy(t) {
            return (
                this.assertNotDestroyed(),
                this._onDestroyHooks.push(t),
                () => this.removeOnDestroy(t)
            );
        }
        runInContext(t) {
            this.assertNotDestroyed();
            let n = Se(this),
                r = K(void 0),
                o;
            try {
                return t();
            } finally {
                Se(n), K(r);
            }
        }
        get(t, n = Yt, r = b.Default) {
            if ((this.assertNotDestroyed(), t.hasOwnProperty(Sa)))
                return t[Sa](this);
            r = Sr(r);
            let o,
                i = Se(this),
                s = K(void 0);
            try {
                if (!(r & b.SkipSelf)) {
                    let u = this.records.get(t);
                    if (u === void 0) {
                        let c = dp(t) && Mr(t);
                        c && this.injectableDefInScope(c)
                            ? (u = Et(Vo(t), Qn))
                            : (u = null),
                            this.records.set(t, u);
                    }
                    if (u != null) return this.hydrate(t, u);
                }
                let a = r & b.Self ? Yi() : this.parent;
                return (n = r & b.Optional && n === Yt ? null : n), a.get(t, n);
            } catch (a) {
                if (a.name === "NullInjectorError") {
                    if (((a[rr] = a[rr] || []).unshift(H(t)), i)) throw a;
                    return Tf(a, t, "R3InjectorError", this.source);
                } else throw a;
            } finally {
                K(s), Se(i);
            }
        }
        resolveInjectorInitializers() {
            let t = M(null),
                n = Se(this),
                r = K(void 0),
                o;
            try {
                let i = this.get(ir, z, b.Self);
                for (let s of i) s();
            } finally {
                Se(n), K(r), M(t);
            }
        }
        toString() {
            let t = [],
                n = this.records;
            for (let r of n.keys()) t.push(H(r));
            return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
            if (this._destroyed) throw new _(205, !1);
        }
        processProvider(t) {
            t = $(t);
            let n = Nt(t) ? t : $(t && t.provide),
                r = up(t);
            if (!Nt(t) && t.multi === !0) {
                let o = this.records.get(n);
                o ||
                    ((o = Et(void 0, Qn, !0)),
                    (o.factory = () => ko(o.multi)),
                    this.records.set(n, o)),
                    (n = t),
                    o.multi.push(t);
            }
            this.records.set(n, r);
        }
        hydrate(t, n) {
            let r = M(null);
            try {
                return (
                    n.value === Qn && ((n.value = sp), (n.value = n.factory())),
                    typeof n.value == "object" &&
                        n.value &&
                        lp(n.value) &&
                        this._ngOnDestroyHooks.add(n.value),
                    n.value
                );
            } finally {
                M(r);
            }
        }
        injectableDefInScope(t) {
            if (!t.providedIn) return !1;
            let n = $(t.providedIn);
            return typeof n == "string"
                ? n === "any" || this.scopes.has(n)
                : this.injectorDefTypes.has(n);
        }
        removeOnDestroy(t) {
            let n = this._onDestroyHooks.indexOf(t);
            n !== -1 && this._onDestroyHooks.splice(n, 1);
        }
    };
function Vo(e) {
    let t = Mr(e),
        n = t !== null ? t.factory : St(e);
    if (n !== null) return n;
    if (e instanceof T) throw new _(204, !1);
    if (e instanceof Function) return ap(e);
    throw new _(204, !1);
}
function ap(e) {
    if (e.length > 0) throw new _(204, !1);
    let n = hf(e);
    return n !== null ? () => n.factory(e) : () => new e();
}
function up(e) {
    if (Pu(e)) return Et(void 0, e.useValue);
    {
        let t = Lu(e);
        return Et(t, Qn);
    }
}
function Lu(e, t, n) {
    let r;
    if (Nt(e)) {
        let o = $(e);
        return St(o) || Vo(o);
    } else if (Pu(e)) r = () => $(e.useValue);
    else if (op(e)) r = () => e.useFactory(...ko(e.deps || []));
    else if (rp(e)) r = () => R($(e.useExisting));
    else {
        let o = $(e && (e.useClass || e.provide));
        if (cp(e)) r = () => new o(...ko(e.deps));
        else return St(o) || Vo(o);
    }
    return r;
}
function Et(e, t, n = !1) {
    return { factory: e, value: t, multi: n ? [] : void 0 };
}
function cp(e) {
    return !!e.deps;
}
function lp(e) {
    return (
        e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
    );
}
function dp(e) {
    return typeof e == "function" || (typeof e == "object" && e instanceof T);
}
function Bo(e, t) {
    for (let n of e)
        Array.isArray(n) ? Bo(n, t) : n && yu(n) ? Bo(n.ɵproviders, t) : t(n);
}
function fp(e, t) {
    e instanceof Kt && e.assertNotDestroyed();
    let n,
        r = Se(e),
        o = K(void 0);
    try {
        return t();
    } finally {
        Se(r), K(o);
    }
}
function ju() {
    return Du() !== void 0 || Mf() != null;
}
function Vu(e) {
    if (!ju()) throw new _(-203, !1);
}
function pp(e) {
    let t = ve.ng;
    if (t && t.ɵcompilerFacade) return t.ɵcompilerFacade;
    throw new Error("JIT compiler unavailable");
}
function hp(e) {
    return typeof e == "function";
}
var Ee = 0,
    v = 1,
    m = 2,
    j = 3,
    se = 4,
    Q = 5,
    Jt = 6,
    Xt = 7,
    J = 8,
    At = 9,
    ae = 10,
    F = 11,
    en = 12,
    Ra = 13,
    kt = 14,
    ue = 15,
    an = 16,
    Ct = 17,
    Ie = 18,
    Tr = 19,
    Bu = 20,
    Te = 21,
    Zn = 22,
    Ke = 23,
    Y = 25,
    $u = 1;
var Je = 7,
    ar = 8,
    Ot = 9,
    W = 10,
    Qi = (function (e) {
        return (
            (e[(e.None = 0)] = "None"),
            (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
            e
        );
    })(Qi || {});
function Ye(e) {
    return Array.isArray(e) && typeof e[$u] == "object";
}
function Ce(e) {
    return Array.isArray(e) && e[$u] === !0;
}
function Zi(e) {
    return (e.flags & 4) !== 0;
}
function Nr(e) {
    return e.componentOffset > -1;
}
function Ar(e) {
    return (e.flags & 1) === 1;
}
function Oe(e) {
    return !!e.template;
}
function gp(e) {
    return (e[m] & 512) !== 0;
}
var $o = class {
    constructor(t, n, r) {
        (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
    }
    isFirstChange() {
        return this.firstChange;
    }
};
function Hu(e, t, n, r) {
    t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function Uu() {
    return Gu;
}
function Gu(e) {
    return e.type.prototype.ngOnChanges && (e.setInput = yp), mp;
}
Uu.ngInherit = !0;
function mp() {
    let e = Wu(this),
        t = e?.current;
    if (t) {
        let n = e.previous;
        if (n === Tt) e.previous = t;
        else for (let r in t) n[r] = t[r];
        (e.current = null), this.ngOnChanges(t);
    }
}
function yp(e, t, n, r, o) {
    let i = this.declaredInputs[r],
        s = Wu(e) || Dp(e, { previous: Tt, current: null }),
        a = s.current || (s.current = {}),
        u = s.previous,
        c = u[i];
    (a[i] = new $o(c && c.currentValue, n, u === Tt)), Hu(e, t, o, n);
}
var zu = "__ngSimpleChanges__";
function Wu(e) {
    return e[zu] || null;
}
function Dp(e, t) {
    return (e[zu] = t);
}
var Pa = null;
var fe = function (e, t, n) {
        Pa?.(e, t, n);
    },
    qu = "svg",
    vp = "math",
    Ip = !1;
function wp() {
    return Ip;
}
function he(e) {
    for (; Array.isArray(e); ) e = e[Ee];
    return e;
}
function Yu(e, t) {
    return he(t[e]);
}
function X(e, t) {
    return he(t[e.index]);
}
function Ki(e, t) {
    return e.data[t];
}
function Ep(e, t) {
    return e[t];
}
function ke(e, t) {
    let n = t[e];
    return Ye(n) ? n : n[Ee];
}
function Cp(e) {
    return (e[m] & 4) === 4;
}
function Ji(e) {
    return (e[m] & 128) === 128;
}
function bp(e) {
    return Ce(e[j]);
}
function Ft(e, t) {
    return t == null ? null : e[t];
}
function Qu(e) {
    e[Ct] = 0;
}
function _p(e) {
    e[m] & 1024 || ((e[m] |= 1024), Ji(e) && tn(e));
}
function Mp(e, t) {
    for (; e > 0; ) (t = t[kt]), e--;
    return t;
}
function Xi(e) {
    return !!(e[m] & 9216 || e[Ke]?.dirty);
}
function Ho(e) {
    e[ae].changeDetectionScheduler?.notify(1),
        Xi(e)
            ? tn(e)
            : e[m] & 64 &&
              (wp()
                  ? ((e[m] |= 1024), tn(e))
                  : e[ae].changeDetectionScheduler?.notify());
}
function tn(e) {
    e[ae].changeDetectionScheduler?.notify();
    let t = nn(e);
    for (; t !== null && !(t[m] & 8192 || ((t[m] |= 8192), !Ji(t))); )
        t = nn(t);
}
function Zu(e, t) {
    if ((e[m] & 256) === 256) throw new _(911, !1);
    e[Te] === null && (e[Te] = []), e[Te].push(t);
}
function xp(e, t) {
    if (e[Te] === null) return;
    let n = e[Te].indexOf(t);
    n !== -1 && e[Te].splice(n, 1);
}
function nn(e) {
    let t = e[j];
    return Ce(t) ? t[j] : t;
}
var I = { lFrame: oc(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function Sp() {
    return I.lFrame.elementDepthCount;
}
function Tp() {
    I.lFrame.elementDepthCount++;
}
function Np() {
    I.lFrame.elementDepthCount--;
}
function Ku() {
    return I.bindingsEnabled;
}
function Ju() {
    return I.skipHydrationRootTNode !== null;
}
function Ap(e) {
    return I.skipHydrationRootTNode === e;
}
function Op() {
    I.skipHydrationRootTNode = null;
}
function E() {
    return I.lFrame.lView;
}
function P() {
    return I.lFrame.tView;
}
function L_(e) {
    return (I.lFrame.contextLView = e), e[J];
}
function j_(e) {
    return (I.lFrame.contextLView = null), e;
}
function V() {
    let e = Xu();
    for (; e !== null && e.type === 64; ) e = e.parent;
    return e;
}
function Xu() {
    return I.lFrame.currentTNode;
}
function Fp() {
    let e = I.lFrame,
        t = e.currentTNode;
    return e.isParent ? t : t.parent;
}
function it(e, t) {
    let n = I.lFrame;
    (n.currentTNode = e), (n.isParent = t);
}
function es() {
    return I.lFrame.isParent;
}
function ts() {
    I.lFrame.isParent = !1;
}
function Rp() {
    return I.lFrame.contextLView;
}
function Pp() {
    let e = I.lFrame,
        t = e.bindingRootIndex;
    return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function kp(e) {
    return (I.lFrame.bindingIndex = e);
}
function un() {
    return I.lFrame.bindingIndex++;
}
function ec(e) {
    let t = I.lFrame,
        n = t.bindingIndex;
    return (t.bindingIndex = t.bindingIndex + e), n;
}
function Lp() {
    return I.lFrame.inI18n;
}
function jp(e, t) {
    let n = I.lFrame;
    (n.bindingIndex = n.bindingRootIndex = e), Uo(t);
}
function Vp() {
    return I.lFrame.currentDirectiveIndex;
}
function Uo(e) {
    I.lFrame.currentDirectiveIndex = e;
}
function Bp(e) {
    let t = I.lFrame.currentDirectiveIndex;
    return t === -1 ? null : e[t];
}
function tc() {
    return I.lFrame.currentQueryIndex;
}
function ns(e) {
    I.lFrame.currentQueryIndex = e;
}
function $p(e) {
    let t = e[v];
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[Q] : null;
}
function nc(e, t, n) {
    if (n & b.SkipSelf) {
        let o = t,
            i = e;
        for (; (o = o.parent), o === null && !(n & b.Host); )
            if (((o = $p(i)), o === null || ((i = i[kt]), o.type & 10))) break;
        if (o === null) return !1;
        (t = o), (e = i);
    }
    let r = (I.lFrame = rc());
    return (r.currentTNode = t), (r.lView = e), !0;
}
function rs(e) {
    let t = rc(),
        n = e[v];
    (I.lFrame = t),
        (t.currentTNode = n.firstChild),
        (t.lView = e),
        (t.tView = n),
        (t.contextLView = e),
        (t.bindingIndex = n.bindingStartIndex),
        (t.inI18n = !1);
}
function rc() {
    let e = I.lFrame,
        t = e === null ? null : e.child;
    return t === null ? oc(e) : t;
}
function oc(e) {
    let t = {
        currentTNode: null,
        isParent: !0,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: e,
        child: null,
        inI18n: !1,
    };
    return e !== null && (e.child = t), t;
}
function ic() {
    let e = I.lFrame;
    return (I.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var sc = ic;
function os() {
    let e = ic();
    (e.isParent = !0),
        (e.tView = null),
        (e.selectedIndex = -1),
        (e.contextLView = null),
        (e.elementDepthCount = 0),
        (e.currentDirectiveIndex = -1),
        (e.currentNamespace = null),
        (e.bindingRootIndex = -1),
        (e.bindingIndex = -1),
        (e.currentQueryIndex = 0);
}
function Hp(e) {
    return (I.lFrame.contextLView = Mp(e, I.lFrame.contextLView))[J];
}
function st() {
    return I.lFrame.selectedIndex;
}
function Xe(e) {
    I.lFrame.selectedIndex = e;
}
function Or() {
    let e = I.lFrame;
    return Ki(e.tView, e.selectedIndex);
}
function V_() {
    I.lFrame.currentNamespace = qu;
}
function Up() {
    return I.lFrame.currentNamespace;
}
var ac = !0;
function Fr() {
    return ac;
}
function Rr(e) {
    ac = e;
}
function Gp(e, t, n) {
    let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
    if (r) {
        let s = Gu(t);
        (n.preOrderHooks ??= []).push(e, s),
            (n.preOrderCheckHooks ??= []).push(e, s);
    }
    o && (n.preOrderHooks ??= []).push(0 - e, o),
        i &&
            ((n.preOrderHooks ??= []).push(e, i),
            (n.preOrderCheckHooks ??= []).push(e, i));
}
function Pr(e, t) {
    for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
        let i = e.data[n].type.prototype,
            {
                ngAfterContentInit: s,
                ngAfterContentChecked: a,
                ngAfterViewInit: u,
                ngAfterViewChecked: c,
                ngOnDestroy: l,
            } = i;
        s && (e.contentHooks ??= []).push(-n, s),
            a &&
                ((e.contentHooks ??= []).push(n, a),
                (e.contentCheckHooks ??= []).push(n, a)),
            u && (e.viewHooks ??= []).push(-n, u),
            c &&
                ((e.viewHooks ??= []).push(n, c),
                (e.viewCheckHooks ??= []).push(n, c)),
            l != null && (e.destroyHooks ??= []).push(n, l);
    }
}
function Kn(e, t, n) {
    uc(e, t, 3, n);
}
function Jn(e, t, n, r) {
    (e[m] & 3) === n && uc(e, t, n, r);
}
function Eo(e, t) {
    let n = e[m];
    (n & 3) === t && ((n &= 16383), (n += 1), (e[m] = n));
}
function uc(e, t, n, r) {
    let o = r !== void 0 ? e[Ct] & 65535 : 0,
        i = r ?? -1,
        s = t.length - 1,
        a = 0;
    for (let u = o; u < s; u++)
        if (typeof t[u + 1] == "number") {
            if (((a = t[u]), r != null && a >= r)) break;
        } else
            t[u] < 0 && (e[Ct] += 65536),
                (a < i || i == -1) &&
                    (zp(e, n, t, u), (e[Ct] = (e[Ct] & 4294901760) + u + 2)),
                u++;
}
function ka(e, t) {
    fe(4, e, t);
    let n = M(null);
    try {
        t.call(e);
    } finally {
        M(n), fe(5, e, t);
    }
}
function zp(e, t, n, r) {
    let o = n[r] < 0,
        i = n[r + 1],
        s = o ? -n[r] : n[r],
        a = e[s];
    o
        ? e[m] >> 14 < e[Ct] >> 16 &&
          (e[m] & 3) === t &&
          ((e[m] += 16384), ka(a, i))
        : ka(a, i);
}
var xt = -1,
    et = class {
        constructor(t, n, r) {
            (this.factory = t),
                (this.resolving = !1),
                (this.canSeeViewProviders = n),
                (this.injectImpl = r);
        }
    };
function Wp(e) {
    return e instanceof et;
}
function qp(e) {
    return (e.flags & 8) !== 0;
}
function Yp(e) {
    return (e.flags & 16) !== 0;
}
function cc(e) {
    return e !== xt;
}
function ur(e) {
    return e & 32767;
}
function Qp(e) {
    return e >> 16;
}
function cr(e, t) {
    let n = Qp(e),
        r = t;
    for (; n > 0; ) (r = r[kt]), n--;
    return r;
}
var Go = !0;
function La(e) {
    let t = Go;
    return (Go = e), t;
}
var Zp = 256,
    lc = Zp - 1,
    dc = 5,
    Kp = 0,
    pe = {};
function Jp(e, t, n) {
    let r;
    typeof n == "string"
        ? (r = n.charCodeAt(0) || 0)
        : n.hasOwnProperty(Wt) && (r = n[Wt]),
        r == null && (r = n[Wt] = Kp++);
    let o = r & lc,
        i = 1 << o;
    t.data[e + (o >> dc)] |= i;
}
function lr(e, t) {
    let n = fc(e, t);
    if (n !== -1) return n;
    let r = t[v];
    r.firstCreatePass &&
        ((e.injectorIndex = t.length),
        Co(r.data, e),
        Co(t, null),
        Co(r.blueprint, null));
    let o = is(e, t),
        i = e.injectorIndex;
    if (cc(o)) {
        let s = ur(o),
            a = cr(o, t),
            u = a[v].data;
        for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c];
    }
    return (t[i + 8] = o), i;
}
function Co(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function fc(e, t) {
    return e.injectorIndex === -1 ||
        (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
        t[e.injectorIndex + 8] === null
        ? -1
        : e.injectorIndex;
}
function is(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1)
        return e.parent.injectorIndex;
    let n = 0,
        r = null,
        o = t;
    for (; o !== null; ) {
        if (((r = yc(o)), r === null)) return xt;
        if ((n++, (o = o[kt]), r.injectorIndex !== -1))
            return r.injectorIndex | (n << 16);
    }
    return xt;
}
function zo(e, t, n) {
    Jp(e, t, n);
}
function Xp(e, t) {
    if (t === "class") return e.classes;
    if (t === "style") return e.styles;
    let n = e.attrs;
    if (n) {
        let r = n.length,
            o = 0;
        for (; o < r; ) {
            let i = n[o];
            if (_u(i)) break;
            if (i === 0) o = o + 2;
            else if (typeof i == "number")
                for (o++; o < r && typeof n[o] == "string"; ) o++;
            else {
                if (i === t) return n[o + 1];
                o = o + 2;
            }
        }
    }
    return null;
}
function pc(e, t, n) {
    if (n & b.Optional || e !== void 0) return e;
    $i(t, "NodeInjector");
}
function hc(e, t, n, r) {
    if (
        (n & b.Optional && r === void 0 && (r = null), !(n & (b.Self | b.Host)))
    ) {
        let o = e[At],
            i = K(void 0);
        try {
            return o ? o.get(t, r, n & b.Optional) : vu(t, r, n & b.Optional);
        } finally {
            K(i);
        }
    }
    return pc(r, t, n);
}
function gc(e, t, n, r = b.Default, o) {
    if (e !== null) {
        if (t[m] & 2048 && !(r & b.Self)) {
            let s = rh(e, t, n, r, pe);
            if (s !== pe) return s;
        }
        let i = mc(e, t, n, r, pe);
        if (i !== pe) return i;
    }
    return hc(t, n, r, o);
}
function mc(e, t, n, r, o) {
    let i = th(n);
    if (typeof i == "function") {
        if (!nc(t, e, r)) return r & b.Host ? pc(o, n, r) : hc(t, n, r, o);
        try {
            let s;
            if (((s = i(r)), s == null && !(r & b.Optional))) $i(n);
            else return s;
        } finally {
            sc();
        }
    } else if (typeof i == "number") {
        let s = null,
            a = fc(e, t),
            u = xt,
            c = r & b.Host ? t[ue][Q] : null;
        for (
            (a === -1 || r & b.SkipSelf) &&
            ((u = a === -1 ? is(e, t) : t[a + 8]),
            u === xt || !Va(r, !1)
                ? (a = -1)
                : ((s = t[v]), (a = ur(u)), (t = cr(u, t))));
            a !== -1;

        ) {
            let l = t[v];
            if (ja(i, a, l.data)) {
                let d = eh(a, t, n, s, r, c);
                if (d !== pe) return d;
            }
            (u = t[a + 8]),
                u !== xt && Va(r, t[v].data[a + 8] === c) && ja(i, a, t)
                    ? ((s = l), (a = ur(u)), (t = cr(u, t)))
                    : (a = -1);
        }
    }
    return o;
}
function eh(e, t, n, r, o, i) {
    let s = t[v],
        a = s.data[e + 8],
        u = r == null ? Nr(a) && Go : r != s && (a.type & 3) !== 0,
        c = o & b.Host && i === a,
        l = Xn(a, s, n, u, c);
    return l !== null ? tt(t, s, l, a) : pe;
}
function Xn(e, t, n, r, o) {
    let i = e.providerIndexes,
        s = t.data,
        a = i & 1048575,
        u = e.directiveStart,
        c = e.directiveEnd,
        l = i >> 20,
        d = r ? a : a + l,
        f = o ? a + l : c;
    for (let p = d; p < f; p++) {
        let h = s[p];
        if ((p < u && n === h) || (p >= u && h.type === n)) return p;
    }
    if (o) {
        let p = s[u];
        if (p && Oe(p) && p.type === n) return u;
    }
    return null;
}
function tt(e, t, n, r) {
    let o = e[n],
        i = t.data;
    if (Wp(o)) {
        let s = o;
        s.resolving && wf(If(i[n]));
        let a = La(s.canSeeViewProviders);
        s.resolving = !0;
        let u,
            c = s.injectImpl ? K(s.injectImpl) : null,
            l = nc(e, r, b.Default);
        try {
            (o = e[n] = s.factory(void 0, i, e, r)),
                t.firstCreatePass && n >= r.directiveStart && Gp(n, i[n], t);
        } finally {
            c !== null && K(c), La(a), (s.resolving = !1), sc();
        }
    }
    return o;
}
function th(e) {
    if (typeof e == "string") return e.charCodeAt(0) || 0;
    let t = e.hasOwnProperty(Wt) ? e[Wt] : void 0;
    return typeof t == "number" ? (t >= 0 ? t & lc : nh) : t;
}
function ja(e, t, n) {
    let r = 1 << e;
    return !!(n[t + (e >> dc)] & r);
}
function Va(e, t) {
    return !(e & b.Self) && !(e & b.Host && t);
}
var Qe = class {
    constructor(t, n) {
        (this._tNode = t), (this._lView = n);
    }
    get(t, n, r) {
        return gc(this._tNode, this._lView, t, Sr(r), n);
    }
};
function nh() {
    return new Qe(V(), E());
}
function B_(e) {
    return on(() => {
        let t = e.prototype.constructor,
            n = t[nr] || Wo(t),
            r = Object.prototype,
            o = Object.getPrototypeOf(e.prototype).constructor;
        for (; o && o !== r; ) {
            let i = o[nr] || Wo(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o);
        }
        return (i) => new i();
    });
}
function Wo(e) {
    return hu(e)
        ? () => {
              let t = Wo($(e));
              return t && t();
          }
        : St(e);
}
function rh(e, t, n, r, o) {
    let i = e,
        s = t;
    for (; i !== null && s !== null && s[m] & 2048 && !(s[m] & 512); ) {
        let a = mc(i, s, n, r | b.Self, pe);
        if (a !== pe) return a;
        let u = i.parent;
        if (!u) {
            let c = s[Bu];
            if (c) {
                let l = c.get(n, pe, r);
                if (l !== pe) return l;
            }
            (u = yc(s)), (s = s[kt]);
        }
        i = u;
    }
    return o;
}
function yc(e) {
    let t = e[v],
        n = t.type;
    return n === 2 ? t.declTNode : n === 1 ? e[Q] : null;
}
function oh(e) {
    return Xp(V(), e);
}
function Ba(e, t = null, n = null, r) {
    let o = Dc(e, t, n, r);
    return o.resolveInjectorInitializers(), o;
}
function Dc(e, t = null, n = null, r, o = new Set()) {
    let i = [n || z, tp(e)];
    return (
        (r = r || (typeof e == "object" ? void 0 : H(e))),
        new Kt(i, t || Yi(), r || null, o)
    );
}
var Le = (() => {
    let t = class t {
        static create(r, o) {
            if (Array.isArray(r)) return Ba({ name: "" }, o, r, "");
            {
                let i = r.name ?? "";
                return Ba({ name: i }, r.parent, r.providers, i);
            }
        }
    };
    (t.THROW_IF_NOT_FOUND = Yt),
        (t.NULL = new sr()),
        (t.ɵprov = O({ token: t, providedIn: "any", factory: () => R(Eu) })),
        (t.__NG_ELEMENT_ID__ = -1);
    let e = t;
    return e;
})();
var ih = "ngOriginalError";
function bo(e) {
    return e[ih];
}
var Fe = class {
        constructor() {
            this._console = console;
        }
        handleError(t) {
            let n = this._findOriginalError(t);
            this._console.error("ERROR", t),
                n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
            let n = t && bo(t);
            for (; n && bo(n); ) n = bo(n);
            return n || null;
        }
    },
    vc = new T("", {
        providedIn: "root",
        factory: () => S(Fe).handleError.bind(void 0),
    }),
    kr = (() => {
        let t = class t {};
        (t.__NG_ELEMENT_ID__ = sh), (t.__NG_ENV_ID__ = (r) => r);
        let e = t;
        return e;
    })(),
    qo = class extends kr {
        constructor(t) {
            super(), (this._lView = t);
        }
        onDestroy(t) {
            return Zu(this._lView, t), () => xp(this._lView, t);
        }
    };
function sh() {
    return new qo(E());
}
function ah() {
    return Lt(V(), E());
}
function Lt(e, t) {
    return new jt(X(e, t));
}
var jt = (() => {
    let t = class t {
        constructor(r) {
            this.nativeElement = r;
        }
    };
    t.__NG_ELEMENT_ID__ = ah;
    let e = t;
    return e;
})();
function uh(e) {
    return e instanceof jt ? e.nativeElement : e;
}
var Yo = class extends ce {
    constructor(t = !1) {
        super(),
            (this.destroyRef = void 0),
            (this.__isAsync = t),
            ju() && (this.destroyRef = S(kr, { optional: !0 }) ?? void 0);
    }
    emit(t) {
        let n = M(null);
        try {
            super.next(t);
        } finally {
            M(n);
        }
    }
    subscribe(t, n, r) {
        let o = t,
            i = n || (() => null),
            s = r;
        if (t && typeof t == "object") {
            let u = t;
            (o = u.next?.bind(u)),
                (i = u.error?.bind(u)),
                (s = u.complete?.bind(u));
        }
        this.__isAsync && ((i = _o(i)), o && (o = _o(o)), s && (s = _o(s)));
        let a = super.subscribe({ next: o, error: i, complete: s });
        return t instanceof L && t.add(a), a;
    }
};
function _o(e) {
    return (t) => {
        setTimeout(e, void 0, t);
    };
}
var ie = Yo;
function ch() {
    return this._results[Symbol.iterator]();
}
var Qo = class e {
    get changes() {
        return (this._changes ??= new ie());
    }
    constructor(t = !1) {
        (this._emitDistinctChangesOnly = t),
            (this.dirty = !0),
            (this._onDirty = void 0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = void 0),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
        let n = e.prototype;
        n[Symbol.iterator] || (n[Symbol.iterator] = ch);
    }
    get(t) {
        return this._results[t];
    }
    map(t) {
        return this._results.map(t);
    }
    filter(t) {
        return this._results.filter(t);
    }
    find(t) {
        return this._results.find(t);
    }
    reduce(t, n) {
        return this._results.reduce(t, n);
    }
    forEach(t) {
        this._results.forEach(t);
    }
    some(t) {
        return this._results.some(t);
    }
    toArray() {
        return this._results.slice();
    }
    toString() {
        return this._results.toString();
    }
    reset(t, n) {
        this.dirty = !1;
        let r = Rf(t);
        (this._changesDetected = !Ff(this._results, r, n)) &&
            ((this._results = r),
            (this.length = r.length),
            (this.last = r[this.length - 1]),
            (this.first = r[0]));
    }
    notifyOnChanges() {
        this._changes !== void 0 &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
    }
    onDirty(t) {
        this._onDirty = t;
    }
    setDirty() {
        (this.dirty = !0), this._onDirty?.();
    }
    destroy() {
        this._changes !== void 0 &&
            (this._changes.complete(), this._changes.unsubscribe());
    }
};
function Ic(e) {
    return (e.flags & 128) === 128;
}
var wc = new Map(),
    lh = 0;
function dh() {
    return lh++;
}
function fh(e) {
    wc.set(e[Tr], e);
}
function ph(e) {
    wc.delete(e[Tr]);
}
var $a = "__ngContext__";
function Re(e, t) {
    Ye(t) ? ((e[$a] = t[Tr]), fh(t)) : (e[$a] = t);
}
function Ec(e) {
    return bc(e[en]);
}
function Cc(e) {
    return bc(e[se]);
}
function bc(e) {
    for (; e !== null && !Ce(e); ) e = e[se];
    return e;
}
var Zo;
function $_(e) {
    Zo = e;
}
function hh() {
    if (Zo !== void 0) return Zo;
    if (typeof document < "u") return document;
    throw new _(210, !1);
}
var H_ = new T("", { providedIn: "root", factory: () => gh }),
    gh = "ng",
    mh = new T(""),
    ss = new T("", { providedIn: "platform", factory: () => "unknown" });
var U_ = new T(""),
    G_ = new T("", {
        providedIn: "root",
        factory: () =>
            hh()
                .body?.querySelector("[ngCspNonce]")
                ?.getAttribute("ngCspNonce") || null,
    });
var yh = "h",
    Dh = "b";
var vh = () => null;
function as(e, t, n = !1) {
    return vh(e, t, n);
}
var _c = !1,
    Ih = new T("", { providedIn: "root", factory: () => _c });
var Un;
function wh() {
    if (Un === void 0 && ((Un = null), ve.trustedTypes))
        try {
            Un = ve.trustedTypes.createPolicy("angular", {
                createHTML: (e) => e,
                createScript: (e) => e,
                createScriptURL: (e) => e,
            });
        } catch {}
    return Un;
}
function Lr(e) {
    return wh()?.createHTML(e) || e;
}
var Gn;
function Eh() {
    if (Gn === void 0 && ((Gn = null), ve.trustedTypes))
        try {
            Gn = ve.trustedTypes.createPolicy("angular#unsafe-bypass", {
                createHTML: (e) => e,
                createScript: (e) => e,
                createScriptURL: (e) => e,
            });
        } catch {}
    return Gn;
}
function Ha(e) {
    return Eh()?.createScriptURL(e) || e;
}
var we = class {
        constructor(t) {
            this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
            return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${lu})`;
        }
    },
    Ko = class extends we {
        getTypeName() {
            return "HTML";
        }
    },
    Jo = class extends we {
        getTypeName() {
            return "Style";
        }
    },
    Xo = class extends we {
        getTypeName() {
            return "Script";
        }
    },
    ei = class extends we {
        getTypeName() {
            return "URL";
        }
    },
    ti = class extends we {
        getTypeName() {
            return "ResourceURL";
        }
    };
function cn(e) {
    return e instanceof we ? e.changingThisBreaksApplicationSecurity : e;
}
function Mc(e, t) {
    let n = Ch(e);
    if (n != null && n !== t) {
        if (n === "ResourceURL" && t === "URL") return !0;
        throw new Error(`Required a safe ${t}, got a ${n} (see ${lu})`);
    }
    return n === t;
}
function Ch(e) {
    return (e instanceof we && e.getTypeName()) || null;
}
function z_(e) {
    return new Ko(e);
}
function W_(e) {
    return new Jo(e);
}
function q_(e) {
    return new Xo(e);
}
function Y_(e) {
    return new ei(e);
}
function Q_(e) {
    return new ti(e);
}
function bh(e) {
    let t = new ri(e);
    return _h() ? new ni(t) : t;
}
var ni = class {
        constructor(t) {
            this.inertDocumentHelper = t;
        }
        getInertBodyElement(t) {
            t = "<body><remove></remove>" + t;
            try {
                let n = new window.DOMParser().parseFromString(
                    Lr(t),
                    "text/html"
                ).body;
                return n === null
                    ? this.inertDocumentHelper.getInertBodyElement(t)
                    : (n.removeChild(n.firstChild), n);
            } catch {
                return null;
            }
        }
    },
    ri = class {
        constructor(t) {
            (this.defaultDoc = t),
                (this.inertDocument =
                    this.defaultDoc.implementation.createHTMLDocument(
                        "sanitization-inert"
                    ));
        }
        getInertBodyElement(t) {
            let n = this.inertDocument.createElement("template");
            return (n.innerHTML = Lr(t)), n;
        }
    };
function _h() {
    try {
        return !!new window.DOMParser().parseFromString(Lr(""), "text/html");
    } catch {
        return !1;
    }
}
var Mh = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function xc(e) {
    return (e = String(e)), e.match(Mh) ? e : "unsafe:" + e;
}
function be(e) {
    let t = {};
    for (let n of e.split(",")) t[n] = !0;
    return t;
}
function ln(...e) {
    let t = {};
    for (let n of e) for (let r in n) n.hasOwnProperty(r) && (t[r] = !0);
    return t;
}
var Sc = be("area,br,col,hr,img,wbr"),
    Tc = be("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
    Nc = be("rp,rt"),
    xh = ln(Nc, Tc),
    Sh = ln(
        Tc,
        be(
            "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
        )
    ),
    Th = ln(
        Nc,
        be(
            "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
        )
    ),
    Ua = ln(Sc, Sh, Th, xh),
    Ac = be("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
    Nh = be(
        "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
    ),
    Ah = be(
        "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
    ),
    Oh = ln(Ac, Nh, Ah),
    Fh = be("script,style,template"),
    oi = class {
        constructor() {
            (this.sanitizedSomething = !1), (this.buf = []);
        }
        sanitizeChildren(t) {
            let n = t.firstChild,
                r = !0,
                o = [];
            for (; n; ) {
                if (
                    (n.nodeType === Node.ELEMENT_NODE
                        ? (r = this.startElement(n))
                        : n.nodeType === Node.TEXT_NODE
                          ? this.chars(n.nodeValue)
                          : (this.sanitizedSomething = !0),
                    r && n.firstChild)
                ) {
                    o.push(n), (n = kh(n));
                    continue;
                }
                for (; n; ) {
                    n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
                    let i = Ph(n);
                    if (i) {
                        n = i;
                        break;
                    }
                    n = o.pop();
                }
            }
            return this.buf.join("");
        }
        startElement(t) {
            let n = Ga(t).toLowerCase();
            if (!Ua.hasOwnProperty(n))
                return (this.sanitizedSomething = !0), !Fh.hasOwnProperty(n);
            this.buf.push("<"), this.buf.push(n);
            let r = t.attributes;
            for (let o = 0; o < r.length; o++) {
                let i = r.item(o),
                    s = i.name,
                    a = s.toLowerCase();
                if (!Oh.hasOwnProperty(a)) {
                    this.sanitizedSomething = !0;
                    continue;
                }
                let u = i.value;
                Ac[a] && (u = xc(u)), this.buf.push(" ", s, '="', za(u), '"');
            }
            return this.buf.push(">"), !0;
        }
        endElement(t) {
            let n = Ga(t).toLowerCase();
            Ua.hasOwnProperty(n) &&
                !Sc.hasOwnProperty(n) &&
                (this.buf.push("</"), this.buf.push(n), this.buf.push(">"));
        }
        chars(t) {
            this.buf.push(za(t));
        }
    };
function Rh(e, t) {
    return (
        (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !==
        Node.DOCUMENT_POSITION_CONTAINED_BY
    );
}
function Ph(e) {
    let t = e.nextSibling;
    if (t && e !== t.previousSibling) throw Oc(t);
    return t;
}
function kh(e) {
    let t = e.firstChild;
    if (t && Rh(e, t)) throw Oc(t);
    return t;
}
function Ga(e) {
    let t = e.nodeName;
    return typeof t == "string" ? t : "FORM";
}
function Oc(e) {
    return new Error(
        `Failed to sanitize html because the element is clobbered: ${e.outerHTML}`
    );
}
var Lh = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
    jh = /([^\#-~ |!])/g;
function za(e) {
    return e
        .replace(/&/g, "&amp;")
        .replace(Lh, function (t) {
            let n = t.charCodeAt(0),
                r = t.charCodeAt(1);
            return "&#" + ((n - 55296) * 1024 + (r - 56320) + 65536) + ";";
        })
        .replace(jh, function (t) {
            return "&#" + t.charCodeAt(0) + ";";
        })
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
var zn;
function Z_(e, t) {
    let n = null;
    try {
        zn = zn || bh(e);
        let r = t ? String(t) : "";
        n = zn.getInertBodyElement(r);
        let o = 5,
            i = r;
        do {
            if (o === 0)
                throw new Error(
                    "Failed to sanitize html because the input is unstable"
                );
            o--, (r = i), (i = n.innerHTML), (n = zn.getInertBodyElement(r));
        } while (r !== i);
        let a = new oi().sanitizeChildren(Wa(n) || n);
        return Lr(a);
    } finally {
        if (n) {
            let r = Wa(n) || n;
            for (; r.firstChild; ) r.removeChild(r.firstChild);
        }
    }
}
function Wa(e) {
    return "content" in e && Vh(e) ? e.content : null;
}
function Vh(e) {
    return e.nodeType === Node.ELEMENT_NODE && e.nodeName === "TEMPLATE";
}
var us = (function (e) {
    return (
        (e[(e.NONE = 0)] = "NONE"),
        (e[(e.HTML = 1)] = "HTML"),
        (e[(e.STYLE = 2)] = "STYLE"),
        (e[(e.SCRIPT = 3)] = "SCRIPT"),
        (e[(e.URL = 4)] = "URL"),
        (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        e
    );
})(us || {});
function Bh(e) {
    let t = Fc();
    return t ? t.sanitize(us.URL, e) || "" : Mc(e, "URL") ? cn(e) : xc(xr(e));
}
function $h(e) {
    let t = Fc();
    if (t) return Ha(t.sanitize(us.RESOURCE_URL, e) || "");
    if (Mc(e, "ResourceURL")) return Ha(cn(e));
    throw new _(904, !1);
}
function Hh(e, t) {
    return (t === "src" &&
        (e === "embed" ||
            e === "frame" ||
            e === "iframe" ||
            e === "media" ||
            e === "script")) ||
        (t === "href" && (e === "base" || e === "link"))
        ? $h
        : Bh;
}
function K_(e, t, n) {
    return Hh(t, n)(e);
}
function Fc() {
    let e = E();
    return e && e[ae].sanitizer;
}
var Uh = /^>|^->|<!--|-->|--!>|<!-$/g,
    Gh = /(<|>)/g,
    zh = "\u200B$1\u200B";
function Wh(e) {
    return e.replace(Uh, (t) => t.replace(Gh, zh));
}
function Rc(e) {
    return e instanceof Function ? e() : e;
}
function qh(e) {
    return (e ?? S(Le)).get(ss) === "browser";
}
var dr = (function (e) {
        return (
            (e[(e.Important = 1)] = "Important"),
            (e[(e.DashCase = 2)] = "DashCase"),
            e
        );
    })(dr || {}),
    Yh;
function cs(e, t) {
    return Yh(e, t);
}
function bt(e, t, n, r, o) {
    if (r != null) {
        let i,
            s = !1;
        Ce(r) ? (i = r) : Ye(r) && ((s = !0), (r = r[Ee]));
        let a = he(r);
        e === 0 && n !== null
            ? o == null
                ? Vc(t, n, a)
                : pr(t, n, a, o || null, !0)
            : e === 1 && n !== null
              ? pr(t, n, a, o || null, !0)
              : e === 2
                ? lg(t, a, s)
                : e === 3 && t.destroyNode(a),
            i != null && fg(t, e, i, n, o);
    }
}
function Qh(e, t) {
    return e.createText(t);
}
function Zh(e, t, n) {
    e.setValue(t, n);
}
function Kh(e, t) {
    return e.createComment(Wh(t));
}
function Pc(e, t, n) {
    return e.createElement(t, n);
}
function Jh(e, t) {
    kc(e, t), (t[Ee] = null), (t[Q] = null);
}
function Xh(e, t, n, r, o, i) {
    (r[Ee] = o), (r[Q] = t), Vr(e, r, n, 1, o, i);
}
function kc(e, t) {
    t[ae].changeDetectionScheduler?.notify(1), Vr(e, t, t[F], 2, null, null);
}
function eg(e) {
    let t = e[en];
    if (!t) return Mo(e[v], e);
    for (; t; ) {
        let n = null;
        if (Ye(t)) n = t[en];
        else {
            let r = t[W];
            r && (n = r);
        }
        if (!n) {
            for (; t && !t[se] && t !== e; ) Ye(t) && Mo(t[v], t), (t = t[j]);
            t === null && (t = e), Ye(t) && Mo(t[v], t), (n = t && t[se]);
        }
        t = n;
    }
}
function tg(e, t, n, r) {
    let o = W + r,
        i = n.length;
    r > 0 && (n[o - 1][se] = t),
        r < i - W
            ? ((t[se] = n[o]), wu(n, W + r, t))
            : (n.push(t), (t[se] = null)),
        (t[j] = n);
    let s = t[an];
    s !== null && n !== s && ng(s, t);
    let a = t[Ie];
    a !== null && a.insertView(e), Ho(t), (t[m] |= 128);
}
function ng(e, t) {
    let n = e[Ot],
        o = t[j][j][ue];
    t[ue] !== o && (e[m] |= Qi.HasTransplantedViews),
        n === null ? (e[Ot] = [t]) : n.push(t);
}
function Lc(e, t) {
    let n = e[Ot],
        r = n.indexOf(t);
    n.splice(r, 1);
}
function fr(e, t) {
    if (e.length <= W) return;
    let n = W + t,
        r = e[n];
    if (r) {
        let o = r[an];
        o !== null && o !== e && Lc(o, r), t > 0 && (e[n - 1][se] = r[se]);
        let i = or(e, W + t);
        Jh(r[v], r);
        let s = i[Ie];
        s !== null && s.detachView(i[v]),
            (r[j] = null),
            (r[se] = null),
            (r[m] &= -129);
    }
    return r;
}
function ls(e, t) {
    if (!(t[m] & 256)) {
        let n = t[F];
        n.destroyNode && Vr(e, t, n, 3, null, null), eg(t);
    }
}
function Mo(e, t) {
    if (t[m] & 256) return;
    let n = M(null);
    try {
        (t[m] &= -129),
            (t[m] |= 256),
            t[Ke] && Kr(t[Ke]),
            og(e, t),
            rg(e, t),
            t[v].type === 1 && t[F].destroy();
        let r = t[an];
        if (r !== null && Ce(t[j])) {
            r !== t[j] && Lc(r, t);
            let o = t[Ie];
            o !== null && o.detachView(e);
        }
        ph(t);
    } finally {
        M(n);
    }
}
function rg(e, t) {
    let n = e.cleanup,
        r = t[Xt];
    if (n !== null)
        for (let i = 0; i < n.length - 1; i += 2)
            if (typeof n[i] == "string") {
                let s = n[i + 3];
                s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
            } else {
                let s = r[n[i + 1]];
                n[i].call(s);
            }
    r !== null && (t[Xt] = null);
    let o = t[Te];
    if (o !== null) {
        t[Te] = null;
        for (let i = 0; i < o.length; i++) {
            let s = o[i];
            s();
        }
    }
}
function og(e, t) {
    let n;
    if (e != null && (n = e.destroyHooks) != null)
        for (let r = 0; r < n.length; r += 2) {
            let o = t[n[r]];
            if (!(o instanceof et)) {
                let i = n[r + 1];
                if (Array.isArray(i))
                    for (let s = 0; s < i.length; s += 2) {
                        let a = o[i[s]],
                            u = i[s + 1];
                        fe(4, a, u);
                        try {
                            u.call(a);
                        } finally {
                            fe(5, a, u);
                        }
                    }
                else {
                    fe(4, o, i);
                    try {
                        i.call(o);
                    } finally {
                        fe(5, o, i);
                    }
                }
            }
        }
}
function jc(e, t, n) {
    return ig(e, t.parent, n);
}
function ig(e, t, n) {
    let r = t;
    for (; r !== null && r.type & 40; ) (t = r), (r = t.parent);
    if (r === null) return n[Ee];
    {
        let { componentOffset: o } = r;
        if (o > -1) {
            let { encapsulation: i } = e.data[r.directiveStart + o];
            if (i === Qt.None || i === Qt.Emulated) return null;
        }
        return X(r, n);
    }
}
function pr(e, t, n, r, o) {
    e.insertBefore(t, n, r, o);
}
function Vc(e, t, n) {
    e.appendChild(t, n);
}
function qa(e, t, n, r, o) {
    r !== null ? pr(e, t, n, r, o) : Vc(e, t, n);
}
function sg(e, t, n, r) {
    e.removeChild(t, n, r);
}
function ds(e, t) {
    return e.parentNode(t);
}
function ag(e, t) {
    return e.nextSibling(t);
}
function Bc(e, t, n) {
    return cg(e, t, n);
}
function ug(e, t, n) {
    return e.type & 40 ? X(e, n) : null;
}
var cg = ug,
    Ya;
function jr(e, t, n, r) {
    let o = jc(e, r, t),
        i = t[F],
        s = r.parent || t[Q],
        a = Bc(s, r, t);
    if (o != null)
        if (Array.isArray(n))
            for (let u = 0; u < n.length; u++) qa(i, o, n[u], a, !1);
        else qa(i, o, n, a, !1);
    Ya !== void 0 && Ya(i, r, t, n, o);
}
function er(e, t) {
    if (t !== null) {
        let n = t.type;
        if (n & 3) return X(t, e);
        if (n & 4) return ii(-1, e[t.index]);
        if (n & 8) {
            let r = t.child;
            if (r !== null) return er(e, r);
            {
                let o = e[t.index];
                return Ce(o) ? ii(-1, o) : he(o);
            }
        } else {
            if (n & 32) return cs(t, e)() || he(e[t.index]);
            {
                let r = $c(e, t);
                if (r !== null) {
                    if (Array.isArray(r)) return r[0];
                    let o = nn(e[ue]);
                    return er(o, r);
                } else return er(e, t.next);
            }
        }
    }
    return null;
}
function $c(e, t) {
    if (t !== null) {
        let r = e[ue][Q],
            o = t.projection;
        return r.projection[o];
    }
    return null;
}
function ii(e, t) {
    let n = W + e + 1;
    if (n < t.length) {
        let r = t[n],
            o = r[v].firstChild;
        if (o !== null) return er(r, o);
    }
    return t[Je];
}
function lg(e, t, n) {
    let r = ds(e, t);
    r && sg(e, r, t, n);
}
function fs(e, t, n, r, o, i, s) {
    for (; n != null; ) {
        let a = r[n.index],
            u = n.type;
        if (
            (s && t === 0 && (a && Re(he(a), r), (n.flags |= 2)),
            (n.flags & 32) !== 32)
        )
            if (u & 8) fs(e, t, n.child, r, o, i, !1), bt(t, e, o, a, i);
            else if (u & 32) {
                let c = cs(n, r),
                    l;
                for (; (l = c()); ) bt(t, e, o, l, i);
                bt(t, e, o, a, i);
            } else u & 16 ? Hc(e, t, r, n, o, i) : bt(t, e, o, a, i);
        n = s ? n.projectionNext : n.next;
    }
}
function Vr(e, t, n, r, o, i) {
    fs(n, r, e.firstChild, t, o, i, !1);
}
function dg(e, t, n) {
    let r = t[F],
        o = jc(e, n, t),
        i = n.parent || t[Q],
        s = Bc(i, n, t);
    Hc(r, 0, t, n, o, s);
}
function Hc(e, t, n, r, o, i) {
    let s = n[ue],
        u = s[Q].projection[r.projection];
    if (Array.isArray(u))
        for (let c = 0; c < u.length; c++) {
            let l = u[c];
            bt(t, e, o, l, i);
        }
    else {
        let c = u,
            l = s[j];
        Ic(r) && (c.flags |= 128), fs(e, t, c, l, o, i, !0);
    }
}
function fg(e, t, n, r, o) {
    let i = n[Je],
        s = he(n);
    i !== s && bt(t, e, r, i, o);
    for (let a = W; a < n.length; a++) {
        let u = n[a];
        Vr(u[v], u, e, t, r, i);
    }
}
function pg(e, t, n, r, o) {
    if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
    else {
        let i = r.indexOf("-") === -1 ? void 0 : dr.DashCase;
        o == null
            ? e.removeStyle(n, r, i)
            : (typeof o == "string" &&
                  o.endsWith("!important") &&
                  ((o = o.slice(0, -10)), (i |= dr.Important)),
              e.setStyle(n, r, o, i));
    }
}
function hg(e, t, n) {
    e.setAttribute(t, "style", n);
}
function Uc(e, t, n) {
    n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Gc(e, t, n) {
    let { mergedAttrs: r, classes: o, styles: i } = n;
    r !== null && Lo(e, t, r),
        o !== null && Uc(e, t, o),
        i !== null && hg(e, t, i);
}
var ge = {};
function J_(e = 1) {
    zc(P(), E(), st() + e, !1);
}
function zc(e, t, n, r) {
    if (!r)
        if ((t[m] & 3) === 3) {
            let i = e.preOrderCheckHooks;
            i !== null && Kn(t, i, n);
        } else {
            let i = e.preOrderHooks;
            i !== null && Jn(t, i, 0, n);
        }
    Xe(n);
}
function _e(e, t = b.Default) {
    let n = E();
    if (n === null) return R(e, t);
    let r = V();
    return gc(r, n, $(e), t);
}
function X_() {
    let e = "invalid";
    throw new Error(e);
}
function Wc(e, t, n, r, o, i) {
    let s = M(null);
    try {
        let a = null;
        o & Ze.SignalBased && (a = t[r][gn]),
            a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
            o & Ze.HasDecoratorInputTransform &&
                (i = e.inputTransforms[r].call(t, i)),
            e.setInput !== null ? e.setInput(t, a, i, n, r) : Hu(t, a, r, i);
    } finally {
        M(s);
    }
}
function gg(e, t) {
    let n = e.hostBindingOpCodes;
    if (n !== null)
        try {
            for (let r = 0; r < n.length; r++) {
                let o = n[r];
                if (o < 0) Xe(~o);
                else {
                    let i = o,
                        s = n[++r],
                        a = n[++r];
                    jp(s, i);
                    let u = t[i];
                    a(2, u);
                }
            }
        } finally {
            Xe(-1);
        }
}
function Br(e, t, n, r, o, i, s, a, u, c, l) {
    let d = t.blueprint.slice();
    return (
        (d[Ee] = o),
        (d[m] = r | 4 | 128 | 8 | 64),
        (c !== null || (e && e[m] & 2048)) && (d[m] |= 2048),
        Qu(d),
        (d[j] = d[kt] = e),
        (d[J] = n),
        (d[ae] = s || (e && e[ae])),
        (d[F] = a || (e && e[F])),
        (d[At] = u || (e && e[At]) || null),
        (d[Q] = i),
        (d[Tr] = dh()),
        (d[Jt] = l),
        (d[Bu] = c),
        (d[ue] = t.type == 2 ? e[ue] : d),
        d
    );
}
function Vt(e, t, n, r, o) {
    let i = e.data[t];
    if (i === null) (i = mg(e, t, n, r, o)), Lp() && (i.flags |= 32);
    else if (i.type & 64) {
        (i.type = n), (i.value = r), (i.attrs = o);
        let s = Fp();
        i.injectorIndex = s === null ? -1 : s.injectorIndex;
    }
    return it(i, !0), i;
}
function mg(e, t, n, r, o) {
    let i = Xu(),
        s = es(),
        a = s ? i : i && i.parent,
        u = (e.data[t] = Eg(e, a, n, t, r, o));
    return (
        e.firstChild === null && (e.firstChild = u),
        i !== null &&
            (s
                ? i.child == null && u.parent !== null && (i.child = u)
                : i.next === null && ((i.next = u), (u.prev = i))),
        u
    );
}
function qc(e, t, n, r) {
    if (n === 0) return -1;
    let o = t.length;
    for (let i = 0; i < n; i++)
        t.push(r), e.blueprint.push(r), e.data.push(null);
    return o;
}
function Yc(e, t, n, r, o) {
    let i = st(),
        s = r & 2;
    try {
        Xe(-1), s && t.length > Y && zc(e, t, Y, !1), fe(s ? 2 : 0, o), n(r, o);
    } finally {
        Xe(i), fe(s ? 3 : 1, o);
    }
}
function ps(e, t, n) {
    if (Zi(t)) {
        let r = M(null);
        try {
            let o = t.directiveStart,
                i = t.directiveEnd;
            for (let s = o; s < i; s++) {
                let a = e.data[s];
                if (a.contentQueries) {
                    let u = n[s];
                    a.contentQueries(1, u, s);
                }
            }
        } finally {
            M(r);
        }
    }
}
function hs(e, t, n) {
    Ku() && (Sg(e, t, n, X(n, t)), (n.flags & 64) === 64 && Kc(e, t, n));
}
function gs(e, t, n = X) {
    let r = t.localNames;
    if (r !== null) {
        let o = t.index + 1;
        for (let i = 0; i < r.length; i += 2) {
            let s = r[i + 1],
                a = s === -1 ? n(t, e) : e[s];
            e[o++] = a;
        }
    }
}
function Qc(e) {
    let t = e.tView;
    return t === null || t.incompleteFirstPass
        ? (e.tView = ms(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id
          ))
        : t;
}
function ms(e, t, n, r, o, i, s, a, u, c, l) {
    let d = Y + r,
        f = d + o,
        p = yg(d, f),
        h = typeof c == "function" ? c() : c;
    return (p[v] = {
        type: e,
        blueprint: p,
        template: n,
        queries: null,
        viewQuery: a,
        declTNode: t,
        data: p.slice().fill(null, d),
        bindingStartIndex: d,
        expandoStartIndex: f,
        hostBindingOpCodes: null,
        firstCreatePass: !0,
        firstUpdatePass: !0,
        staticViewQueries: !1,
        staticContentQueries: !1,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof i == "function" ? i() : i,
        pipeRegistry: typeof s == "function" ? s() : s,
        firstChild: null,
        schemas: u,
        consts: h,
        incompleteFirstPass: !1,
        ssrId: l,
    });
}
function yg(e, t) {
    let n = [];
    for (let r = 0; r < t; r++) n.push(r < e ? null : ge);
    return n;
}
function Dg(e, t, n, r) {
    let i = r.get(Ih, _c) || n === Qt.ShadowDom,
        s = e.selectRootElement(t, i);
    return vg(s), s;
}
function vg(e) {
    Ig(e);
}
var Ig = () => null;
function wg(e, t, n, r) {
    let o = el(t);
    o.push(n), e.firstCreatePass && tl(e).push(r, o.length - 1);
}
function Eg(e, t, n, r, o, i) {
    let s = t ? t.injectorIndex : -1,
        a = 0;
    return (
        Ju() && (a |= 128),
        {
            type: n,
            index: r,
            insertBeforeIndex: null,
            injectorIndex: s,
            directiveStart: -1,
            directiveEnd: -1,
            directiveStylingLast: -1,
            componentOffset: -1,
            propertyBindings: null,
            flags: a,
            providerIndexes: 0,
            value: o,
            attrs: i,
            mergedAttrs: null,
            localNames: null,
            initialInputs: void 0,
            inputs: null,
            outputs: null,
            tView: null,
            next: null,
            prev: null,
            projectionNext: null,
            child: null,
            parent: t,
            projection: null,
            styles: null,
            stylesWithoutHost: null,
            residualStyles: void 0,
            classes: null,
            classesWithoutHost: null,
            residualClasses: void 0,
            classBindings: 0,
            styleBindings: 0,
        }
    );
}
function Qa(e, t, n, r, o) {
    for (let i in t) {
        if (!t.hasOwnProperty(i)) continue;
        let s = t[i];
        if (s === void 0) continue;
        r ??= {};
        let a,
            u = Ze.None;
        Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s);
        let c = i;
        if (o !== null) {
            if (!o.hasOwnProperty(i)) continue;
            c = o[i];
        }
        e === 0 ? Za(r, n, c, a, u) : Za(r, n, c, a);
    }
    return r;
}
function Za(e, t, n, r, o) {
    let i;
    e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
        o !== void 0 && i.push(o);
}
function Cg(e, t, n) {
    let r = t.directiveStart,
        o = t.directiveEnd,
        i = e.data,
        s = t.attrs,
        a = [],
        u = null,
        c = null;
    for (let l = r; l < o; l++) {
        let d = i[l],
            f = n ? n.get(d) : null,
            p = f ? f.inputs : null,
            h = f ? f.outputs : null;
        (u = Qa(0, d.inputs, l, u, p)), (c = Qa(1, d.outputs, l, c, h));
        let w = u !== null && s !== null && !Gi(t) ? Vg(u, l, s) : null;
        a.push(w);
    }
    u !== null &&
        (u.hasOwnProperty("class") && (t.flags |= 8),
        u.hasOwnProperty("style") && (t.flags |= 16)),
        (t.initialInputs = a),
        (t.inputs = u),
        (t.outputs = c);
}
function bg(e) {
    return e === "class"
        ? "className"
        : e === "for"
          ? "htmlFor"
          : e === "formaction"
            ? "formAction"
            : e === "innerHtml"
              ? "innerHTML"
              : e === "readonly"
                ? "readOnly"
                : e === "tabindex"
                  ? "tabIndex"
                  : e;
}
function ys(e, t, n, r, o, i, s, a) {
    let u = X(t, n),
        c = t.inputs,
        l;
    !a && c != null && (l = c[r])
        ? (vs(e, n, l, r, o), Nr(t) && _g(n, t.index))
        : t.type & 3
          ? ((r = bg(r)),
            (o = s != null ? s(o, t.value || "", r) : o),
            i.setProperty(u, r, o))
          : t.type & 12;
}
function _g(e, t) {
    let n = ke(t, e);
    n[m] & 16 || (n[m] |= 64);
}
function Ds(e, t, n, r) {
    if (Ku()) {
        let o = r === null ? null : { "": -1 },
            i = Ng(e, n),
            s,
            a;
        i === null ? (s = a = null) : ([s, a] = i),
            s !== null && Zc(e, t, n, s, o, a),
            o && Ag(n, r, o);
    }
    n.mergedAttrs = Zt(n.mergedAttrs, n.attrs);
}
function Zc(e, t, n, r, o, i) {
    for (let c = 0; c < r.length; c++) zo(lr(n, t), e, r[c].type);
    Fg(n, e.data.length, r.length);
    for (let c = 0; c < r.length; c++) {
        let l = r[c];
        l.providersResolver && l.providersResolver(l);
    }
    let s = !1,
        a = !1,
        u = qc(e, t, r.length, null);
    for (let c = 0; c < r.length; c++) {
        let l = r[c];
        (n.mergedAttrs = Zt(n.mergedAttrs, l.hostAttrs)),
            Rg(e, n, t, u, l),
            Og(u, l, o),
            l.contentQueries !== null && (n.flags |= 4),
            (l.hostBindings !== null ||
                l.hostAttrs !== null ||
                l.hostVars !== 0) &&
                (n.flags |= 64);
        let d = l.type.prototype;
        !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
            !a &&
                (d.ngOnChanges || d.ngDoCheck) &&
                ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
            u++;
    }
    Cg(e, n, i);
}
function Mg(e, t, n, r, o) {
    let i = o.hostBindings;
    if (i) {
        let s = e.hostBindingOpCodes;
        s === null && (s = e.hostBindingOpCodes = []);
        let a = ~t.index;
        xg(s) != a && s.push(a), s.push(n, r, i);
    }
}
function xg(e) {
    let t = e.length;
    for (; t > 0; ) {
        let n = e[--t];
        if (typeof n == "number" && n < 0) return n;
    }
    return 0;
}
function Sg(e, t, n, r) {
    let o = n.directiveStart,
        i = n.directiveEnd;
    Nr(n) && Pg(t, n, e.data[o + n.componentOffset]),
        e.firstCreatePass || lr(n, t),
        Re(r, t);
    let s = n.initialInputs;
    for (let a = o; a < i; a++) {
        let u = e.data[a],
            c = tt(t, e, a, n);
        if ((Re(c, t), s !== null && jg(t, a - o, c, u, n, s), Oe(u))) {
            let l = ke(n.index, t);
            l[J] = tt(t, e, a, n);
        }
    }
}
function Kc(e, t, n) {
    let r = n.directiveStart,
        o = n.directiveEnd,
        i = n.index,
        s = Vp();
    try {
        Xe(i);
        for (let a = r; a < o; a++) {
            let u = e.data[a],
                c = t[a];
            Uo(a),
                (u.hostBindings !== null ||
                    u.hostVars !== 0 ||
                    u.hostAttrs !== null) &&
                    Tg(u, c);
        }
    } finally {
        Xe(-1), Uo(s);
    }
}
function Tg(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t);
}
function Ng(e, t) {
    let n = e.directiveRegistry,
        r = null,
        o = null;
    if (n)
        for (let i = 0; i < n.length; i++) {
            let s = n[i];
            if (xu(t, s.selectors, !1))
                if ((r || (r = []), Oe(s)))
                    if (s.findHostDirectiveDefs !== null) {
                        let a = [];
                        (o = o || new Map()),
                            s.findHostDirectiveDefs(s, a, o),
                            r.unshift(...a, s);
                        let u = a.length;
                        si(e, t, u);
                    } else r.unshift(s), si(e, t, 0);
                else
                    (o = o || new Map()),
                        s.findHostDirectiveDefs?.(s, r, o),
                        r.push(s);
        }
    return r === null ? null : [r, o];
}
function si(e, t, n) {
    (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function Ag(e, t, n) {
    if (t) {
        let r = (e.localNames = []);
        for (let o = 0; o < t.length; o += 2) {
            let i = n[t[o + 1]];
            if (i == null) throw new _(-301, !1);
            r.push(t[o], i);
        }
    }
}
function Og(e, t, n) {
    if (n) {
        if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
        Oe(t) && (n[""] = e);
    }
}
function Fg(e, t, n) {
    (e.flags |= 1),
        (e.directiveStart = t),
        (e.directiveEnd = t + n),
        (e.providerIndexes = t);
}
function Rg(e, t, n, r, o) {
    e.data[r] = o;
    let i = o.factory || (o.factory = St(o.type, !0)),
        s = new et(i, Oe(o), _e);
    (e.blueprint[r] = s), (n[r] = s), Mg(e, t, r, qc(e, n, o.hostVars, ge), o);
}
function Pg(e, t, n) {
    let r = X(t, e),
        o = Qc(n),
        i = e[ae].rendererFactory,
        s = 16;
    n.signals ? (s = 4096) : n.onPush && (s = 64);
    let a = $r(
        e,
        Br(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null)
    );
    e[t.index] = a;
}
function kg(e, t, n, r, o, i) {
    let s = X(e, t);
    Lg(t[F], s, i, e.value, n, r, o);
}
function Lg(e, t, n, r, o, i, s) {
    if (i == null) e.removeAttribute(t, o, n);
    else {
        let a = s == null ? xr(i) : s(i, r || "", o);
        e.setAttribute(t, o, a, n);
    }
}
function jg(e, t, n, r, o, i) {
    let s = i[t];
    if (s !== null)
        for (let a = 0; a < s.length; ) {
            let u = s[a++],
                c = s[a++],
                l = s[a++],
                d = s[a++];
            Wc(r, n, u, c, l, d);
        }
}
function Vg(e, t, n) {
    let r = null,
        o = 0;
    for (; o < n.length; ) {
        let i = n[o];
        if (i === 0) {
            o += 4;
            continue;
        } else if (i === 5) {
            o += 2;
            continue;
        }
        if (typeof i == "number") break;
        if (e.hasOwnProperty(i)) {
            r === null && (r = []);
            let s = e[i];
            for (let a = 0; a < s.length; a += 3)
                if (s[a] === t) {
                    r.push(i, s[a + 1], s[a + 2], n[o + 1]);
                    break;
                }
        }
        o += 2;
    }
    return r;
}
function Jc(e, t, n, r) {
    return [e, !0, 0, t, null, r, null, n, null, null];
}
function Xc(e, t) {
    let n = e.contentQueries;
    if (n !== null) {
        let r = M(null);
        try {
            for (let o = 0; o < n.length; o += 2) {
                let i = n[o],
                    s = n[o + 1];
                if (s !== -1) {
                    let a = e.data[s];
                    ns(i), a.contentQueries(2, t[s], s);
                }
            }
        } finally {
            M(r);
        }
    }
}
function $r(e, t) {
    return e[en] ? (e[Ra][se] = t) : (e[en] = t), (e[Ra] = t), t;
}
function ai(e, t, n) {
    ns(0);
    let r = M(null);
    try {
        t(e, n);
    } finally {
        M(r);
    }
}
function el(e) {
    return e[Xt] || (e[Xt] = []);
}
function tl(e) {
    return e.cleanup || (e.cleanup = []);
}
function nl(e, t) {
    let n = e[At],
        r = n ? n.get(Fe, null) : null;
    r && r.handleError(t);
}
function vs(e, t, n, r, o) {
    for (let i = 0; i < n.length; ) {
        let s = n[i++],
            a = n[i++],
            u = n[i++],
            c = t[s],
            l = e.data[s];
        Wc(l, c, r, a, u, o);
    }
}
function Bg(e, t, n) {
    let r = Yu(t, e);
    Zh(e[F], r, n);
}
function $g(e, t) {
    let n = ke(t, e),
        r = n[v];
    Hg(r, n);
    let o = n[Ee];
    o !== null && n[Jt] === null && (n[Jt] = as(o, n[At])), Is(r, n, n[J]);
}
function Hg(e, t) {
    for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Is(e, t, n) {
    rs(t);
    try {
        let r = e.viewQuery;
        r !== null && ai(1, r, n);
        let o = e.template;
        o !== null && Yc(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            t[Ie]?.finishViewCreation(e),
            e.staticContentQueries && Xc(e, t),
            e.staticViewQueries && ai(2, e.viewQuery, n);
        let i = e.components;
        i !== null && Ug(t, i);
    } catch (r) {
        throw (
            (e.firstCreatePass &&
                ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
        );
    } finally {
        (t[m] &= -5), os();
    }
}
function Ug(e, t) {
    for (let n = 0; n < t.length; n++) $g(e, t[n]);
}
function rl(e, t, n, r) {
    let o = M(null);
    try {
        let i = t.tView,
            a = e[m] & 4096 ? 4096 : 16,
            u = Br(
                e,
                i,
                n,
                a,
                null,
                t,
                null,
                null,
                r?.injector ?? null,
                r?.embeddedViewInjector ?? null,
                r?.dehydratedView ?? null
            ),
            c = e[t.index];
        u[an] = c;
        let l = e[Ie];
        return l !== null && (u[Ie] = l.createEmbeddedView(i)), Is(i, u, n), u;
    } finally {
        M(o);
    }
}
function Gg(e, t) {
    let n = W + t;
    if (n < e.length) return e[n];
}
function ui(e, t) {
    return !t || t.firstChild === null || Ic(e);
}
function ol(e, t, n, r = !0) {
    let o = t[v];
    if ((tg(o, t, e, n), r)) {
        let s = ii(n, e),
            a = t[F],
            u = ds(a, e[Je]);
        u !== null && Xh(o, e[Q], a, t, u, s);
    }
    let i = t[Jt];
    i !== null && i.firstChild !== null && (i.firstChild = null);
}
function zg(e, t) {
    let n = fr(e, t);
    return n !== void 0 && ls(n[v], n), n;
}
function hr(e, t, n, r, o = !1) {
    for (; n !== null; ) {
        let i = t[n.index];
        i !== null && r.push(he(i)), Ce(i) && Wg(i, r);
        let s = n.type;
        if (s & 8) hr(e, t, n.child, r);
        else if (s & 32) {
            let a = cs(n, t),
                u;
            for (; (u = a()); ) r.push(u);
        } else if (s & 16) {
            let a = $c(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
                let u = nn(t[ue]);
                hr(u[v], u, a, r, !0);
            }
        }
        n = o ? n.projectionNext : n.next;
    }
    return r;
}
function Wg(e, t) {
    for (let n = W; n < e.length; n++) {
        let r = e[n],
            o = r[v].firstChild;
        o !== null && hr(r[v], r, o, t);
    }
    e[Je] !== e[Ee] && t.push(e[Je]);
}
var il = [];
function qg(e) {
    return e[Ke] ?? Yg(e);
}
function Yg(e) {
    let t = il.pop() ?? Object.create(Zg);
    return (t.lView = e), t;
}
function Qg(e) {
    e.lView[Ke] !== e && ((e.lView = null), il.push(e));
}
var Zg = lt(xe({}, Yr), {
        consumerIsAlwaysLive: !0,
        consumerMarkedDirty: (e) => {
            tn(e.lView);
        },
        consumerOnSignalRead() {
            this.lView[Ke] = this;
        },
    }),
    sl = 100;
function al(e, t = !0, n = 0) {
    let r = e[ae],
        o = r.rendererFactory,
        i = !1;
    i || o.begin?.();
    try {
        Kg(e, n);
    } catch (s) {
        throw (t && nl(e, s), s);
    } finally {
        i || (o.end?.(), r.inlineEffectRunner?.flush());
    }
}
function Kg(e, t) {
    ci(e, t);
    let n = 0;
    for (; Xi(e); ) {
        if (n === sl) throw new _(103, !1);
        n++, ci(e, 1);
    }
}
function Jg(e, t, n, r) {
    let o = t[m];
    if ((o & 256) === 256) return;
    let i = !1;
    !i && t[ae].inlineEffectRunner?.flush(), rs(t);
    let s = null,
        a = null;
    !i && Xg(e) && ((a = qg(t)), (s = Qr(a)));
    try {
        Qu(t), kp(e.bindingStartIndex), n !== null && Yc(e, t, n, 2, r);
        let u = (o & 3) === 3;
        if (!i)
            if (u) {
                let d = e.preOrderCheckHooks;
                d !== null && Kn(t, d, null);
            } else {
                let d = e.preOrderHooks;
                d !== null && Jn(t, d, 0, null), Eo(t, 0);
            }
        if ((em(t), ul(t, 0), e.contentQueries !== null && Xc(e, t), !i))
            if (u) {
                let d = e.contentCheckHooks;
                d !== null && Kn(t, d);
            } else {
                let d = e.contentHooks;
                d !== null && Jn(t, d, 1), Eo(t, 1);
            }
        gg(e, t);
        let c = e.components;
        c !== null && ll(t, c, 0);
        let l = e.viewQuery;
        if ((l !== null && ai(2, l, r), !i))
            if (u) {
                let d = e.viewCheckHooks;
                d !== null && Kn(t, d);
            } else {
                let d = e.viewHooks;
                d !== null && Jn(t, d, 2), Eo(t, 2);
            }
        if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Zn])) {
            for (let d of t[Zn]) d();
            t[Zn] = null;
        }
        i || (t[m] &= -73);
    } catch (u) {
        throw (tn(t), u);
    } finally {
        a !== null && (Zr(a, s), Qg(a)), os();
    }
}
function Xg(e) {
    return e.type !== 2;
}
function ul(e, t) {
    for (let n = Ec(e); n !== null; n = Cc(n))
        for (let r = W; r < n.length; r++) {
            let o = n[r];
            cl(o, t);
        }
}
function em(e) {
    for (let t = Ec(e); t !== null; t = Cc(t)) {
        if (!(t[m] & Qi.HasTransplantedViews)) continue;
        let n = t[Ot];
        for (let r = 0; r < n.length; r++) {
            let o = n[r],
                i = o[j];
            _p(o);
        }
    }
}
function tm(e, t, n) {
    let r = ke(t, e);
    cl(r, n);
}
function cl(e, t) {
    Ji(e) && ci(e, t);
}
function ci(e, t) {
    let r = e[v],
        o = e[m],
        i = e[Ke],
        s = !!(t === 0 && o & 16);
    if (
        ((s ||= !!(o & 64 && t === 0)),
        (s ||= !!(o & 1024)),
        (s ||= !!(i?.dirty && mn(i))),
        i && (i.dirty = !1),
        (e[m] &= -9217),
        s)
    )
        Jg(r, e, r.template, e[J]);
    else if (o & 8192) {
        ul(e, 1);
        let a = r.components;
        a !== null && ll(e, a, 1);
    }
}
function ll(e, t, n) {
    for (let r = 0; r < t.length; r++) tm(e, t[r], n);
}
function ws(e) {
    for (e[ae].changeDetectionScheduler?.notify(); e; ) {
        e[m] |= 64;
        let t = nn(e);
        if (gp(e) && !t) return e;
        e = t;
    }
    return null;
}
var nt = class {
        get rootNodes() {
            let t = this._lView,
                n = t[v];
            return hr(n, t, n.firstChild, []);
        }
        constructor(t, n, r = !0) {
            (this._lView = t),
                (this._cdRefInjectingView = n),
                (this.notifyErrorHandler = r),
                (this._appRef = null),
                (this._attachedToViewContainer = !1);
        }
        get context() {
            return this._lView[J];
        }
        set context(t) {
            this._lView[J] = t;
        }
        get destroyed() {
            return (this._lView[m] & 256) === 256;
        }
        destroy() {
            if (this._appRef) this._appRef.detachView(this);
            else if (this._attachedToViewContainer) {
                let t = this._lView[j];
                if (Ce(t)) {
                    let n = t[ar],
                        r = n ? n.indexOf(this) : -1;
                    r > -1 && (fr(t, r), or(n, r));
                }
                this._attachedToViewContainer = !1;
            }
            ls(this._lView[v], this._lView);
        }
        onDestroy(t) {
            Zu(this._lView, t);
        }
        markForCheck() {
            ws(this._cdRefInjectingView || this._lView);
        }
        detach() {
            this._lView[m] &= -129;
        }
        reattach() {
            Ho(this._lView), (this._lView[m] |= 128);
        }
        detectChanges() {
            (this._lView[m] |= 1024), al(this._lView, this.notifyErrorHandler);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
            if (this._appRef) throw new _(902, !1);
            this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
            (this._appRef = null), kc(this._lView[v], this._lView);
        }
        attachToAppRef(t) {
            if (this._attachedToViewContainer) throw new _(902, !1);
            (this._appRef = t), Ho(this._lView);
        }
    },
    rt = (() => {
        let t = class t {};
        t.__NG_ELEMENT_ID__ = om;
        let e = t;
        return e;
    })(),
    nm = rt,
    rm = class extends nm {
        constructor(t, n, r) {
            super(),
                (this._declarationLView = t),
                (this._declarationTContainer = n),
                (this.elementRef = r);
        }
        get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null;
        }
        createEmbeddedView(t, n) {
            return this.createEmbeddedViewImpl(t, n);
        }
        createEmbeddedViewImpl(t, n, r) {
            let o = rl(this._declarationLView, this._declarationTContainer, t, {
                embeddedViewInjector: n,
                dehydratedView: r,
            });
            return new nt(o);
        }
    };
function om() {
    return Hr(V(), E());
}
function Hr(e, t) {
    return e.type & 4 ? new rm(t, e, Lt(e, t)) : null;
}
var tM = new RegExp(`^(\\d+)*(${Dh}|${yh})*(.*)`);
var im = () => null;
function li(e, t) {
    return im(e, t);
}
var gr = class {},
    di = class {},
    mr = class {};
function sm(e) {
    let t = Error(`No component factory found for ${H(e)}.`);
    return (t[am] = e), t;
}
var am = "ngComponent";
var fi = class {
        resolveComponentFactory(t) {
            throw sm(t);
        }
    },
    Ur = (() => {
        let t = class t {};
        t.NULL = new fi();
        let e = t;
        return e;
    })(),
    pi = class {},
    dl = (() => {
        let t = class t {
            constructor() {
                this.destroyNode = null;
            }
        };
        t.__NG_ELEMENT_ID__ = () => um();
        let e = t;
        return e;
    })();
function um() {
    let e = E(),
        t = V(),
        n = ke(t.index, e);
    return (Ye(n) ? n : e)[F];
}
var cm = (() => {
        let t = class t {};
        t.ɵprov = O({ token: t, providedIn: "root", factory: () => null });
        let e = t;
        return e;
    })(),
    xo = {};
var Ka = new Set();
function dn(e) {
    Ka.has(e) ||
        (Ka.add(e),
        performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
function Ja(...e) {}
function lm() {
    let e = typeof ve.requestAnimationFrame == "function",
        t = ve[e ? "requestAnimationFrame" : "setTimeout"],
        n = ve[e ? "cancelAnimationFrame" : "clearTimeout"];
    if (typeof Zone < "u" && t && n) {
        let r = t[Zone.__symbol__("OriginalDelegate")];
        r && (t = r);
        let o = n[Zone.__symbol__("OriginalDelegate")];
        o && (n = o);
    }
    return { nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: n };
}
var q = class e {
        constructor({
            enableLongStackTrace: t = !1,
            shouldCoalesceEventChangeDetection: n = !1,
            shouldCoalesceRunChangeDetection: r = !1,
        }) {
            if (
                ((this.hasPendingMacrotasks = !1),
                (this.hasPendingMicrotasks = !1),
                (this.isStable = !0),
                (this.onUnstable = new ie(!1)),
                (this.onMicrotaskEmpty = new ie(!1)),
                (this.onStable = new ie(!1)),
                (this.onError = new ie(!1)),
                typeof Zone > "u")
            )
                throw new _(908, !1);
            Zone.assertZonePatched();
            let o = this;
            (o._nesting = 0),
                (o._outer = o._inner = Zone.current),
                Zone.TaskTrackingZoneSpec &&
                    (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
                t &&
                    Zone.longStackTraceZoneSpec &&
                    (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
                (o.shouldCoalesceEventChangeDetection = !r && n),
                (o.shouldCoalesceRunChangeDetection = r),
                (o.lastRequestAnimationFrameId = -1),
                (o.nativeRequestAnimationFrame =
                    lm().nativeRequestAnimationFrame),
                pm(o);
        }
        static isInAngularZone() {
            return (
                typeof Zone < "u" && Zone.current.get("isAngularZone") === !0
            );
        }
        static assertInAngularZone() {
            if (!e.isInAngularZone()) throw new _(909, !1);
        }
        static assertNotInAngularZone() {
            if (e.isInAngularZone()) throw new _(909, !1);
        }
        run(t, n, r) {
            return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
            let i = this._inner,
                s = i.scheduleEventTask("NgZoneEvent: " + o, t, dm, Ja, Ja);
            try {
                return i.runTask(s, n, r);
            } finally {
                i.cancelTask(s);
            }
        }
        runGuarded(t, n, r) {
            return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
            return this._outer.run(t);
        }
    },
    dm = {};
function Es(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
        try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
        } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
                try {
                    e.runOutsideAngular(() => e.onStable.emit(null));
                } finally {
                    e.isStable = !0;
                }
        }
}
function fm(e) {
    e.isCheckStableRunning ||
        e.lastRequestAnimationFrameId !== -1 ||
        ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(
            ve,
            () => {
                e.fakeTopEventTask ||
                    (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                        "fakeTopEventTask",
                        () => {
                            (e.lastRequestAnimationFrameId = -1),
                                hi(e),
                                (e.isCheckStableRunning = !0),
                                Es(e),
                                (e.isCheckStableRunning = !1);
                        },
                        void 0,
                        () => {},
                        () => {}
                    )),
                    e.fakeTopEventTask.invoke();
            }
        )),
        hi(e));
}
function pm(e) {
    let t = () => {
        fm(e);
    };
    e._inner = e._inner.fork({
        name: "angular",
        properties: { isAngularZone: !0 },
        onInvokeTask: (n, r, o, i, s, a) => {
            if (hm(a)) return n.invokeTask(o, i, s, a);
            try {
                return Xa(e), n.invokeTask(o, i, s, a);
            } finally {
                ((e.shouldCoalesceEventChangeDetection &&
                    i.type === "eventTask") ||
                    e.shouldCoalesceRunChangeDetection) &&
                    t(),
                    eu(e);
            }
        },
        onInvoke: (n, r, o, i, s, a, u) => {
            try {
                return Xa(e), n.invoke(o, i, s, a, u);
            } finally {
                e.shouldCoalesceRunChangeDetection && t(), eu(e);
            }
        },
        onHasTask: (n, r, o, i) => {
            n.hasTask(o, i),
                r === o &&
                    (i.change == "microTask"
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          hi(e),
                          Es(e))
                        : i.change == "macroTask" &&
                          (e.hasPendingMacrotasks = i.macroTask));
        },
        onHandleError: (n, r, o, i) => (
            n.handleError(o, i),
            e.runOutsideAngular(() => e.onError.emit(i)),
            !1
        ),
    });
}
function hi(e) {
    e._hasPendingMicrotasks ||
    ((e.shouldCoalesceEventChangeDetection ||
        e.shouldCoalesceRunChangeDetection) &&
        e.lastRequestAnimationFrameId !== -1)
        ? (e.hasPendingMicrotasks = !0)
        : (e.hasPendingMicrotasks = !1);
}
function Xa(e) {
    e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function eu(e) {
    e._nesting--, Es(e);
}
var gi = class {
    constructor() {
        (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new ie()),
            (this.onMicrotaskEmpty = new ie()),
            (this.onStable = new ie()),
            (this.onError = new ie());
    }
    run(t, n, r) {
        return t.apply(n, r);
    }
    runGuarded(t, n, r) {
        return t.apply(n, r);
    }
    runOutsideAngular(t) {
        return t();
    }
    runTask(t, n, r, o) {
        return t.apply(n, r);
    }
};
function hm(e) {
    return !Array.isArray(e) || e.length !== 1
        ? !1
        : e[0].data?.__ignore_ng_zone__ === !0;
}
function gm(e = "zone.js", t) {
    return e === "noop" ? new gi() : e === "zone.js" ? new q(t) : e;
}
var _t = (function (e) {
        return (
            (e[(e.EarlyRead = 0)] = "EarlyRead"),
            (e[(e.Write = 1)] = "Write"),
            (e[(e.MixedReadWrite = 2)] = "MixedReadWrite"),
            (e[(e.Read = 3)] = "Read"),
            e
        );
    })(_t || {}),
    mm = { destroy() {} };
function ym(e, t) {
    !t && Vu(ym);
    let n = t?.injector ?? S(Le);
    if (!qh(n)) return mm;
    dn("NgAfterNextRender");
    let r = n.get(Cs),
        o = (r.handler ??= new yi()),
        i = t?.phase ?? _t.MixedReadWrite,
        s = () => {
            o.unregister(u), a();
        },
        a = n.get(kr).onDestroy(s),
        u = fp(
            n,
            () =>
                new mi(i, () => {
                    s(), e();
                })
        );
    return o.register(u), { destroy: s };
}
var mi = class {
        constructor(t, n) {
            (this.phase = t),
                (this.callbackFn = n),
                (this.zone = S(q)),
                (this.errorHandler = S(Fe, { optional: !0 })),
                S(gr, { optional: !0 })?.notify(1);
        }
        invoke() {
            try {
                this.zone.runOutsideAngular(this.callbackFn);
            } catch (t) {
                this.errorHandler?.handleError(t);
            }
        }
    },
    yi = class {
        constructor() {
            (this.executingCallbacks = !1),
                (this.buckets = {
                    [_t.EarlyRead]: new Set(),
                    [_t.Write]: new Set(),
                    [_t.MixedReadWrite]: new Set(),
                    [_t.Read]: new Set(),
                }),
                (this.deferredCallbacks = new Set());
        }
        register(t) {
            (this.executingCallbacks
                ? this.deferredCallbacks
                : this.buckets[t.phase]
            ).add(t);
        }
        unregister(t) {
            this.buckets[t.phase].delete(t), this.deferredCallbacks.delete(t);
        }
        execute() {
            this.executingCallbacks = !0;
            for (let t of Object.values(this.buckets))
                for (let n of t) n.invoke();
            this.executingCallbacks = !1;
            for (let t of this.deferredCallbacks) this.buckets[t.phase].add(t);
            this.deferredCallbacks.clear();
        }
        destroy() {
            for (let t of Object.values(this.buckets)) t.clear();
            this.deferredCallbacks.clear();
        }
    },
    Cs = (() => {
        let t = class t {
            constructor() {
                (this.handler = null), (this.internalCallbacks = []);
            }
            execute() {
                this.executeInternalCallbacks(), this.handler?.execute();
            }
            executeInternalCallbacks() {
                let r = [...this.internalCallbacks];
                this.internalCallbacks.length = 0;
                for (let o of r) o();
            }
            ngOnDestroy() {
                this.handler?.destroy(),
                    (this.handler = null),
                    (this.internalCallbacks.length = 0);
            }
        };
        t.ɵprov = O({ token: t, providedIn: "root", factory: () => new t() });
        let e = t;
        return e;
    })();
function yr(e, t, n) {
    let r = n ? e.styles : null,
        o = n ? e.classes : null,
        i = 0;
    if (t !== null)
        for (let s = 0; s < t.length; s++) {
            let a = t[s];
            if (typeof a == "number") i = a;
            else if (i == 1) o = Fo(o, a);
            else if (i == 2) {
                let u = a,
                    c = t[++s];
                r = Fo(r, u + ": " + c + ";");
            }
        }
    n ? (e.styles = r) : (e.stylesWithoutHost = r),
        n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var Dr = class extends Ur {
    constructor(t) {
        super(), (this.ngModule = t);
    }
    resolveComponentFactory(t) {
        let n = Ne(t);
        return new Rt(n, this.ngModule);
    }
};
function tu(e) {
    let t = [];
    for (let n in e) {
        if (!e.hasOwnProperty(n)) continue;
        let r = e[n];
        r !== void 0 &&
            t.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n });
    }
    return t;
}
function Dm(e) {
    let t = e.toLowerCase();
    return t === "svg" ? qu : t === "math" ? vp : null;
}
var Di = class {
        constructor(t, n) {
            (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
            r = Sr(r);
            let o = this.injector.get(t, xo, r);
            return o !== xo || n === xo ? o : this.parentInjector.get(t, n, r);
        }
    },
    Rt = class extends mr {
        get inputs() {
            let t = this.componentDef,
                n = t.inputTransforms,
                r = tu(t.inputs);
            if (n !== null)
                for (let o of r)
                    n.hasOwnProperty(o.propName) &&
                        (o.transform = n[o.propName]);
            return r;
        }
        get outputs() {
            return tu(this.componentDef.outputs);
        }
        constructor(t, n) {
            super(),
                (this.componentDef = t),
                (this.ngModule = n),
                (this.componentType = t.type),
                (this.selector = Qf(t.selectors)),
                (this.ngContentSelectors = t.ngContentSelectors
                    ? t.ngContentSelectors
                    : []),
                (this.isBoundToModule = !!n);
        }
        create(t, n, r, o) {
            let i = M(null);
            try {
                o = o || this.ngModule;
                let s = o instanceof Ae ? o : o?.injector;
                s &&
                    this.componentDef.getStandaloneInjector !== null &&
                    (s = this.componentDef.getStandaloneInjector(s) || s);
                let a = s ? new Di(t, s) : t,
                    u = a.get(pi, null);
                if (u === null) throw new _(407, !1);
                let c = a.get(cm, null),
                    l = a.get(Cs, null),
                    d = a.get(gr, null),
                    f = {
                        rendererFactory: u,
                        sanitizer: c,
                        inlineEffectRunner: null,
                        afterRenderEventManager: l,
                        changeDetectionScheduler: d,
                    },
                    p = u.createRenderer(null, this.componentDef),
                    h = this.componentDef.selectors[0][0] || "div",
                    w = r
                        ? Dg(p, r, this.componentDef.encapsulation, a)
                        : Pc(p, h, Dm(h)),
                    k = 512;
                this.componentDef.signals
                    ? (k |= 4096)
                    : this.componentDef.onPush || (k |= 16);
                let N = null;
                w !== null && (N = as(w, a, !0));
                let Z = ms(
                        0,
                        null,
                        null,
                        1,
                        0,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ),
                    U = Br(null, Z, null, k, null, null, f, p, a, null, N);
                rs(U);
                let me, ut;
                try {
                    let ee = this.componentDef,
                        ct,
                        zr = null;
                    ee.findHostDirectiveDefs
                        ? ((ct = []),
                          (zr = new Map()),
                          ee.findHostDirectiveDefs(ee, ct, zr),
                          ct.push(ee))
                        : (ct = [ee]);
                    let Kl = vm(U, w),
                        Jl = Im(Kl, w, ee, ct, U, f, p);
                    (ut = Ki(Z, Y)),
                        w && Cm(p, ee, w, r),
                        n !== void 0 && bm(ut, this.ngContentSelectors, n),
                        (me = Em(Jl, ee, ct, zr, U, [_m])),
                        Is(Z, U, null);
                } finally {
                    os();
                }
                return new vi(this.componentType, me, Lt(ut, U), U, ut);
            } finally {
                M(i);
            }
        }
    },
    vi = class extends di {
        constructor(t, n, r, o, i) {
            super(),
                (this.location = r),
                (this._rootLView = o),
                (this._tNode = i),
                (this.previousInputValues = null),
                (this.instance = n),
                (this.hostView = this.changeDetectorRef =
                    new nt(o, void 0, !1)),
                (this.componentType = t);
        }
        setInput(t, n) {
            let r = this._tNode.inputs,
                o;
            if (r !== null && (o = r[t])) {
                if (
                    ((this.previousInputValues ??= new Map()),
                    this.previousInputValues.has(t) &&
                        Object.is(this.previousInputValues.get(t), n))
                )
                    return;
                let i = this._rootLView;
                vs(i[v], i, o, t, n), this.previousInputValues.set(t, n);
                let s = ke(this._tNode.index, i);
                ws(s);
            }
        }
        get injector() {
            return new Qe(this._tNode, this._rootLView);
        }
        destroy() {
            this.hostView.destroy();
        }
        onDestroy(t) {
            this.hostView.onDestroy(t);
        }
    };
function vm(e, t) {
    let n = e[v],
        r = Y;
    return (e[r] = t), Vt(n, r, 2, "#host", null);
}
function Im(e, t, n, r, o, i, s) {
    let a = o[v];
    wm(r, e, t, s);
    let u = null;
    t !== null && (u = as(t, o[At]));
    let c = i.rendererFactory.createRenderer(t, n),
        l = 16;
    n.signals ? (l = 4096) : n.onPush && (l = 64);
    let d = Br(o, Qc(n), null, l, o[e.index], e, i, c, null, null, u);
    return (
        a.firstCreatePass && si(a, e, r.length - 1), $r(o, d), (o[e.index] = d)
    );
}
function wm(e, t, n, r) {
    for (let o of e) t.mergedAttrs = Zt(t.mergedAttrs, o.hostAttrs);
    t.mergedAttrs !== null &&
        (yr(t, t.mergedAttrs, !0), n !== null && Gc(r, n, t));
}
function Em(e, t, n, r, o, i) {
    let s = V(),
        a = o[v],
        u = X(s, o);
    Zc(a, o, s, n, null, r);
    for (let l = 0; l < n.length; l++) {
        let d = s.directiveStart + l,
            f = tt(o, a, d, s);
        Re(f, o);
    }
    Kc(a, o, s), u && Re(u, o);
    let c = tt(o, a, s.directiveStart + s.componentOffset, s);
    if (((e[J] = o[J] = c), i !== null)) for (let l of i) l(c, t);
    return ps(a, s, o), c;
}
function Cm(e, t, n, r) {
    if (r) Lo(e, n, ["ng-version", "17.3.9"]);
    else {
        let { attrs: o, classes: i } = Zf(t.selectors[0]);
        o && Lo(e, n, o), i && i.length > 0 && Uc(e, n, i.join(" "));
    }
}
function bm(e, t, n) {
    let r = (e.projection = []);
    for (let o = 0; o < t.length; o++) {
        let i = n[o];
        r.push(i != null ? Array.from(i) : null);
    }
}
function _m() {
    let e = V();
    Pr(E()[v], e);
}
var Bt = (() => {
    let t = class t {};
    t.__NG_ELEMENT_ID__ = Mm;
    let e = t;
    return e;
})();
function Mm() {
    let e = V();
    return pl(e, E());
}
var xm = Bt,
    fl = class extends xm {
        constructor(t, n, r) {
            super(),
                (this._lContainer = t),
                (this._hostTNode = n),
                (this._hostLView = r);
        }
        get element() {
            return Lt(this._hostTNode, this._hostLView);
        }
        get injector() {
            return new Qe(this._hostTNode, this._hostLView);
        }
        get parentInjector() {
            let t = is(this._hostTNode, this._hostLView);
            if (cc(t)) {
                let n = cr(t, this._hostLView),
                    r = ur(t),
                    o = n[v].data[r + 8];
                return new Qe(o, n);
            } else return new Qe(null, this._hostLView);
        }
        clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
        }
        get(t) {
            let n = nu(this._lContainer);
            return (n !== null && n[t]) || null;
        }
        get length() {
            return this._lContainer.length - W;
        }
        createEmbeddedView(t, n, r) {
            let o, i;
            typeof r == "number"
                ? (o = r)
                : r != null && ((o = r.index), (i = r.injector));
            let s = li(this._lContainer, t.ssrId),
                a = t.createEmbeddedViewImpl(n || {}, i, s);
            return this.insertImpl(a, o, ui(this._hostTNode, s)), a;
        }
        createComponent(t, n, r, o, i) {
            let s = t && !hp(t),
                a;
            if (s) a = n;
            else {
                let h = n || {};
                (a = h.index),
                    (r = h.injector),
                    (o = h.projectableNodes),
                    (i = h.environmentInjector || h.ngModuleRef);
            }
            let u = s ? t : new Rt(Ne(t)),
                c = r || this.parentInjector;
            if (!i && u.ngModule == null) {
                let w = (s ? c : this.parentInjector).get(Ae, null);
                w && (i = w);
            }
            let l = Ne(u.componentType ?? {}),
                d = li(this._lContainer, l?.id ?? null),
                f = d?.firstChild ?? null,
                p = u.create(c, o, f, i);
            return this.insertImpl(p.hostView, a, ui(this._hostTNode, d)), p;
        }
        insert(t, n) {
            return this.insertImpl(t, n, !0);
        }
        insertImpl(t, n, r) {
            let o = t._lView;
            if (bp(o)) {
                let a = this.indexOf(t);
                if (a !== -1) this.detach(a);
                else {
                    let u = o[j],
                        c = new fl(u, u[Q], u[j]);
                    c.detach(c.indexOf(t));
                }
            }
            let i = this._adjustIndex(n),
                s = this._lContainer;
            return (
                ol(s, o, i, r), t.attachToViewContainerRef(), wu(So(s), i, t), t
            );
        }
        move(t, n) {
            return this.insert(t, n);
        }
        indexOf(t) {
            let n = nu(this._lContainer);
            return n !== null ? n.indexOf(t) : -1;
        }
        remove(t) {
            let n = this._adjustIndex(t, -1),
                r = fr(this._lContainer, n);
            r && (or(So(this._lContainer), n), ls(r[v], r));
        }
        detach(t) {
            let n = this._adjustIndex(t, -1),
                r = fr(this._lContainer, n);
            return r && or(So(this._lContainer), n) != null ? new nt(r) : null;
        }
        _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
        }
    };
function nu(e) {
    return e[ar];
}
function So(e) {
    return e[ar] || (e[ar] = []);
}
function pl(e, t) {
    let n,
        r = t[e.index];
    return (
        Ce(r) ? (n = r) : ((n = Jc(r, t, null, e)), (t[e.index] = n), $r(t, n)),
        Tm(n, t, e, r),
        new fl(n, e, t)
    );
}
function Sm(e, t) {
    let n = e[F],
        r = n.createComment(""),
        o = X(t, e),
        i = ds(n, o);
    return pr(n, i, r, ag(n, o), !1), r;
}
var Tm = Om,
    Nm = () => !1;
function Am(e, t, n) {
    return Nm(e, t, n);
}
function Om(e, t, n, r) {
    if (e[Je]) return;
    let o;
    n.type & 8 ? (o = he(r)) : (o = Sm(t, n)), (e[Je] = o);
}
var Ii = class e {
        constructor(t) {
            (this.queryList = t), (this.matches = null);
        }
        clone() {
            return new e(this.queryList);
        }
        setDirty() {
            this.queryList.setDirty();
        }
    },
    wi = class e {
        constructor(t = []) {
            this.queries = t;
        }
        createEmbeddedView(t) {
            let n = t.queries;
            if (n !== null) {
                let r =
                        t.contentQueries !== null
                            ? t.contentQueries[0]
                            : n.length,
                    o = [];
                for (let i = 0; i < r; i++) {
                    let s = n.getByIndex(i),
                        a = this.queries[s.indexInDeclarationView];
                    o.push(a.clone());
                }
                return new e(o);
            }
            return null;
        }
        insertView(t) {
            this.dirtyQueriesWithMatches(t);
        }
        detachView(t) {
            this.dirtyQueriesWithMatches(t);
        }
        finishViewCreation(t) {
            this.dirtyQueriesWithMatches(t);
        }
        dirtyQueriesWithMatches(t) {
            for (let n = 0; n < this.queries.length; n++)
                bs(t, n).matches !== null && this.queries[n].setDirty();
        }
    },
    vr = class {
        constructor(t, n, r = null) {
            (this.flags = n),
                (this.read = r),
                typeof t == "string"
                    ? (this.predicate = Bm(t))
                    : (this.predicate = t);
        }
    },
    Ei = class e {
        constructor(t = []) {
            this.queries = t;
        }
        elementStart(t, n) {
            for (let r = 0; r < this.queries.length; r++)
                this.queries[r].elementStart(t, n);
        }
        elementEnd(t) {
            for (let n = 0; n < this.queries.length; n++)
                this.queries[n].elementEnd(t);
        }
        embeddedTView(t) {
            let n = null;
            for (let r = 0; r < this.length; r++) {
                let o = n !== null ? n.length : 0,
                    i = this.getByIndex(r).embeddedTView(t, o);
                i &&
                    ((i.indexInDeclarationView = r),
                    n !== null ? n.push(i) : (n = [i]));
            }
            return n !== null ? new e(n) : null;
        }
        template(t, n) {
            for (let r = 0; r < this.queries.length; r++)
                this.queries[r].template(t, n);
        }
        getByIndex(t) {
            return this.queries[t];
        }
        get length() {
            return this.queries.length;
        }
        track(t) {
            this.queries.push(t);
        }
    },
    Ci = class e {
        constructor(t, n = -1) {
            (this.metadata = t),
                (this.matches = null),
                (this.indexInDeclarationView = -1),
                (this.crossesNgTemplate = !1),
                (this._appliesToNextNode = !0),
                (this._declarationNodeIndex = n);
        }
        elementStart(t, n) {
            this.isApplyingToNode(n) && this.matchTNode(t, n);
        }
        elementEnd(t) {
            this._declarationNodeIndex === t.index &&
                (this._appliesToNextNode = !1);
        }
        template(t, n) {
            this.elementStart(t, n);
        }
        embeddedTView(t, n) {
            return this.isApplyingToNode(t)
                ? ((this.crossesNgTemplate = !0),
                  this.addMatch(-t.index, n),
                  new e(this.metadata))
                : null;
        }
        isApplyingToNode(t) {
            if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
                let n = this._declarationNodeIndex,
                    r = t.parent;
                for (; r !== null && r.type & 8 && r.index !== n; )
                    r = r.parent;
                return n === (r !== null ? r.index : -1);
            }
            return this._appliesToNextNode;
        }
        matchTNode(t, n) {
            let r = this.metadata.predicate;
            if (Array.isArray(r))
                for (let o = 0; o < r.length; o++) {
                    let i = r[o];
                    this.matchTNodeWithReadOption(t, n, Fm(n, i)),
                        this.matchTNodeWithReadOption(
                            t,
                            n,
                            Xn(n, t, i, !1, !1)
                        );
                }
            else
                r === rt
                    ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1)
                    : this.matchTNodeWithReadOption(t, n, Xn(n, t, r, !1, !1));
        }
        matchTNodeWithReadOption(t, n, r) {
            if (r !== null) {
                let o = this.metadata.read;
                if (o !== null)
                    if (o === jt || o === Bt || (o === rt && n.type & 4))
                        this.addMatch(n.index, -2);
                    else {
                        let i = Xn(n, t, o, !1, !1);
                        i !== null && this.addMatch(n.index, i);
                    }
                else this.addMatch(n.index, r);
            }
        }
        addMatch(t, n) {
            this.matches === null
                ? (this.matches = [t, n])
                : this.matches.push(t, n);
        }
    };
function Fm(e, t) {
    let n = e.localNames;
    if (n !== null) {
        for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
    }
    return null;
}
function Rm(e, t) {
    return e.type & 11 ? Lt(e, t) : e.type & 4 ? Hr(e, t) : null;
}
function Pm(e, t, n, r) {
    return n === -1 ? Rm(t, e) : n === -2 ? km(e, t, r) : tt(e, e[v], n, t);
}
function km(e, t, n) {
    if (n === jt) return Lt(t, e);
    if (n === rt) return Hr(t, e);
    if (n === Bt) return pl(t, e);
}
function hl(e, t, n, r) {
    let o = t[Ie].queries[r];
    if (o.matches === null) {
        let i = e.data,
            s = n.matches,
            a = [];
        for (let u = 0; s !== null && u < s.length; u += 2) {
            let c = s[u];
            if (c < 0) a.push(null);
            else {
                let l = i[c];
                a.push(Pm(t, l, s[u + 1], n.metadata.read));
            }
        }
        o.matches = a;
    }
    return o.matches;
}
function bi(e, t, n, r) {
    let o = e.queries.getByIndex(n),
        i = o.matches;
    if (i !== null) {
        let s = hl(e, t, o, n);
        for (let a = 0; a < i.length; a += 2) {
            let u = i[a];
            if (u > 0) r.push(s[a / 2]);
            else {
                let c = i[a + 1],
                    l = t[-u];
                for (let d = W; d < l.length; d++) {
                    let f = l[d];
                    f[an] === f[j] && bi(f[v], f, c, r);
                }
                if (l[Ot] !== null) {
                    let d = l[Ot];
                    for (let f = 0; f < d.length; f++) {
                        let p = d[f];
                        bi(p[v], p, c, r);
                    }
                }
            }
        }
    }
    return r;
}
function Lm(e, t) {
    return e[Ie].queries[t].queryList;
}
function gl(e, t, n) {
    let r = new Qo((n & 4) === 4);
    return (
        wg(e, t, r, r.destroy), (t[Ie] ??= new wi()).queries.push(new Ii(r)) - 1
    );
}
function jm(e, t, n) {
    let r = P();
    return (
        r.firstCreatePass &&
            (ml(r, new vr(e, t, n), -1),
            (t & 2) === 2 && (r.staticViewQueries = !0)),
        gl(r, E(), t)
    );
}
function Vm(e, t, n, r) {
    let o = P();
    if (o.firstCreatePass) {
        let i = V();
        ml(o, new vr(t, n, r), i.index),
            $m(o, e),
            (n & 2) === 2 && (o.staticContentQueries = !0);
    }
    return gl(o, E(), n);
}
function Bm(e) {
    return e.split(",").map((t) => t.trim());
}
function ml(e, t, n) {
    e.queries === null && (e.queries = new Ei()), e.queries.track(new Ci(t, n));
}
function $m(e, t) {
    let n = e.contentQueries || (e.contentQueries = []),
        r = n.length ? n[n.length - 1] : -1;
    t !== r && n.push(e.queries.length - 1, t);
}
function bs(e, t) {
    return e.queries.getByIndex(t);
}
function Hm(e, t) {
    let n = e[v],
        r = bs(n, t);
    return r.crossesNgTemplate ? bi(n, e, t, []) : hl(n, e, r, t);
}
function Um(e) {
    return typeof e == "function" && e[gn] !== void 0;
}
function yl(e) {
    return Um(e) && typeof e.set == "function";
}
function Gm(e) {
    let t = [],
        n = new Map();
    function r(o) {
        let i = n.get(o);
        if (!i) {
            let s = e(o);
            n.set(o, (i = s.then(Ym)));
        }
        return i;
    }
    return (
        Ir.forEach((o, i) => {
            let s = [];
            o.templateUrl &&
                s.push(
                    r(o.templateUrl).then((c) => {
                        o.template = c;
                    })
                );
            let a = typeof o.styles == "string" ? [o.styles] : o.styles || [];
            if (((o.styles = a), o.styleUrl && o.styleUrls?.length))
                throw new Error(
                    "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
                );
            if (o.styleUrls?.length) {
                let c = o.styles.length,
                    l = o.styleUrls;
                o.styleUrls.forEach((d, f) => {
                    a.push(""),
                        s.push(
                            r(d).then((p) => {
                                (a[c + f] = p),
                                    l.splice(l.indexOf(d), 1),
                                    l.length == 0 && (o.styleUrls = void 0);
                            })
                        );
                });
            } else
                o.styleUrl &&
                    s.push(
                        r(o.styleUrl).then((c) => {
                            a.push(c), (o.styleUrl = void 0);
                        })
                    );
            let u = Promise.all(s).then(() => Qm(i));
            t.push(u);
        }),
        Wm(),
        Promise.all(t).then(() => {})
    );
}
var Ir = new Map(),
    zm = new Set();
function Wm() {
    let e = Ir;
    return (Ir = new Map()), e;
}
function qm() {
    return Ir.size === 0;
}
function Ym(e) {
    return typeof e == "string" ? e : e.text();
}
function Qm(e) {
    zm.delete(e);
}
function Zm(e) {
    return Object.getPrototypeOf(e.prototype).constructor;
}
function Km(e) {
    let t = Zm(e.type),
        n = !0,
        r = [e];
    for (; t; ) {
        let o;
        if (Oe(e)) o = t.ɵcmp || t.ɵdir;
        else {
            if (t.ɵcmp) throw new _(903, !1);
            o = t.ɵdir;
        }
        if (o) {
            if (n) {
                r.push(o);
                let s = e;
                (s.inputs = Wn(e.inputs)),
                    (s.inputTransforms = Wn(e.inputTransforms)),
                    (s.declaredInputs = Wn(e.declaredInputs)),
                    (s.outputs = Wn(e.outputs));
                let a = o.hostBindings;
                a && ny(e, a);
                let u = o.viewQuery,
                    c = o.contentQueries;
                if (
                    (u && ey(e, u),
                    c && ty(e, c),
                    Jm(e, o),
                    ff(e.outputs, o.outputs),
                    Oe(o) && o.data.animation)
                ) {
                    let l = e.data;
                    l.animation = (l.animation || []).concat(o.data.animation);
                }
            }
            let i = o.features;
            if (i)
                for (let s = 0; s < i.length; s++) {
                    let a = i[s];
                    a && a.ngInherit && a(e), a === Km && (n = !1);
                }
        }
        t = Object.getPrototypeOf(t);
    }
    Xm(r);
}
function Jm(e, t) {
    for (let n in t.inputs) {
        if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
        let r = t.inputs[n];
        if (
            r !== void 0 &&
            ((e.inputs[n] = r),
            (e.declaredInputs[n] = t.declaredInputs[n]),
            t.inputTransforms !== null)
        ) {
            let o = Array.isArray(r) ? r[0] : r;
            if (!t.inputTransforms.hasOwnProperty(o)) continue;
            (e.inputTransforms ??= {}),
                (e.inputTransforms[o] = t.inputTransforms[o]);
        }
    }
}
function Xm(e) {
    let t = 0,
        n = null;
    for (let r = e.length - 1; r >= 0; r--) {
        let o = e[r];
        (o.hostVars = t += o.hostVars),
            (o.hostAttrs = Zt(o.hostAttrs, (n = Zt(n, o.hostAttrs))));
    }
}
function Wn(e) {
    return e === Tt ? {} : e === z ? [] : e;
}
function ey(e, t) {
    let n = e.viewQuery;
    n
        ? (e.viewQuery = (r, o) => {
              t(r, o), n(r, o);
          })
        : (e.viewQuery = t);
}
function ty(e, t) {
    let n = e.contentQueries;
    n
        ? (e.contentQueries = (r, o, i) => {
              t(r, o, i), n(r, o, i);
          })
        : (e.contentQueries = t);
}
function ny(e, t) {
    let n = e.hostBindings;
    n
        ? (e.hostBindings = (r, o) => {
              t(r, o), n(r, o);
          })
        : (e.hostBindings = t);
}
function ry(e) {
    let t = e.inputConfig,
        n = {};
    for (let r in t)
        if (t.hasOwnProperty(r)) {
            let o = t[r];
            Array.isArray(o) && o[3] && (n[r] = o[3]);
        }
    e.inputTransforms = n;
}
var Pe = class {},
    _i = class {};
var wr = class extends Pe {
        constructor(t, n, r) {
            super(),
                (this._parent = n),
                (this._bootstrapComponents = []),
                (this.destroyCbs = []),
                (this.componentFactoryResolver = new Dr(this));
            let o = Nu(t);
            (this._bootstrapComponents = Rc(o.bootstrap)),
                (this._r3Injector = Dc(
                    t,
                    n,
                    [
                        { provide: Pe, useValue: this },
                        {
                            provide: Ur,
                            useValue: this.componentFactoryResolver,
                        },
                        ...r,
                    ],
                    H(t),
                    new Set(["environment"])
                )),
                this._r3Injector.resolveInjectorInitializers(),
                (this.instance = this._r3Injector.get(t));
        }
        get injector() {
            return this._r3Injector;
        }
        destroy() {
            let t = this._r3Injector;
            !t.destroyed && t.destroy(),
                this.destroyCbs.forEach((n) => n()),
                (this.destroyCbs = null);
        }
        onDestroy(t) {
            this.destroyCbs.push(t);
        }
    },
    Er = class extends _i {
        constructor(t) {
            super(), (this.moduleType = t);
        }
        create(t) {
            return new wr(this.moduleType, t, []);
        }
    };
function oy(e, t, n) {
    return new wr(e, t, n);
}
var Mi = class extends Pe {
    constructor(t) {
        super(),
            (this.componentFactoryResolver = new Dr(this)),
            (this.instance = null);
        let n = new Kt(
            [
                ...t.providers,
                { provide: Pe, useValue: this },
                { provide: Ur, useValue: this.componentFactoryResolver },
            ],
            t.parent || Yi(),
            t.debugName,
            new Set(["environment"])
        );
        (this.injector = n),
            t.runEnvironmentInitializers && n.resolveInjectorInitializers();
    }
    destroy() {
        this.injector.destroy();
    }
    onDestroy(t) {
        this.injector.onDestroy(t);
    }
};
function iy(e, t, n = null) {
    return new Mi({
        providers: e,
        parent: t,
        debugName: n,
        runEnvironmentInitializers: !0,
    }).injector;
}
var _s = (() => {
    let t = class t {
        constructor() {
            (this.taskId = 0),
                (this.pendingTasks = new Set()),
                (this.hasPendingTasks = new $t(!1));
        }
        get _hasPendingTasks() {
            return this.hasPendingTasks.value;
        }
        add() {
            this._hasPendingTasks || this.hasPendingTasks.next(!0);
            let r = this.taskId++;
            return this.pendingTasks.add(r), r;
        }
        remove(r) {
            this.pendingTasks.delete(r),
                this.pendingTasks.size === 0 &&
                    this._hasPendingTasks &&
                    this.hasPendingTasks.next(!1);
        }
        ngOnDestroy() {
            this.pendingTasks.clear(),
                this._hasPendingTasks && this.hasPendingTasks.next(!1);
        }
    };
    (t.ɵfac = function (o) {
        return new (o || t)();
    }),
        (t.ɵprov = O({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
})();
function Dl(e) {
    return ay(e)
        ? Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e)
        : !1;
}
function sy(e, t) {
    if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
    else {
        let n = e[Symbol.iterator](),
            r;
        for (; !(r = n.next()).done; ) t(r.value);
    }
}
function ay(e) {
    return e !== null && (typeof e == "function" || typeof e == "object");
}
function uy(e, t, n) {
    return (e[t] = n);
}
function je(e, t, n) {
    let r = e[t];
    return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function cy(e) {
    return (e.flags & 32) === 32;
}
function ly(e, t, n, r, o, i, s, a, u) {
    let c = t.consts,
        l = Vt(t, e, 4, s || null, Ft(c, a));
    Ds(t, n, l, Ft(c, u)), Pr(t, l);
    let d = (l.tView = ms(
        2,
        l,
        r,
        o,
        i,
        t.directiveRegistry,
        t.pipeRegistry,
        null,
        t.schemas,
        c,
        null
    ));
    return (
        t.queries !== null &&
            (t.queries.template(t, l),
            (d.queries = t.queries.embeddedTView(l))),
        l
    );
}
function dy(e, t, n, r, o, i, s, a) {
    let u = E(),
        c = P(),
        l = e + Y,
        d = c.firstCreatePass ? ly(l, c, u, t, n, r, o, i, s) : c.data[l];
    it(d, !1);
    let f = fy(c, u, d, e);
    Fr() && jr(c, u, f, d), Re(f, u);
    let p = Jc(f, u, f, d);
    return (
        (u[l] = p),
        $r(u, p),
        Am(p, d, u),
        Ar(d) && hs(c, u, d),
        s != null && gs(u, d, a),
        dy
    );
}
var fy = py;
function py(e, t, n, r) {
    return Rr(!0), t[F].createComment("");
}
function hy(e, t, n, r) {
    let o = E(),
        i = un();
    if (je(o, i, t)) {
        let s = P(),
            a = Or();
        kg(a, o, e, t, n, r);
    }
    return hy;
}
function vl(e, t, n, r) {
    return je(e, un(), n) ? t + xr(n) + r : ge;
}
function qn(e, t) {
    return (e << 17) | (t << 2);
}
function ot(e) {
    return (e >> 17) & 32767;
}
function gy(e) {
    return (e & 2) == 2;
}
function my(e, t) {
    return (e & 131071) | (t << 17);
}
function xi(e) {
    return e | 2;
}
function Pt(e) {
    return (e & 131068) >> 2;
}
function To(e, t) {
    return (e & -131069) | (t << 2);
}
function yy(e) {
    return (e & 1) === 1;
}
function Si(e) {
    return e | 1;
}
function Dy(e, t, n, r, o, i) {
    let s = i ? t.classBindings : t.styleBindings,
        a = ot(s),
        u = Pt(s);
    e[r] = n;
    let c = !1,
        l;
    if (Array.isArray(n)) {
        let d = n;
        (l = d[1]), (l === null || sn(d, l) > 0) && (c = !0);
    } else l = n;
    if (o)
        if (u !== 0) {
            let f = ot(e[a + 1]);
            (e[r + 1] = qn(f, a)),
                f !== 0 && (e[f + 1] = To(e[f + 1], r)),
                (e[a + 1] = my(e[a + 1], r));
        } else
            (e[r + 1] = qn(a, 0)),
                a !== 0 && (e[a + 1] = To(e[a + 1], r)),
                (a = r);
    else
        (e[r + 1] = qn(u, 0)),
            a === 0 ? (a = r) : (e[u + 1] = To(e[u + 1], r)),
            (u = r);
    c && (e[r + 1] = xi(e[r + 1])),
        ru(e, l, r, !0),
        ru(e, l, r, !1),
        vy(t, l, e, r, i),
        (s = qn(a, u)),
        i ? (t.classBindings = s) : (t.styleBindings = s);
}
function vy(e, t, n, r, o) {
    let i = o ? e.residualClasses : e.residualStyles;
    i != null &&
        typeof t == "string" &&
        sn(i, t) >= 0 &&
        (n[r + 1] = Si(n[r + 1]));
}
function ru(e, t, n, r) {
    let o = e[n + 1],
        i = t === null,
        s = r ? ot(o) : Pt(o),
        a = !1;
    for (; s !== 0 && (a === !1 || i); ) {
        let u = e[s],
            c = e[s + 1];
        Iy(u, t) && ((a = !0), (e[s + 1] = r ? Si(c) : xi(c))),
            (s = r ? ot(c) : Pt(c));
    }
    a && (e[n + 1] = r ? xi(o) : Si(o));
}
function Iy(e, t) {
    return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
        ? !0
        : Array.isArray(e) && typeof t == "string"
          ? sn(e, t) >= 0
          : !1;
}
var oe = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function wy(e) {
    return e.substring(oe.key, oe.keyEnd);
}
function Ey(e) {
    return Cy(e), Il(e, wl(e, 0, oe.textEnd));
}
function Il(e, t) {
    let n = oe.textEnd;
    return n === t
        ? -1
        : ((t = oe.keyEnd = by(e, (oe.key = t), n)), wl(e, t, n));
}
function Cy(e) {
    (oe.key = 0),
        (oe.keyEnd = 0),
        (oe.value = 0),
        (oe.valueEnd = 0),
        (oe.textEnd = e.length);
}
function wl(e, t, n) {
    for (; t < n && e.charCodeAt(t) <= 32; ) t++;
    return t;
}
function by(e, t, n) {
    for (; t < n && e.charCodeAt(t) > 32; ) t++;
    return t;
}
function _y(e, t, n) {
    let r = E(),
        o = un();
    if (je(r, o, t)) {
        let i = P(),
            s = Or();
        ys(i, s, r, e, t, r[F], n, !1);
    }
    return _y;
}
function Ti(e, t, n, r, o) {
    let i = t.inputs,
        s = o ? "class" : "style";
    vs(e, n, i[s], s, r);
}
function My(e, t) {
    return Sy(e, t, null, !0), My;
}
function rM(e) {
    Ty(Py, xy, e, !0);
}
function xy(e, t) {
    for (let n = Ey(t); n >= 0; n = Il(t, n)) Ui(e, wy(t), !0);
}
function Sy(e, t, n, r) {
    let o = E(),
        i = P(),
        s = ec(2);
    if ((i.firstUpdatePass && Cl(i, e, s, r), t !== ge && je(o, s, t))) {
        let a = i.data[st()];
        bl(i, a, o, o[F], e, (o[s + 1] = Ly(t, n)), r, s);
    }
}
function Ty(e, t, n, r) {
    let o = P(),
        i = ec(2);
    o.firstUpdatePass && Cl(o, null, i, r);
    let s = E();
    if (n !== ge && je(s, i, n)) {
        let a = o.data[st()];
        if (_l(a, r) && !El(o, i)) {
            let u = r ? a.classesWithoutHost : a.stylesWithoutHost;
            u !== null && (n = Fo(u, n || "")), Ti(o, a, s, n, r);
        } else ky(o, a, s, s[F], s[i + 1], (s[i + 1] = Ry(e, t, n)), r, i);
    }
}
function El(e, t) {
    return t >= e.expandoStartIndex;
}
function Cl(e, t, n, r) {
    let o = e.data;
    if (o[n + 1] === null) {
        let i = o[st()],
            s = El(e, n);
        _l(i, r) && t === null && !s && (t = !1),
            (t = Ny(o, i, t, r)),
            Dy(o, i, t, n, s, r);
    }
}
function Ny(e, t, n, r) {
    let o = Bp(e),
        i = r ? t.residualClasses : t.residualStyles;
    if (o === null)
        (r ? t.classBindings : t.styleBindings) === 0 &&
            ((n = No(null, e, t, n, r)), (n = rn(n, t.attrs, r)), (i = null));
    else {
        let s = t.directiveStylingLast;
        if (s === -1 || e[s] !== o)
            if (((n = No(o, e, t, n, r)), i === null)) {
                let u = Ay(e, t, r);
                u !== void 0 &&
                    Array.isArray(u) &&
                    ((u = No(null, e, t, u[1], r)),
                    (u = rn(u, t.attrs, r)),
                    Oy(e, t, r, u));
            } else i = Fy(e, t, r);
    }
    return (
        i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)),
        n
    );
}
function Ay(e, t, n) {
    let r = n ? t.classBindings : t.styleBindings;
    if (Pt(r) !== 0) return e[ot(r)];
}
function Oy(e, t, n, r) {
    let o = n ? t.classBindings : t.styleBindings;
    e[ot(o)] = r;
}
function Fy(e, t, n) {
    let r,
        o = t.directiveEnd;
    for (let i = 1 + t.directiveStylingLast; i < o; i++) {
        let s = e[i].hostAttrs;
        r = rn(r, s, n);
    }
    return rn(r, t.attrs, n);
}
function No(e, t, n, r, o) {
    let i = null,
        s = n.directiveEnd,
        a = n.directiveStylingLast;
    for (
        a === -1 ? (a = n.directiveStart) : a++;
        a < s && ((i = t[a]), (r = rn(r, i.hostAttrs, o)), i !== e);

    )
        a++;
    return e !== null && (n.directiveStylingLast = a), r;
}
function rn(e, t, n) {
    let r = n ? 1 : 2,
        o = -1;
    if (t !== null)
        for (let i = 0; i < t.length; i++) {
            let s = t[i];
            typeof s == "number"
                ? (o = s)
                : o === r &&
                  (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
                  Ui(e, s, n ? !0 : t[++i]));
        }
    return e === void 0 ? null : e;
}
function Ry(e, t, n) {
    if (n == null || n === "") return z;
    let r = [],
        o = cn(n);
    if (Array.isArray(o)) for (let i = 0; i < o.length; i++) e(r, o[i], !0);
    else if (typeof o == "object")
        for (let i in o) o.hasOwnProperty(i) && e(r, i, o[i]);
    else typeof o == "string" && t(r, o);
    return r;
}
function Py(e, t, n) {
    let r = String(t);
    r !== "" && !r.includes(" ") && Ui(e, r, n);
}
function ky(e, t, n, r, o, i, s, a) {
    o === ge && (o = z);
    let u = 0,
        c = 0,
        l = 0 < o.length ? o[0] : null,
        d = 0 < i.length ? i[0] : null;
    for (; l !== null || d !== null; ) {
        let f = u < o.length ? o[u + 1] : void 0,
            p = c < i.length ? i[c + 1] : void 0,
            h = null,
            w;
        l === d
            ? ((u += 2), (c += 2), f !== p && ((h = d), (w = p)))
            : d === null || (l !== null && l < d)
              ? ((u += 2), (h = l))
              : ((c += 2), (h = d), (w = p)),
            h !== null && bl(e, t, n, r, h, w, s, a),
            (l = u < o.length ? o[u] : null),
            (d = c < i.length ? i[c] : null);
    }
}
function bl(e, t, n, r, o, i, s, a) {
    if (!(t.type & 3)) return;
    let u = e.data,
        c = u[a + 1],
        l = yy(c) ? ou(u, t, n, o, Pt(c), s) : void 0;
    if (!Cr(l)) {
        Cr(i) || (gy(c) && (i = ou(u, null, n, o, a, s)));
        let d = Yu(st(), n);
        pg(r, s, d, o, i);
    }
}
function ou(e, t, n, r, o, i) {
    let s = t === null,
        a;
    for (; o > 0; ) {
        let u = e[o],
            c = Array.isArray(u),
            l = c ? u[1] : u,
            d = l === null,
            f = n[o + 1];
        f === ge && (f = d ? z : void 0);
        let p = d ? Io(f, r) : l === r ? f : void 0;
        if ((c && !Cr(p) && (p = Io(u, r)), Cr(p) && ((a = p), s))) return a;
        let h = e[o + 1];
        o = s ? ot(h) : Pt(h);
    }
    if (t !== null) {
        let u = i ? t.residualClasses : t.residualStyles;
        u != null && (a = Io(u, r));
    }
    return a;
}
function Cr(e) {
    return e !== void 0;
}
function Ly(e, t) {
    return (
        e == null ||
            e === "" ||
            (typeof t == "string"
                ? (e = e + t)
                : typeof e == "object" && (e = H(cn(e)))),
        e
    );
}
function _l(e, t) {
    return (e.flags & (t ? 8 : 16)) !== 0;
}
function oM(e, t, n) {
    dn("NgControlFlow");
    let r = E(),
        o = un(),
        i = jy(r, Y + e),
        s = 0;
    if (je(r, o, t)) {
        let a = M(null);
        try {
            if ((zg(i, s), t !== -1)) {
                let u = Vy(r[v], Y + t),
                    c = li(i, u.tView.ssrId),
                    l = rl(r, u, n, { dehydratedView: c });
                ol(i, l, s, ui(u, c));
            }
        } finally {
            M(a);
        }
    } else {
        let a = Gg(i, s);
        a !== void 0 && (a[J] = n);
    }
}
function jy(e, t) {
    return e[t];
}
function Vy(e, t) {
    return Ki(e, t);
}
function By(e, t, n, r, o, i) {
    let s = t.consts,
        a = Ft(s, o),
        u = Vt(t, e, 2, r, a);
    return (
        Ds(t, n, u, Ft(s, i)),
        u.attrs !== null && yr(u, u.attrs, !1),
        u.mergedAttrs !== null && yr(u, u.mergedAttrs, !0),
        t.queries !== null && t.queries.elementStart(t, u),
        u
    );
}
function Ml(e, t, n, r) {
    let o = E(),
        i = P(),
        s = Y + e,
        a = o[F],
        u = i.firstCreatePass ? By(s, i, o, t, n, r) : i.data[s],
        c = Hy(i, o, u, a, t, e);
    o[s] = c;
    let l = Ar(u);
    return (
        it(u, !0),
        Gc(a, c, u),
        !cy(u) && Fr() && jr(i, o, c, u),
        Sp() === 0 && Re(c, o),
        Tp(),
        l && (hs(i, o, u), ps(i, u, o)),
        r !== null && gs(o, u),
        Ml
    );
}
function xl() {
    let e = V();
    es() ? ts() : ((e = e.parent), it(e, !1));
    let t = e;
    Ap(t) && Op(), Np();
    let n = P();
    return (
        n.firstCreatePass && (Pr(n, e), Zi(e) && n.queries.elementEnd(e)),
        t.classesWithoutHost != null &&
            qp(t) &&
            Ti(n, t, E(), t.classesWithoutHost, !0),
        t.stylesWithoutHost != null &&
            Yp(t) &&
            Ti(n, t, E(), t.stylesWithoutHost, !1),
        xl
    );
}
function $y(e, t, n, r) {
    return Ml(e, t, n, r), xl(), $y;
}
var Hy = (e, t, n, r, o, i) => (Rr(!0), Pc(r, o, Up()));
function Uy(e, t, n, r, o) {
    let i = t.consts,
        s = Ft(i, r),
        a = Vt(t, e, 8, "ng-container", s);
    s !== null && yr(a, s, !0);
    let u = Ft(i, o);
    return (
        Ds(t, n, a, u), t.queries !== null && t.queries.elementStart(t, a), a
    );
}
function Sl(e, t, n) {
    let r = E(),
        o = P(),
        i = e + Y,
        s = o.firstCreatePass ? Uy(i, o, r, t, n) : o.data[i];
    it(s, !0);
    let a = zy(o, r, s, e);
    return (
        (r[i] = a),
        Fr() && jr(o, r, a, s),
        Re(a, r),
        Ar(s) && (hs(o, r, s), ps(o, s, r)),
        n != null && gs(r, s),
        Sl
    );
}
function Tl() {
    let e = V(),
        t = P();
    return (
        es() ? ts() : ((e = e.parent), it(e, !1)),
        t.firstCreatePass && (Pr(t, e), Zi(e) && t.queries.elementEnd(e)),
        Tl
    );
}
function Gy(e, t, n) {
    return Sl(e, t, n), Tl(), Gy;
}
var zy = (e, t, n, r) => (Rr(!0), Kh(t[F], ""));
function iM() {
    return E();
}
var br = "en-US";
var Wy = br;
function qy(e) {
    typeof e == "string" && (Wy = e.toLowerCase().replace(/_/g, "-"));
}
function Yy(e, t, n, r) {
    let o = E(),
        i = P(),
        s = V();
    return Nl(i, o, o[F], s, e, t, r), Yy;
}
function Qy(e, t, n, r) {
    let o = e.cleanup;
    if (o != null)
        for (let i = 0; i < o.length - 1; i += 2) {
            let s = o[i];
            if (s === n && o[i + 1] === r) {
                let a = t[Xt],
                    u = o[i + 2];
                return a.length > u ? a[u] : null;
            }
            typeof s == "string" && (i += 2);
        }
    return null;
}
function Nl(e, t, n, r, o, i, s) {
    let a = Ar(r),
        c = e.firstCreatePass && tl(e),
        l = t[J],
        d = el(t),
        f = !0;
    if (r.type & 3 || s) {
        let w = X(r, t),
            k = s ? s(w) : w,
            N = d.length,
            Z = s ? (me) => s(he(me[r.index])) : r.index,
            U = null;
        if ((!s && a && (U = Qy(e, t, o, r.index)), U !== null)) {
            let me = U.__ngLastListenerFn__ || U;
            (me.__ngNextListenerFn__ = i),
                (U.__ngLastListenerFn__ = i),
                (f = !1);
        } else {
            i = su(r, t, l, i, !1);
            let me = n.listen(k, o, i);
            d.push(i, me), c && c.push(o, Z, N, N + 1);
        }
    } else i = su(r, t, l, i, !1);
    let p = r.outputs,
        h;
    if (f && p !== null && (h = p[o])) {
        let w = h.length;
        if (w)
            for (let k = 0; k < w; k += 2) {
                let N = h[k],
                    Z = h[k + 1],
                    ut = t[N][Z].subscribe(i),
                    ee = d.length;
                d.push(i, ut), c && c.push(o, r.index, ee, -(ee + 1));
            }
    }
}
function iu(e, t, n, r) {
    let o = M(null);
    try {
        return fe(6, t, n), n(r) !== !1;
    } catch (i) {
        return nl(e, i), !1;
    } finally {
        fe(7, t, n), M(o);
    }
}
function su(e, t, n, r, o) {
    return function i(s) {
        if (s === Function) return r;
        let a = e.componentOffset > -1 ? ke(e.index, t) : t;
        ws(a);
        let u = iu(t, n, r, s),
            c = i.__ngNextListenerFn__;
        for (; c; ) (u = iu(t, n, c, s) && u), (c = c.__ngNextListenerFn__);
        return o && u === !1 && s.preventDefault(), u;
    };
}
function sM(e = 1) {
    return Hp(e);
}
function Zy(e, t) {
    let n = null,
        r = Gf(e);
    for (let o = 0; o < t.length; o++) {
        let i = t[o];
        if (i === "*") {
            n = o;
            continue;
        }
        if (r === null ? xu(e, i, !0) : qf(r, i)) return o;
    }
    return n;
}
function aM(e) {
    let t = E()[ue][Q];
    if (!t.projection) {
        let n = e ? e.length : 1,
            r = (t.projection = Pf(n, null)),
            o = r.slice(),
            i = t.child;
        for (; i !== null; ) {
            let s = e ? Zy(i, e) : 0;
            s !== null &&
                (o[s] ? (o[s].projectionNext = i) : (r[s] = i), (o[s] = i)),
                (i = i.next);
        }
    }
}
function uM(e, t = 0, n) {
    let r = E(),
        o = P(),
        i = Vt(o, Y + e, 16, null, n || null);
    i.projection === null && (i.projection = t),
        ts(),
        (!r[Jt] || Ju()) && (i.flags & 32) !== 32 && dg(o, r, i);
}
function Ky(e, t, n) {
    return Al(e, "", t, "", n), Ky;
}
function Al(e, t, n, r, o) {
    let i = E(),
        s = vl(i, t, n, r);
    if (s !== ge) {
        let a = P(),
            u = Or();
        ys(a, u, i, e, s, i[F], o, !1);
    }
    return Al;
}
function cM(e, t, n, r) {
    Vm(e, t, n, r);
}
function lM(e, t, n) {
    jm(e, t, n);
}
function dM(e) {
    let t = E(),
        n = P(),
        r = tc();
    ns(r + 1);
    let o = bs(n, r);
    if (e.dirty && Cp(t) === ((o.metadata.flags & 2) === 2)) {
        if (o.matches === null) e.reset([]);
        else {
            let i = Hm(t, r);
            e.reset(i, uh), e.notifyOnChanges();
        }
        return !0;
    }
    return !1;
}
function fM() {
    return Lm(E(), tc());
}
function pM(e) {
    let t = Rp();
    return Ep(t, Y + e);
}
function hM(e, t = "") {
    let n = E(),
        r = P(),
        o = e + Y,
        i = r.firstCreatePass ? Vt(r, o, 1, t, null) : r.data[o],
        s = Jy(r, n, i, t, e);
    (n[o] = s), Fr() && jr(r, n, s, i), it(i, !1);
}
var Jy = (e, t, n, r, o) => (Rr(!0), Qh(t[F], r));
function Xy(e) {
    return Ol("", e, ""), Xy;
}
function Ol(e, t, n) {
    let r = E(),
        o = vl(r, e, t, n);
    return o !== ge && Bg(r, st(), o), Ol;
}
function eD(e, t, n) {
    yl(t) && (t = t());
    let r = E(),
        o = un();
    if (je(r, o, t)) {
        let i = P(),
            s = Or();
        ys(i, s, r, e, t, r[F], n, !1);
    }
    return eD;
}
function gM(e, t) {
    let n = yl(e);
    return n && e.set(t), n;
}
function tD(e, t) {
    let n = E(),
        r = P(),
        o = V();
    return Nl(r, n, n[F], o, e, t), tD;
}
function nD(e, t, n) {
    let r = P();
    if (r.firstCreatePass) {
        let o = Oe(e);
        Ni(n, r.data, r.blueprint, o, !0), Ni(t, r.data, r.blueprint, o, !1);
    }
}
function Ni(e, t, n, r, o) {
    if (((e = $(e)), Array.isArray(e)))
        for (let i = 0; i < e.length; i++) Ni(e[i], t, n, r, o);
    else {
        let i = P(),
            s = E(),
            a = V(),
            u = Nt(e) ? e : $(e.provide),
            c = Lu(e),
            l = a.providerIndexes & 1048575,
            d = a.directiveStart,
            f = a.providerIndexes >> 20;
        if (Nt(e) || !e.multi) {
            let p = new et(c, o, _e),
                h = Oo(u, t, o ? l : l + f, d);
            h === -1
                ? (zo(lr(a, s), i, u),
                  Ao(i, e, t.length),
                  t.push(u),
                  a.directiveStart++,
                  a.directiveEnd++,
                  o && (a.providerIndexes += 1048576),
                  n.push(p),
                  s.push(p))
                : ((n[h] = p), (s[h] = p));
        } else {
            let p = Oo(u, t, l + f, d),
                h = Oo(u, t, l, l + f),
                w = p >= 0 && n[p],
                k = h >= 0 && n[h];
            if ((o && !k) || (!o && !w)) {
                zo(lr(a, s), i, u);
                let N = iD(o ? oD : rD, n.length, o, r, c);
                !o && k && (n[h].providerFactory = N),
                    Ao(i, e, t.length, 0),
                    t.push(u),
                    a.directiveStart++,
                    a.directiveEnd++,
                    o && (a.providerIndexes += 1048576),
                    n.push(N),
                    s.push(N);
            } else {
                let N = Fl(n[o ? h : p], c, !o && r);
                Ao(i, e, p > -1 ? p : h, N);
            }
            !o && r && k && n[h].componentProviders++;
        }
    }
}
function Ao(e, t, n, r) {
    let o = Nt(t),
        i = ip(t);
    if (o || i) {
        let u = (i ? $(t.useClass) : t).prototype.ngOnDestroy;
        if (u) {
            let c = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
                let l = c.indexOf(n);
                l === -1 ? c.push(n, [r, u]) : c[l + 1].push(r, u);
            } else c.push(n, u);
        }
    }
}
function Fl(e, t, n) {
    return n && e.componentProviders++, e.multi.push(t) - 1;
}
function Oo(e, t, n, r) {
    for (let o = n; o < r; o++) if (t[o] === e) return o;
    return -1;
}
function rD(e, t, n, r) {
    return Ai(this.multi, []);
}
function oD(e, t, n, r) {
    let o = this.multi,
        i;
    if (this.providerFactory) {
        let s = this.providerFactory.componentProviders,
            a = tt(n, n[v], this.providerFactory.index, r);
        (i = a.slice(0, s)), Ai(o, i);
        for (let u = s; u < a.length; u++) i.push(a[u]);
    } else (i = []), Ai(o, i);
    return i;
}
function Ai(e, t) {
    for (let n = 0; n < e.length; n++) {
        let r = e[n];
        t.push(r());
    }
    return t;
}
function iD(e, t, n, r, o) {
    let i = new et(e, n, _e);
    return (
        (i.multi = []),
        (i.index = t),
        (i.componentProviders = 0),
        Fl(i, o, r && !n),
        i
    );
}
function mM(e, t = []) {
    return (n) => {
        n.providersResolver = (r, o) => nD(r, o ? o(e) : e, t);
    };
}
var sD = (() => {
    let t = class t {
        constructor(r) {
            (this._injector = r), (this.cachedInjectors = new Map());
        }
        getOrCreateStandaloneInjector(r) {
            if (!r.standalone) return null;
            if (!this.cachedInjectors.has(r)) {
                let o = Fu(!1, r.type),
                    i =
                        o.length > 0
                            ? iy(
                                  [o],
                                  this._injector,
                                  `Standalone[${r.type.name}]`
                              )
                            : null;
                this.cachedInjectors.set(r, i);
            }
            return this.cachedInjectors.get(r);
        }
        ngOnDestroy() {
            try {
                for (let r of this.cachedInjectors.values())
                    r !== null && r.destroy();
            } finally {
                this.cachedInjectors.clear();
            }
        }
    };
    t.ɵprov = O({
        token: t,
        providedIn: "environment",
        factory: () => new t(R(Ae)),
    });
    let e = t;
    return e;
})();
function yM(e) {
    dn("NgStandalone"),
        (e.getStandaloneInjector = (t) =>
            t.get(sD).getOrCreateStandaloneInjector(e));
}
function DM(e, t, n, r) {
    return uD(E(), Pp(), e, t, n, r);
}
function aD(e, t) {
    let n = e[t];
    return n === ge ? void 0 : n;
}
function uD(e, t, n, r, o, i) {
    let s = t + n;
    return je(e, s, o) ? uy(e, s + 1, i ? r.call(i, o) : r(o)) : aD(e, s + 1);
}
function vM(e, t) {
    return Hr(e, t);
}
var Yn = null;
function cD(e) {
    (Yn !== null &&
        (e.defaultEncapsulation !== Yn.defaultEncapsulation ||
            e.preserveWhitespaces !== Yn.preserveWhitespaces)) ||
        (Yn = e);
}
var IM = (() => {
    let t = class t {
        log(r) {
            console.log(r);
        }
        warn(r) {
            console.warn(r);
        }
    };
    (t.ɵfac = function (o) {
        return new (o || t)();
    }),
        (t.ɵprov = O({ token: t, factory: t.ɵfac, providedIn: "platform" }));
    let e = t;
    return e;
})();
var lD = new T(""),
    dD = new T(""),
    wM = (() => {
        let t = class t {
            constructor(r, o, i) {
                (this._ngZone = r),
                    (this.registry = o),
                    (this._pendingCount = 0),
                    (this._isZoneStable = !0),
                    (this._callbacks = []),
                    (this.taskTrackingZone = null),
                    Ms || (pD(i), i.addToWindow(o)),
                    this._watchAngularEvents(),
                    r.run(() => {
                        this.taskTrackingZone =
                            typeof Zone > "u"
                                ? null
                                : Zone.current.get("TaskTrackingZone");
                    });
            }
            _watchAngularEvents() {
                this._ngZone.onUnstable.subscribe({
                    next: () => {
                        this._isZoneStable = !1;
                    },
                }),
                    this._ngZone.runOutsideAngular(() => {
                        this._ngZone.onStable.subscribe({
                            next: () => {
                                q.assertNotInAngularZone(),
                                    queueMicrotask(() => {
                                        (this._isZoneStable = !0),
                                            this._runCallbacksIfReady();
                                    });
                            },
                        });
                    });
            }
            increasePendingRequestCount() {
                return (this._pendingCount += 1), this._pendingCount;
            }
            decreasePendingRequestCount() {
                if (((this._pendingCount -= 1), this._pendingCount < 0))
                    throw new Error("pending async requests below zero");
                return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
                return (
                    this._isZoneStable &&
                    this._pendingCount === 0 &&
                    !this._ngZone.hasPendingMacrotasks
                );
            }
            _runCallbacksIfReady() {
                if (this.isStable())
                    queueMicrotask(() => {
                        for (; this._callbacks.length !== 0; ) {
                            let r = this._callbacks.pop();
                            clearTimeout(r.timeoutId), r.doneCb();
                        }
                    });
                else {
                    let r = this.getPendingTasks();
                    this._callbacks = this._callbacks.filter((o) =>
                        o.updateCb && o.updateCb(r)
                            ? (clearTimeout(o.timeoutId), !1)
                            : !0
                    );
                }
            }
            getPendingTasks() {
                return this.taskTrackingZone
                    ? this.taskTrackingZone.macroTasks.map((r) => ({
                          source: r.source,
                          creationLocation: r.creationLocation,
                          data: r.data,
                      }))
                    : [];
            }
            addCallback(r, o, i) {
                let s = -1;
                o &&
                    o > 0 &&
                    (s = setTimeout(() => {
                        (this._callbacks = this._callbacks.filter(
                            (a) => a.timeoutId !== s
                        )),
                            r();
                    }, o)),
                    this._callbacks.push({
                        doneCb: r,
                        timeoutId: s,
                        updateCb: i,
                    });
            }
            whenStable(r, o, i) {
                if (i && !this.taskTrackingZone)
                    throw new Error(
                        'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                    );
                this.addCallback(r, o, i), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
                return this._pendingCount;
            }
            registerApplication(r) {
                this.registry.registerApplication(r, this);
            }
            unregisterApplication(r) {
                this.registry.unregisterApplication(r);
            }
            findProviders(r, o, i) {
                return [];
            }
        };
        (t.ɵfac = function (o) {
            return new (o || t)(R(q), R(fD), R(dD));
        }),
            (t.ɵprov = O({ token: t, factory: t.ɵfac }));
        let e = t;
        return e;
    })(),
    fD = (() => {
        let t = class t {
            constructor() {
                this._applications = new Map();
            }
            registerApplication(r, o) {
                this._applications.set(r, o);
            }
            unregisterApplication(r) {
                this._applications.delete(r);
            }
            unregisterAllApplications() {
                this._applications.clear();
            }
            getTestability(r) {
                return this._applications.get(r) || null;
            }
            getAllTestabilities() {
                return Array.from(this._applications.values());
            }
            getAllRootElements() {
                return Array.from(this._applications.keys());
            }
            findTestabilityInTree(r, o = !0) {
                return Ms?.findTestabilityInTree(this, r, o) ?? null;
            }
        };
        (t.ɵfac = function (o) {
            return new (o || t)();
        }),
            (t.ɵprov = O({
                token: t,
                factory: t.ɵfac,
                providedIn: "platform",
            }));
        let e = t;
        return e;
    })();
function pD(e) {
    Ms = e;
}
var Ms;
function xs(e) {
    return !!e && typeof e.then == "function";
}
function Rl(e) {
    return !!e && typeof e.subscribe == "function";
}
var hD = new T(""),
    Pl = (() => {
        let t = class t {
            constructor() {
                (this.initialized = !1),
                    (this.done = !1),
                    (this.donePromise = new Promise((r, o) => {
                        (this.resolve = r), (this.reject = o);
                    })),
                    (this.appInits = S(hD, { optional: !0 }) ?? []);
            }
            runInitializers() {
                if (this.initialized) return;
                let r = [];
                for (let i of this.appInits) {
                    let s = i();
                    if (xs(s)) r.push(s);
                    else if (Rl(s)) {
                        let a = new Promise((u, c) => {
                            s.subscribe({ complete: u, error: c });
                        });
                        r.push(a);
                    }
                }
                let o = () => {
                    (this.done = !0), this.resolve();
                };
                Promise.all(r)
                    .then(() => {
                        o();
                    })
                    .catch((i) => {
                        this.reject(i);
                    }),
                    r.length === 0 && o(),
                    (this.initialized = !0);
            }
        };
        (t.ɵfac = function (o) {
            return new (o || t)();
        }),
            (t.ɵprov = O({ token: t, factory: t.ɵfac, providedIn: "root" }));
        let e = t;
        return e;
    })(),
    gD = new T("");
function mD() {
    zs(() => {
        throw new _(600, !1);
    });
}
function yD(e) {
    return e.isBoundToModule;
}
function DD(e, t, n) {
    try {
        let r = n();
        return xs(r)
            ? r.catch((o) => {
                  throw (t.runOutsideAngular(() => e.handleError(o)), o);
              })
            : r;
    } catch (r) {
        throw (t.runOutsideAngular(() => e.handleError(r)), r);
    }
}
function kl(e, t) {
    return Array.isArray(t) ? t.reduce(kl, e) : xe(xe({}, e), t);
}
var Ss = (() => {
    let t = class t {
        constructor() {
            (this._bootstrapListeners = []),
                (this._runningTick = !1),
                (this._destroyed = !1),
                (this._destroyListeners = []),
                (this._views = []),
                (this.internalErrorHandler = S(vc)),
                (this.afterRenderEffectManager = S(Cs)),
                (this.externalTestViews = new Set()),
                (this.beforeRender = new ce()),
                (this.afterTick = new ce()),
                (this.componentTypes = []),
                (this.components = []),
                (this.isStable = S(_s).hasPendingTasks.pipe(De((r) => !r))),
                (this._injector = S(Ae));
        }
        get destroyed() {
            return this._destroyed;
        }
        get injector() {
            return this._injector;
        }
        bootstrap(r, o) {
            let i = r instanceof mr;
            if (!this._injector.get(Pl).done) {
                let p = !i && Xf(r),
                    h = !1;
                throw new _(405, h);
            }
            let a;
            i
                ? (a = r)
                : (a = this._injector.get(Ur).resolveComponentFactory(r)),
                this.componentTypes.push(a.componentType);
            let u = yD(a) ? void 0 : this._injector.get(Pe),
                c = o || a.selector,
                l = a.create(Le.NULL, [], c, u),
                d = l.location.nativeElement,
                f = l.injector.get(lD, null);
            return (
                f?.registerApplication(d),
                l.onDestroy(() => {
                    this.detachView(l.hostView),
                        tr(this.components, l),
                        f?.unregisterApplication(d);
                }),
                this._loadComponent(l),
                l
            );
        }
        tick() {
            this._tick(!0);
        }
        _tick(r) {
            if (this._runningTick) throw new _(101, !1);
            let o = M(null);
            try {
                (this._runningTick = !0), this.detectChangesInAttachedViews(r);
            } catch (i) {
                this.internalErrorHandler(i);
            } finally {
                this.afterTick.next(), (this._runningTick = !1), M(o);
            }
        }
        detectChangesInAttachedViews(r) {
            let o = 0,
                i = this.afterRenderEffectManager;
            for (;;) {
                if (o === sl) throw new _(103, !1);
                if (r) {
                    let s = o === 0;
                    this.beforeRender.next(s);
                    for (let { _lView: a, notifyErrorHandler: u } of this
                        ._views)
                        vD(a, s, u);
                }
                if (
                    (o++,
                    i.executeInternalCallbacks(),
                    ![...this.externalTestViews.keys(), ...this._views].some(
                        ({ _lView: s }) => Oi(s)
                    ) &&
                        (i.execute(),
                        ![
                            ...this.externalTestViews.keys(),
                            ...this._views,
                        ].some(({ _lView: s }) => Oi(s))))
                )
                    break;
            }
        }
        attachView(r) {
            let o = r;
            this._views.push(o), o.attachToAppRef(this);
        }
        detachView(r) {
            let o = r;
            tr(this._views, o), o.detachFromAppRef();
        }
        _loadComponent(r) {
            this.attachView(r.hostView), this.tick(), this.components.push(r);
            let o = this._injector.get(gD, []);
            [...this._bootstrapListeners, ...o].forEach((i) => i(r));
        }
        ngOnDestroy() {
            if (!this._destroyed)
                try {
                    this._destroyListeners.forEach((r) => r()),
                        this._views.slice().forEach((r) => r.destroy());
                } finally {
                    (this._destroyed = !0),
                        (this._views = []),
                        (this._bootstrapListeners = []),
                        (this._destroyListeners = []);
                }
        }
        onDestroy(r) {
            return (
                this._destroyListeners.push(r),
                () => tr(this._destroyListeners, r)
            );
        }
        destroy() {
            if (this._destroyed) throw new _(406, !1);
            let r = this._injector;
            r.destroy && !r.destroyed && r.destroy();
        }
        get viewCount() {
            return this._views.length;
        }
        warnIfDestroyed() {}
    };
    (t.ɵfac = function (o) {
        return new (o || t)();
    }),
        (t.ɵprov = O({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
})();
function tr(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1);
}
function vD(e, t, n) {
    (!t && !Oi(e)) || ID(e, n, t);
}
function Oi(e) {
    return Xi(e);
}
function ID(e, t, n) {
    let r;
    n ? ((r = 0), (e[m] |= 1024)) : e[m] & 64 ? (r = 0) : (r = 1), al(e, t, r);
}
var Fi = class {
        constructor(t, n) {
            (this.ngModuleFactory = t), (this.componentFactories = n);
        }
    },
    EM = (() => {
        let t = class t {
            compileModuleSync(r) {
                return new Er(r);
            }
            compileModuleAsync(r) {
                return Promise.resolve(this.compileModuleSync(r));
            }
            compileModuleAndAllComponentsSync(r) {
                let o = this.compileModuleSync(r),
                    i = Nu(r),
                    s = Rc(i.declarations).reduce((a, u) => {
                        let c = Ne(u);
                        return c && a.push(new Rt(c)), a;
                    }, []);
                return new Fi(o, s);
            }
            compileModuleAndAllComponentsAsync(r) {
                return Promise.resolve(
                    this.compileModuleAndAllComponentsSync(r)
                );
            }
            clearCache() {}
            clearCacheFor(r) {}
            getModuleId(r) {}
        };
        (t.ɵfac = function (o) {
            return new (o || t)();
        }),
            (t.ɵprov = O({ token: t, factory: t.ɵfac, providedIn: "root" }));
        let e = t;
        return e;
    })(),
    wD = new T("");
function ED(e, t, n) {
    let r = new Er(n);
    return Promise.resolve(r);
}
function au(e) {
    for (let t = e.length - 1; t >= 0; t--) if (e[t] !== void 0) return e[t];
}
var CD = (() => {
    let t = class t {
        constructor() {
            (this.zone = S(q)), (this.applicationRef = S(Ss));
        }
        initialize() {
            this._onMicrotaskEmptySubscription ||
                (this._onMicrotaskEmptySubscription =
                    this.zone.onMicrotaskEmpty.subscribe({
                        next: () => {
                            this.zone.run(() => {
                                this.applicationRef.tick();
                            });
                        },
                    }));
        }
        ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe();
        }
    };
    (t.ɵfac = function (o) {
        return new (o || t)();
    }),
        (t.ɵprov = O({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
})();
function bD(e) {
    return [
        { provide: q, useFactory: e },
        {
            provide: ir,
            multi: !0,
            useFactory: () => {
                let t = S(CD, { optional: !0 });
                return () => t.initialize();
            },
        },
        {
            provide: ir,
            multi: !0,
            useFactory: () => {
                let t = S(xD);
                return () => {
                    t.initialize();
                };
            },
        },
        { provide: vc, useFactory: _D },
    ];
}
function _D() {
    let e = S(q),
        t = S(Fe);
    return (n) => e.runOutsideAngular(() => t.handleError(n));
}
function MD(e) {
    return {
        enableLongStackTrace: !1,
        shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
        shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
    };
}
var xD = (() => {
    let t = class t {
        constructor() {
            (this.subscription = new L()),
                (this.initialized = !1),
                (this.zone = S(q)),
                (this.pendingTasks = S(_s));
        }
        initialize() {
            if (this.initialized) return;
            this.initialized = !0;
            let r = null;
            !this.zone.isStable &&
                !this.zone.hasPendingMacrotasks &&
                !this.zone.hasPendingMicrotasks &&
                (r = this.pendingTasks.add()),
                this.zone.runOutsideAngular(() => {
                    this.subscription.add(
                        this.zone.onStable.subscribe(() => {
                            q.assertNotInAngularZone(),
                                queueMicrotask(() => {
                                    r !== null &&
                                        !this.zone.hasPendingMacrotasks &&
                                        !this.zone.hasPendingMicrotasks &&
                                        (this.pendingTasks.remove(r),
                                        (r = null));
                                });
                        })
                    );
                }),
                this.subscription.add(
                    this.zone.onUnstable.subscribe(() => {
                        q.assertInAngularZone(),
                            (r ??= this.pendingTasks.add());
                    })
                );
        }
        ngOnDestroy() {
            this.subscription.unsubscribe();
        }
    };
    (t.ɵfac = function (o) {
        return new (o || t)();
    }),
        (t.ɵprov = O({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
})();
function SD() {
    return (typeof $localize < "u" && $localize.locale) || br;
}
var Ts = new T("", {
    providedIn: "root",
    factory: () => S(Ts, b.Optional | b.SkipSelf) || SD(),
});
var Ll = new T(""),
    jl = (() => {
        let t = class t {
            constructor(r) {
                (this._injector = r),
                    (this._modules = []),
                    (this._destroyListeners = []),
                    (this._destroyed = !1);
            }
            bootstrapModuleFactory(r, o) {
                let i = gm(
                    o?.ngZone,
                    MD({
                        eventCoalescing: o?.ngZoneEventCoalescing,
                        runCoalescing: o?.ngZoneRunCoalescing,
                    })
                );
                return i.run(() => {
                    let s = oy(
                            r.moduleType,
                            this.injector,
                            bD(() => i)
                        ),
                        a = s.injector.get(Fe, null);
                    return (
                        i.runOutsideAngular(() => {
                            let u = i.onError.subscribe({
                                next: (c) => {
                                    a.handleError(c);
                                },
                            });
                            s.onDestroy(() => {
                                tr(this._modules, s), u.unsubscribe();
                            });
                        }),
                        DD(a, i, () => {
                            let u = s.injector.get(Pl);
                            return (
                                u.runInitializers(),
                                u.donePromise.then(() => {
                                    let c = s.injector.get(Ts, br);
                                    return (
                                        qy(c || br),
                                        this._moduleDoBootstrap(s),
                                        s
                                    );
                                })
                            );
                        })
                    );
                });
            }
            bootstrapModule(r, o = []) {
                let i = kl({}, o);
                return ED(this.injector, i, r).then((s) =>
                    this.bootstrapModuleFactory(s, i)
                );
            }
            _moduleDoBootstrap(r) {
                let o = r.injector.get(Ss);
                if (r._bootstrapComponents.length > 0)
                    r._bootstrapComponents.forEach((i) => o.bootstrap(i));
                else if (r.instance.ngDoBootstrap) r.instance.ngDoBootstrap(o);
                else throw new _(-403, !1);
                this._modules.push(r);
            }
            onDestroy(r) {
                this._destroyListeners.push(r);
            }
            get injector() {
                return this._injector;
            }
            destroy() {
                if (this._destroyed) throw new _(404, !1);
                this._modules.slice().forEach((o) => o.destroy()),
                    this._destroyListeners.forEach((o) => o());
                let r = this._injector.get(Ll, null);
                r && (r.forEach((o) => o()), r.clear()), (this._destroyed = !0);
            }
            get destroyed() {
                return this._destroyed;
            }
        };
        (t.ɵfac = function (o) {
            return new (o || t)(R(Le));
        }),
            (t.ɵprov = O({
                token: t,
                factory: t.ɵfac,
                providedIn: "platform",
            }));
        let e = t;
        return e;
    })(),
    qt = null,
    Vl = new T("");
function TD(e) {
    if (qt && !qt.get(Vl, !1)) throw new _(400, !1);
    mD(), (qt = e);
    let t = e.get(jl);
    return FD(e), t;
}
function ND(e, t, n = []) {
    let r = `Platform: ${t}`,
        o = new T(r);
    return (i = []) => {
        let s = Bl();
        if (!s || s.injector.get(Vl, !1)) {
            let a = [...n, ...i, { provide: o, useValue: !0 }];
            e ? e(a) : TD(AD(a, r));
        }
        return OD(o);
    };
}
function AD(e = [], t) {
    return Le.create({
        name: t,
        providers: [
            { provide: ku, useValue: "platform" },
            { provide: Ll, useValue: new Set([() => (qt = null)]) },
            ...e,
        ],
    });
}
function OD(e) {
    let t = Bl();
    if (!t) throw new _(401, !1);
    return t;
}
function Bl() {
    return qt?.get(jl) ?? null;
}
function FD(e) {
    e.get(mh, null)?.forEach((n) => n());
}
var Ns = (() => {
    let t = class t {};
    t.__NG_ELEMENT_ID__ = RD;
    let e = t;
    return e;
})();
function RD(e) {
    return PD(V(), E(), (e & 16) === 16);
}
function PD(e, t, n) {
    if (Nr(e) && !n) {
        let r = ke(e.index, t);
        return new nt(r, r);
    } else if (e.type & 47) {
        let r = t[ue];
        return new nt(r, t);
    }
    return null;
}
var Ri = class {
        constructor() {}
        supports(t) {
            return Dl(t);
        }
        create(t) {
            return new Pi(t);
        }
    },
    kD = (e, t) => t,
    Pi = class {
        constructor(t) {
            (this.length = 0),
                (this._linkedRecords = null),
                (this._unlinkedRecords = null),
                (this._previousItHead = null),
                (this._itHead = null),
                (this._itTail = null),
                (this._additionsHead = null),
                (this._additionsTail = null),
                (this._movesHead = null),
                (this._movesTail = null),
                (this._removalsHead = null),
                (this._removalsTail = null),
                (this._identityChangesHead = null),
                (this._identityChangesTail = null),
                (this._trackByFn = t || kD);
        }
        forEachItem(t) {
            let n;
            for (n = this._itHead; n !== null; n = n._next) t(n);
        }
        forEachOperation(t) {
            let n = this._itHead,
                r = this._removalsHead,
                o = 0,
                i = null;
            for (; n || r; ) {
                let s = !r || (n && n.currentIndex < uu(r, o, i)) ? n : r,
                    a = uu(s, o, i),
                    u = s.currentIndex;
                if (s === r) o--, (r = r._nextRemoved);
                else if (((n = n._next), s.previousIndex == null)) o++;
                else {
                    i || (i = []);
                    let c = a - o,
                        l = u - o;
                    if (c != l) {
                        for (let f = 0; f < c; f++) {
                            let p = f < i.length ? i[f] : (i[f] = 0),
                                h = p + f;
                            l <= h && h < c && (i[f] = p + 1);
                        }
                        let d = s.previousIndex;
                        i[d] = l - c;
                    }
                }
                a !== u && t(s, a, u);
            }
        }
        forEachPreviousItem(t) {
            let n;
            for (n = this._previousItHead; n !== null; n = n._nextPrevious)
                t(n);
        }
        forEachAddedItem(t) {
            let n;
            for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
            let n;
            for (n = this._movesHead; n !== null; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
            let n;
            for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
            let n;
            for (
                n = this._identityChangesHead;
                n !== null;
                n = n._nextIdentityChange
            )
                t(n);
        }
        diff(t) {
            if ((t == null && (t = []), !Dl(t))) throw new _(900, !1);
            return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
            this._reset();
            let n = this._itHead,
                r = !1,
                o,
                i,
                s;
            if (Array.isArray(t)) {
                this.length = t.length;
                for (let a = 0; a < this.length; a++)
                    (i = t[a]),
                        (s = this._trackByFn(a, i)),
                        n === null || !Object.is(n.trackById, s)
                            ? ((n = this._mismatch(n, i, s, a)), (r = !0))
                            : (r && (n = this._verifyReinsertion(n, i, s, a)),
                              Object.is(n.item, i) ||
                                  this._addIdentityChange(n, i)),
                        (n = n._next);
            } else
                (o = 0),
                    sy(t, (a) => {
                        (s = this._trackByFn(o, a)),
                            n === null || !Object.is(n.trackById, s)
                                ? ((n = this._mismatch(n, a, s, o)), (r = !0))
                                : (r &&
                                      (n = this._verifyReinsertion(n, a, s, o)),
                                  Object.is(n.item, a) ||
                                      this._addIdentityChange(n, a)),
                            (n = n._next),
                            o++;
                    }),
                    (this.length = o);
            return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
            return (
                this._additionsHead !== null ||
                this._movesHead !== null ||
                this._removalsHead !== null ||
                this._identityChangesHead !== null
            );
        }
        _reset() {
            if (this.isDirty) {
                let t;
                for (
                    t = this._previousItHead = this._itHead;
                    t !== null;
                    t = t._next
                )
                    t._nextPrevious = t._next;
                for (t = this._additionsHead; t !== null; t = t._nextAdded)
                    t.previousIndex = t.currentIndex;
                for (
                    this._additionsHead = this._additionsTail = null,
                        t = this._movesHead;
                    t !== null;
                    t = t._nextMoved
                )
                    t.previousIndex = t.currentIndex;
                (this._movesHead = this._movesTail = null),
                    (this._removalsHead = this._removalsTail = null),
                    (this._identityChangesHead = this._identityChangesTail =
                        null);
            }
        }
        _mismatch(t, n, r, o) {
            let i;
            return (
                t === null
                    ? (i = this._itTail)
                    : ((i = t._prev), this._remove(t)),
                (t =
                    this._unlinkedRecords === null
                        ? null
                        : this._unlinkedRecords.get(r, null)),
                t !== null
                    ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                      this._reinsertAfter(t, i, o))
                    : ((t =
                          this._linkedRecords === null
                              ? null
                              : this._linkedRecords.get(r, o)),
                      t !== null
                          ? (Object.is(t.item, n) ||
                                this._addIdentityChange(t, n),
                            this._moveAfter(t, i, o))
                          : (t = this._addAfter(new ki(n, r), i, o))),
                t
            );
        }
        _verifyReinsertion(t, n, r, o) {
            let i =
                this._unlinkedRecords === null
                    ? null
                    : this._unlinkedRecords.get(r, null);
            return (
                i !== null
                    ? (t = this._reinsertAfter(i, t._prev, o))
                    : t.currentIndex != o &&
                      ((t.currentIndex = o), this._addToMoves(t, o)),
                t
            );
        }
        _truncate(t) {
            for (; t !== null; ) {
                let n = t._next;
                this._addToRemovals(this._unlink(t)), (t = n);
            }
            this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
                this._additionsTail !== null &&
                    (this._additionsTail._nextAdded = null),
                this._movesTail !== null && (this._movesTail._nextMoved = null),
                this._itTail !== null && (this._itTail._next = null),
                this._removalsTail !== null &&
                    (this._removalsTail._nextRemoved = null),
                this._identityChangesTail !== null &&
                    (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
            this._unlinkedRecords !== null && this._unlinkedRecords.remove(t);
            let o = t._prevRemoved,
                i = t._nextRemoved;
            return (
                o === null ? (this._removalsHead = i) : (o._nextRemoved = i),
                i === null ? (this._removalsTail = o) : (i._prevRemoved = o),
                this._insertAfter(t, n, r),
                this._addToMoves(t, r),
                t
            );
        }
        _moveAfter(t, n, r) {
            return (
                this._unlink(t),
                this._insertAfter(t, n, r),
                this._addToMoves(t, r),
                t
            );
        }
        _addAfter(t, n, r) {
            return (
                this._insertAfter(t, n, r),
                this._additionsTail === null
                    ? (this._additionsTail = this._additionsHead = t)
                    : (this._additionsTail = this._additionsTail._nextAdded =
                          t),
                t
            );
        }
        _insertAfter(t, n, r) {
            let o = n === null ? this._itHead : n._next;
            return (
                (t._next = o),
                (t._prev = n),
                o === null ? (this._itTail = t) : (o._prev = t),
                n === null ? (this._itHead = t) : (n._next = t),
                this._linkedRecords === null &&
                    (this._linkedRecords = new _r()),
                this._linkedRecords.put(t),
                (t.currentIndex = r),
                t
            );
        }
        _remove(t) {
            return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
            this._linkedRecords !== null && this._linkedRecords.remove(t);
            let n = t._prev,
                r = t._next;
            return (
                n === null ? (this._itHead = r) : (n._next = r),
                r === null ? (this._itTail = n) : (r._prev = n),
                t
            );
        }
        _addToMoves(t, n) {
            return (
                t.previousIndex === n ||
                    (this._movesTail === null
                        ? (this._movesTail = this._movesHead = t)
                        : (this._movesTail = this._movesTail._nextMoved = t)),
                t
            );
        }
        _addToRemovals(t) {
            return (
                this._unlinkedRecords === null &&
                    (this._unlinkedRecords = new _r()),
                this._unlinkedRecords.put(t),
                (t.currentIndex = null),
                (t._nextRemoved = null),
                this._removalsTail === null
                    ? ((this._removalsTail = this._removalsHead = t),
                      (t._prevRemoved = null))
                    : ((t._prevRemoved = this._removalsTail),
                      (this._removalsTail = this._removalsTail._nextRemoved =
                          t)),
                t
            );
        }
        _addIdentityChange(t, n) {
            return (
                (t.item = n),
                this._identityChangesTail === null
                    ? (this._identityChangesTail = this._identityChangesHead =
                          t)
                    : (this._identityChangesTail =
                          this._identityChangesTail._nextIdentityChange =
                              t),
                t
            );
        }
    },
    ki = class {
        constructor(t, n) {
            (this.item = t),
                (this.trackById = n),
                (this.currentIndex = null),
                (this.previousIndex = null),
                (this._nextPrevious = null),
                (this._prev = null),
                (this._next = null),
                (this._prevDup = null),
                (this._nextDup = null),
                (this._prevRemoved = null),
                (this._nextRemoved = null),
                (this._nextAdded = null),
                (this._nextMoved = null),
                (this._nextIdentityChange = null);
        }
    },
    Li = class {
        constructor() {
            (this._head = null), (this._tail = null);
        }
        add(t) {
            this._head === null
                ? ((this._head = this._tail = t),
                  (t._nextDup = null),
                  (t._prevDup = null))
                : ((this._tail._nextDup = t),
                  (t._prevDup = this._tail),
                  (t._nextDup = null),
                  (this._tail = t));
        }
        get(t, n) {
            let r;
            for (r = this._head; r !== null; r = r._nextDup)
                if (
                    (n === null || n <= r.currentIndex) &&
                    Object.is(r.trackById, t)
                )
                    return r;
            return null;
        }
        remove(t) {
            let n = t._prevDup,
                r = t._nextDup;
            return (
                n === null ? (this._head = r) : (n._nextDup = r),
                r === null ? (this._tail = n) : (r._prevDup = n),
                this._head === null
            );
        }
    },
    _r = class {
        constructor() {
            this.map = new Map();
        }
        put(t) {
            let n = t.trackById,
                r = this.map.get(n);
            r || ((r = new Li()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
            let r = t,
                o = this.map.get(r);
            return o ? o.get(t, n) : null;
        }
        remove(t) {
            let n = t.trackById;
            return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
            return this.map.size === 0;
        }
        clear() {
            this.map.clear();
        }
    };
function uu(e, t, n) {
    let r = e.previousIndex;
    if (r === null) return r;
    let o = 0;
    return n && r < n.length && (o = n[r]), r + t + o;
}
function cu() {
    return new As([new Ri()]);
}
var As = (() => {
    let t = class t {
        constructor(r) {
            this.factories = r;
        }
        static create(r, o) {
            if (o != null) {
                let i = o.factories.slice();
                r = r.concat(i);
            }
            return new t(r);
        }
        static extend(r) {
            return {
                provide: t,
                useFactory: (o) => t.create(r, o || cu()),
                deps: [[t, new Of(), new Af()]],
            };
        }
        find(r) {
            let o = this.factories.find((i) => i.supports(r));
            if (o != null) return o;
            throw new _(901, !1);
        }
    };
    t.ɵprov = O({ token: t, providedIn: "root", factory: cu });
    let e = t;
    return e;
})();
var CM = ND(null, "core", []),
    bM = (() => {
        let t = class t {
            constructor(r) {}
        };
        (t.ɵfac = function (o) {
            return new (o || t)(R(Ss));
        }),
            (t.ɵmod = zi({ type: t })),
            (t.ɵinj = Bi({}));
        let e = t;
        return e;
    })();
function LD(e) {
    return typeof e == "boolean" ? e : e != null && e !== "false";
}
function jD(e, t = NaN) {
    return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t;
}
var VD = new T("", { providedIn: "root", factory: () => S(BD) }),
    BD = (() => {
        let t = class t {};
        t.ɵprov = O({ token: t, providedIn: "root", factory: () => new ji() });
        let e = t;
        return e;
    })(),
    ji = class {
        constructor() {
            (this.queuedEffectCount = 0),
                (this.queues = new Map()),
                (this.pendingTasks = S(_s)),
                (this.taskId = null);
        }
        scheduleEffect(t) {
            if ((this.enqueue(t), this.taskId === null)) {
                let n = (this.taskId = this.pendingTasks.add());
                queueMicrotask(() => {
                    this.flush(),
                        this.pendingTasks.remove(n),
                        (this.taskId = null);
                });
            }
        }
        enqueue(t) {
            let n = t.creationZone;
            this.queues.has(n) || this.queues.set(n, new Set());
            let r = this.queues.get(n);
            r.has(t) || (this.queuedEffectCount++, r.add(t));
        }
        flush() {
            for (; this.queuedEffectCount > 0; )
                for (let [t, n] of this.queues)
                    t === null
                        ? this.flushQueue(n)
                        : t.run(() => this.flushQueue(n));
        }
        flushQueue(t) {
            for (let n of t) t.delete(n), this.queuedEffectCount--, n.run();
        }
    },
    Vi = class {
        constructor(t, n, r, o, i, s) {
            (this.scheduler = t),
                (this.effectFn = n),
                (this.creationZone = r),
                (this.injector = i),
                (this.watcher = Ws(
                    (a) => this.runEffect(a),
                    () => this.schedule(),
                    s
                )),
                (this.unregisterOnDestroy = o?.onDestroy(() => this.destroy()));
        }
        runEffect(t) {
            try {
                this.effectFn(t);
            } catch (n) {
                this.injector.get(Fe, null, { optional: !0 })?.handleError(n);
            }
        }
        run() {
            this.watcher.run();
        }
        schedule() {
            this.scheduler.scheduleEffect(this);
        }
        destroy() {
            this.watcher.destroy(), this.unregisterOnDestroy?.();
        }
    };
function $D(e, t) {
    dn("NgSignals"), !t?.injector && Vu($D);
    let n = t?.injector ?? S(Le),
        r = t?.manualCleanup !== !0 ? n.get(kr) : null,
        o = new Vi(
            n.get(VD),
            e,
            typeof Zone > "u" ? null : Zone.current,
            r,
            n,
            t?.allowSignalWrites ?? !1
        ),
        i = n.get(Ns, null, { optional: !0 });
    return (
        !i || !(i._lView[m] & 8)
            ? o.watcher.notify()
            : (i._lView[Zn] ??= []).push(o.watcher.notify),
        o
    );
}
function _M(e) {
    let t = Ne(e);
    if (!t) return null;
    let n = new Rt(t);
    return {
        get selector() {
            return n.selector;
        },
        get type() {
            return n.componentType;
        },
        get inputs() {
            return n.inputs;
        },
        get outputs() {
            return n.outputs;
        },
        get ngContentSelectors() {
            return n.ngContentSelectors;
        },
        get isStandalone() {
            return t.standalone;
        },
        get isSignal() {
            return t.signals;
        },
    };
}
var ql = null;
function Os() {
    return ql;
}
function KM(e) {
    ql ??= e;
}
var $l = class {};
var Ls = new T(""),
    js = (() => {
        let t = class t {
            historyGo(r) {
                throw new Error("");
            }
        };
        (t.ɵfac = function (o) {
            return new (o || t)();
        }),
            (t.ɵprov = O({
                token: t,
                factory: () => S(UD),
                providedIn: "platform",
            }));
        let e = t;
        return e;
    })(),
    JM = new T(""),
    UD = (() => {
        let t = class t extends js {
            constructor() {
                super(),
                    (this._doc = S(Ls)),
                    (this._location = window.location),
                    (this._history = window.history);
            }
            getBaseHrefFromDOM() {
                return Os().getBaseHref(this._doc);
            }
            onPopState(r) {
                let o = Os().getGlobalEventTarget(this._doc, "window");
                return (
                    o.addEventListener("popstate", r, !1),
                    () => o.removeEventListener("popstate", r)
                );
            }
            onHashChange(r) {
                let o = Os().getGlobalEventTarget(this._doc, "window");
                return (
                    o.addEventListener("hashchange", r, !1),
                    () => o.removeEventListener("hashchange", r)
                );
            }
            get href() {
                return this._location.href;
            }
            get protocol() {
                return this._location.protocol;
            }
            get hostname() {
                return this._location.hostname;
            }
            get port() {
                return this._location.port;
            }
            get pathname() {
                return this._location.pathname;
            }
            get search() {
                return this._location.search;
            }
            get hash() {
                return this._location.hash;
            }
            set pathname(r) {
                this._location.pathname = r;
            }
            pushState(r, o, i) {
                this._history.pushState(r, o, i);
            }
            replaceState(r, o, i) {
                this._history.replaceState(r, o, i);
            }
            forward() {
                this._history.forward();
            }
            back() {
                this._history.back();
            }
            historyGo(r = 0) {
                this._history.go(r);
            }
            getState() {
                return this._history.state;
            }
        };
        (t.ɵfac = function (o) {
            return new (o || t)();
        }),
            (t.ɵprov = O({
                token: t,
                factory: () => new t(),
                providedIn: "platform",
            }));
        let e = t;
        return e;
    })();
function Vs(e, t) {
    if (e.length == 0) return t;
    if (t.length == 0) return e;
    let n = 0;
    return (
        e.endsWith("/") && n++,
        t.startsWith("/") && n++,
        n == 2 ? e + t.substring(1) : n == 1 ? e + t : e + "/" + t
    );
}
function Hl(e) {
    let t = e.match(/#|\?|$/),
        n = (t && t.index) || e.length,
        r = n - (e[n - 1] === "/" ? 1 : 0);
    return e.slice(0, r) + e.slice(n);
}
function Me(e) {
    return e && e[0] !== "?" ? "?" + e : e;
}
var Gr = (() => {
        let t = class t {
            historyGo(r) {
                throw new Error("");
            }
        };
        (t.ɵfac = function (o) {
            return new (o || t)();
        }),
            (t.ɵprov = O({
                token: t,
                factory: () => S(GD),
                providedIn: "root",
            }));
        let e = t;
        return e;
    })(),
    Yl = new T(""),
    GD = (() => {
        let t = class t extends Gr {
            constructor(r, o) {
                super(),
                    (this._platformLocation = r),
                    (this._removeListenerFns = []),
                    (this._baseHref =
                        o ??
                        this._platformLocation.getBaseHrefFromDOM() ??
                        S(Ls).location?.origin ??
                        "");
            }
            ngOnDestroy() {
                for (; this._removeListenerFns.length; )
                    this._removeListenerFns.pop()();
            }
            onPopState(r) {
                this._removeListenerFns.push(
                    this._platformLocation.onPopState(r),
                    this._platformLocation.onHashChange(r)
                );
            }
            getBaseHref() {
                return this._baseHref;
            }
            prepareExternalUrl(r) {
                return Vs(this._baseHref, r);
            }
            path(r = !1) {
                let o =
                        this._platformLocation.pathname +
                        Me(this._platformLocation.search),
                    i = this._platformLocation.hash;
                return i && r ? `${o}${i}` : o;
            }
            pushState(r, o, i, s) {
                let a = this.prepareExternalUrl(i + Me(s));
                this._platformLocation.pushState(r, o, a);
            }
            replaceState(r, o, i, s) {
                let a = this.prepareExternalUrl(i + Me(s));
                this._platformLocation.replaceState(r, o, a);
            }
            forward() {
                this._platformLocation.forward();
            }
            back() {
                this._platformLocation.back();
            }
            getState() {
                return this._platformLocation.getState();
            }
            historyGo(r = 0) {
                this._platformLocation.historyGo?.(r);
            }
        };
        (t.ɵfac = function (o) {
            return new (o || t)(R(js), R(Yl, 8));
        }),
            (t.ɵprov = O({ token: t, factory: t.ɵfac, providedIn: "root" }));
        let e = t;
        return e;
    })(),
    XM = (() => {
        let t = class t extends Gr {
            constructor(r, o) {
                super(),
                    (this._platformLocation = r),
                    (this._baseHref = ""),
                    (this._removeListenerFns = []),
                    o != null && (this._baseHref = o);
            }
            ngOnDestroy() {
                for (; this._removeListenerFns.length; )
                    this._removeListenerFns.pop()();
            }
            onPopState(r) {
                this._removeListenerFns.push(
                    this._platformLocation.onPopState(r),
                    this._platformLocation.onHashChange(r)
                );
            }
            getBaseHref() {
                return this._baseHref;
            }
            path(r = !1) {
                let o = this._platformLocation.hash ?? "#";
                return o.length > 0 ? o.substring(1) : o;
            }
            prepareExternalUrl(r) {
                let o = Vs(this._baseHref, r);
                return o.length > 0 ? "#" + o : o;
            }
            pushState(r, o, i, s) {
                let a = this.prepareExternalUrl(i + Me(s));
                a.length == 0 && (a = this._platformLocation.pathname),
                    this._platformLocation.pushState(r, o, a);
            }
            replaceState(r, o, i, s) {
                let a = this.prepareExternalUrl(i + Me(s));
                a.length == 0 && (a = this._platformLocation.pathname),
                    this._platformLocation.replaceState(r, o, a);
            }
            forward() {
                this._platformLocation.forward();
            }
            back() {
                this._platformLocation.back();
            }
            getState() {
                return this._platformLocation.getState();
            }
            historyGo(r = 0) {
                this._platformLocation.historyGo?.(r);
            }
        };
        (t.ɵfac = function (o) {
            return new (o || t)(R(js), R(Yl, 8));
        }),
            (t.ɵprov = O({ token: t, factory: t.ɵfac }));
        let e = t;
        return e;
    })(),
    zD = (() => {
        let t = class t {
            constructor(r) {
                (this._subject = new ie()),
                    (this._urlChangeListeners = []),
                    (this._urlChangeSubscription = null),
                    (this._locationStrategy = r);
                let o = this._locationStrategy.getBaseHref();
                (this._basePath = YD(Hl(Ul(o)))),
                    this._locationStrategy.onPopState((i) => {
                        this._subject.emit({
                            url: this.path(!0),
                            pop: !0,
                            state: i.state,
                            type: i.type,
                        });
                    });
            }
            ngOnDestroy() {
                this._urlChangeSubscription?.unsubscribe(),
                    (this._urlChangeListeners = []);
            }
            path(r = !1) {
                return this.normalize(this._locationStrategy.path(r));
            }
            getState() {
                return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(r, o = "") {
                return this.path() == this.normalize(r + Me(o));
            }
            normalize(r) {
                return t.stripTrailingSlash(qD(this._basePath, Ul(r)));
            }
            prepareExternalUrl(r) {
                return (
                    r && r[0] !== "/" && (r = "/" + r),
                    this._locationStrategy.prepareExternalUrl(r)
                );
            }
            go(r, o = "", i = null) {
                this._locationStrategy.pushState(i, "", r, o),
                    this._notifyUrlChangeListeners(
                        this.prepareExternalUrl(r + Me(o)),
                        i
                    );
            }
            replaceState(r, o = "", i = null) {
                this._locationStrategy.replaceState(i, "", r, o),
                    this._notifyUrlChangeListeners(
                        this.prepareExternalUrl(r + Me(o)),
                        i
                    );
            }
            forward() {
                this._locationStrategy.forward();
            }
            back() {
                this._locationStrategy.back();
            }
            historyGo(r = 0) {
                this._locationStrategy.historyGo?.(r);
            }
            onUrlChange(r) {
                return (
                    this._urlChangeListeners.push(r),
                    (this._urlChangeSubscription ??= this.subscribe((o) => {
                        this._notifyUrlChangeListeners(o.url, o.state);
                    })),
                    () => {
                        let o = this._urlChangeListeners.indexOf(r);
                        this._urlChangeListeners.splice(o, 1),
                            this._urlChangeListeners.length === 0 &&
                                (this._urlChangeSubscription?.unsubscribe(),
                                (this._urlChangeSubscription = null));
                    }
                );
            }
            _notifyUrlChangeListeners(r = "", o) {
                this._urlChangeListeners.forEach((i) => i(r, o));
            }
            subscribe(r, o, i) {
                return this._subject.subscribe({
                    next: r,
                    error: o,
                    complete: i,
                });
            }
        };
        (t.normalizeQueryParams = Me),
            (t.joinWithSlash = Vs),
            (t.stripTrailingSlash = Hl),
            (t.ɵfac = function (o) {
                return new (o || t)(R(Gr));
            }),
            (t.ɵprov = O({
                token: t,
                factory: () => WD(),
                providedIn: "root",
            }));
        let e = t;
        return e;
    })();
function WD() {
    return new zD(R(Gr));
}
function qD(e, t) {
    if (!e || !t.startsWith(e)) return t;
    let n = t.substring(e.length);
    return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t;
}
function Ul(e) {
    return e.replace(/\/index.html$/, "");
}
function YD(e) {
    if (new RegExp("^(https?:)?//").test(e)) {
        let [, n] = e.split(/\/\/[^\/]+/);
        return n;
    }
    return e;
}
function ex(e, t) {
    t = encodeURIComponent(t);
    for (let n of e.split(";")) {
        let r = n.indexOf("="),
            [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
        if (o.trim() === t) return decodeURIComponent(i);
    }
    return null;
}
var Fs = class {
        constructor(t, n, r, o) {
            (this.$implicit = t),
                (this.ngForOf = n),
                (this.index = r),
                (this.count = o);
        }
        get first() {
            return this.index === 0;
        }
        get last() {
            return this.index === this.count - 1;
        }
        get even() {
            return this.index % 2 === 0;
        }
        get odd() {
            return !this.even;
        }
    },
    tx = (() => {
        let t = class t {
            set ngForOf(r) {
                (this._ngForOf = r), (this._ngForOfDirty = !0);
            }
            set ngForTrackBy(r) {
                this._trackByFn = r;
            }
            get ngForTrackBy() {
                return this._trackByFn;
            }
            constructor(r, o, i) {
                (this._viewContainer = r),
                    (this._template = o),
                    (this._differs = i),
                    (this._ngForOf = null),
                    (this._ngForOfDirty = !0),
                    (this._differ = null);
            }
            set ngForTemplate(r) {
                r && (this._template = r);
            }
            ngDoCheck() {
                if (this._ngForOfDirty) {
                    this._ngForOfDirty = !1;
                    let r = this._ngForOf;
                    if (!this._differ && r)
                        if (0)
                            try {
                            } catch {}
                        else
                            this._differ = this._differs
                                .find(r)
                                .create(this.ngForTrackBy);
                }
                if (this._differ) {
                    let r = this._differ.diff(this._ngForOf);
                    r && this._applyChanges(r);
                }
            }
            _applyChanges(r) {
                let o = this._viewContainer;
                r.forEachOperation((i, s, a) => {
                    if (i.previousIndex == null)
                        o.createEmbeddedView(
                            this._template,
                            new Fs(i.item, this._ngForOf, -1, -1),
                            a === null ? void 0 : a
                        );
                    else if (a == null) o.remove(s === null ? void 0 : s);
                    else if (s !== null) {
                        let u = o.get(s);
                        o.move(u, a), Gl(u, i);
                    }
                });
                for (let i = 0, s = o.length; i < s; i++) {
                    let u = o.get(i).context;
                    (u.index = i), (u.count = s), (u.ngForOf = this._ngForOf);
                }
                r.forEachIdentityChange((i) => {
                    let s = o.get(i.currentIndex);
                    Gl(s, i);
                });
            }
            static ngTemplateContextGuard(r, o) {
                return !0;
            }
        };
        (t.ɵfac = function (o) {
            return new (o || t)(_e(Bt), _e(rt), _e(As));
        }),
            (t.ɵdir = Wi({
                type: t,
                selectors: [["", "ngFor", "", "ngForOf", ""]],
                inputs: {
                    ngForOf: "ngForOf",
                    ngForTrackBy: "ngForTrackBy",
                    ngForTemplate: "ngForTemplate",
                },
                standalone: !0,
            }));
        let e = t;
        return e;
    })();
function Gl(e, t) {
    e.context.$implicit = t.item;
}
var nx = (() => {
        let t = class t {
            constructor(r, o) {
                (this._viewContainer = r),
                    (this._context = new Rs()),
                    (this._thenTemplateRef = null),
                    (this._elseTemplateRef = null),
                    (this._thenViewRef = null),
                    (this._elseViewRef = null),
                    (this._thenTemplateRef = o);
            }
            set ngIf(r) {
                (this._context.$implicit = this._context.ngIf = r),
                    this._updateView();
            }
            set ngIfThen(r) {
                zl("ngIfThen", r),
                    (this._thenTemplateRef = r),
                    (this._thenViewRef = null),
                    this._updateView();
            }
            set ngIfElse(r) {
                zl("ngIfElse", r),
                    (this._elseTemplateRef = r),
                    (this._elseViewRef = null),
                    this._updateView();
            }
            _updateView() {
                this._context.$implicit
                    ? this._thenViewRef ||
                      (this._viewContainer.clear(),
                      (this._elseViewRef = null),
                      this._thenTemplateRef &&
                          (this._thenViewRef =
                              this._viewContainer.createEmbeddedView(
                                  this._thenTemplateRef,
                                  this._context
                              )))
                    : this._elseViewRef ||
                      (this._viewContainer.clear(),
                      (this._thenViewRef = null),
                      this._elseTemplateRef &&
                          (this._elseViewRef =
                              this._viewContainer.createEmbeddedView(
                                  this._elseTemplateRef,
                                  this._context
                              )));
            }
            static ngTemplateContextGuard(r, o) {
                return !0;
            }
        };
        (t.ɵfac = function (o) {
            return new (o || t)(_e(Bt), _e(rt));
        }),
            (t.ɵdir = Wi({
                type: t,
                selectors: [["", "ngIf", ""]],
                inputs: {
                    ngIf: "ngIf",
                    ngIfThen: "ngIfThen",
                    ngIfElse: "ngIfElse",
                },
                standalone: !0,
            }));
        let e = t;
        return e;
    })(),
    Rs = class {
        constructor() {
            (this.$implicit = null), (this.ngIf = null);
        }
    };
function zl(e, t) {
    if (!!!(!t || t.createEmbeddedView))
        throw new Error(`${e} must be a TemplateRef, but received '${H(t)}'.`);
}
var rx = (() => {
        let t = class t {};
        (t.ɵfac = function (o) {
            return new (o || t)();
        }),
            (t.ɵmod = zi({ type: t })),
            (t.ɵinj = Bi({}));
        let e = t;
        return e;
    })(),
    QD = "browser",
    ZD = "server";
function KD(e) {
    return e === QD;
}
function ox(e) {
    return e === ZD;
}
var ix = (() => {
        let t = class t {};
        t.ɵprov = O({
            token: t,
            providedIn: "root",
            factory: () => (KD(S(ss)) ? new Ps(S(Ls), window) : new ks()),
        });
        let e = t;
        return e;
    })(),
    Ps = class {
        constructor(t, n) {
            (this.document = t),
                (this.window = n),
                (this.offset = () => [0, 0]);
        }
        setOffset(t) {
            Array.isArray(t) ? (this.offset = () => t) : (this.offset = t);
        }
        getScrollPosition() {
            return [this.window.scrollX, this.window.scrollY];
        }
        scrollToPosition(t) {
            this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
            let n = JD(this.document, t);
            n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(t) {
            this.window.history.scrollRestoration = t;
        }
        scrollToElement(t) {
            let n = t.getBoundingClientRect(),
                r = n.left + this.window.pageXOffset,
                o = n.top + this.window.pageYOffset,
                i = this.offset();
            this.window.scrollTo(r - i[0], o - i[1]);
        }
    };
function JD(e, t) {
    let n = e.getElementById(t) || e.getElementsByName(t)[0];
    if (n) return n;
    if (
        typeof e.createTreeWalker == "function" &&
        e.body &&
        typeof e.body.attachShadow == "function"
    ) {
        let r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT),
            o = r.currentNode;
        for (; o; ) {
            let i = o.shadowRoot;
            if (i) {
                let s = i.getElementById(t) || i.querySelector(`[name="${t}"]`);
                if (s) return s;
            }
            o = r.nextNode();
        }
    }
    return null;
}
var ks = class {
        setOffset(t) {}
        getScrollPosition() {
            return [0, 0];
        }
        scrollToPosition(t) {}
        scrollToAnchor(t) {}
        setHistoryScrollRestoration(t) {}
    },
    Wl = class {};
var at = (function (e) {
        return (
            (e[(e.State = 0)] = "State"),
            (e[(e.Transition = 1)] = "Transition"),
            (e[(e.Sequence = 2)] = "Sequence"),
            (e[(e.Group = 3)] = "Group"),
            (e[(e.Animate = 4)] = "Animate"),
            (e[(e.Keyframes = 5)] = "Keyframes"),
            (e[(e.Style = 6)] = "Style"),
            (e[(e.Trigger = 7)] = "Trigger"),
            (e[(e.Reference = 8)] = "Reference"),
            (e[(e.AnimateChild = 9)] = "AnimateChild"),
            (e[(e.AnimateRef = 10)] = "AnimateRef"),
            (e[(e.Query = 11)] = "Query"),
            (e[(e.Stagger = 12)] = "Stagger"),
            e
        );
    })(at || {}),
    ux = "*";
function cx(e, t) {
    return { type: at.Trigger, name: e, definitions: t, options: {} };
}
function lx(e, t = null) {
    return { type: at.Animate, styles: t, timings: e };
}
function dx(e, t = null) {
    return { type: at.Sequence, steps: e, options: t };
}
function fx(e) {
    return { type: at.Style, styles: e, offset: null };
}
function px(e, t, n) {
    return { type: at.State, name: e, styles: t, options: n };
}
function hx(e, t, n = null) {
    return { type: at.Transition, expr: e, animation: t, options: n };
}
var Ql = class {
        constructor(t = 0, n = 0) {
            (this._onDoneFns = []),
                (this._onStartFns = []),
                (this._onDestroyFns = []),
                (this._originalOnDoneFns = []),
                (this._originalOnStartFns = []),
                (this._started = !1),
                (this._destroyed = !1),
                (this._finished = !1),
                (this._position = 0),
                (this.parentPlayer = null),
                (this.totalTime = t + n);
        }
        _onFinish() {
            this._finished ||
                ((this._finished = !0),
                this._onDoneFns.forEach((t) => t()),
                (this._onDoneFns = []));
        }
        onStart(t) {
            this._originalOnStartFns.push(t), this._onStartFns.push(t);
        }
        onDone(t) {
            this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
        }
        onDestroy(t) {
            this._onDestroyFns.push(t);
        }
        hasStarted() {
            return this._started;
        }
        init() {}
        play() {
            this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
                (this._started = !0);
        }
        triggerMicrotask() {
            queueMicrotask(() => this._onFinish());
        }
        _onStart() {
            this._onStartFns.forEach((t) => t()), (this._onStartFns = []);
        }
        pause() {}
        restart() {}
        finish() {
            this._onFinish();
        }
        destroy() {
            this._destroyed ||
                ((this._destroyed = !0),
                this.hasStarted() || this._onStart(),
                this.finish(),
                this._onDestroyFns.forEach((t) => t()),
                (this._onDestroyFns = []));
        }
        reset() {
            (this._started = !1),
                (this._finished = !1),
                (this._onStartFns = this._originalOnStartFns),
                (this._onDoneFns = this._originalOnDoneFns);
        }
        setPosition(t) {
            this._position = this.totalTime ? t * this.totalTime : 1;
        }
        getPosition() {
            return this.totalTime ? this._position / this.totalTime : 1;
        }
        triggerCallback(t) {
            let n = t == "start" ? this._onStartFns : this._onDoneFns;
            n.forEach((r) => r()), (n.length = 0);
        }
    },
    Zl = class {
        constructor(t) {
            (this._onDoneFns = []),
                (this._onStartFns = []),
                (this._finished = !1),
                (this._started = !1),
                (this._destroyed = !1),
                (this._onDestroyFns = []),
                (this.parentPlayer = null),
                (this.totalTime = 0),
                (this.players = t);
            let n = 0,
                r = 0,
                o = 0,
                i = this.players.length;
            i == 0
                ? queueMicrotask(() => this._onFinish())
                : this.players.forEach((s) => {
                      s.onDone(() => {
                          ++n == i && this._onFinish();
                      }),
                          s.onDestroy(() => {
                              ++r == i && this._onDestroy();
                          }),
                          s.onStart(() => {
                              ++o == i && this._onStart();
                          });
                  }),
                (this.totalTime = this.players.reduce(
                    (s, a) => Math.max(s, a.totalTime),
                    0
                ));
        }
        _onFinish() {
            this._finished ||
                ((this._finished = !0),
                this._onDoneFns.forEach((t) => t()),
                (this._onDoneFns = []));
        }
        init() {
            this.players.forEach((t) => t.init());
        }
        onStart(t) {
            this._onStartFns.push(t);
        }
        _onStart() {
            this.hasStarted() ||
                ((this._started = !0),
                this._onStartFns.forEach((t) => t()),
                (this._onStartFns = []));
        }
        onDone(t) {
            this._onDoneFns.push(t);
        }
        onDestroy(t) {
            this._onDestroyFns.push(t);
        }
        hasStarted() {
            return this._started;
        }
        play() {
            this.parentPlayer || this.init(),
                this._onStart(),
                this.players.forEach((t) => t.play());
        }
        pause() {
            this.players.forEach((t) => t.pause());
        }
        restart() {
            this.players.forEach((t) => t.restart());
        }
        finish() {
            this._onFinish(), this.players.forEach((t) => t.finish());
        }
        destroy() {
            this._onDestroy();
        }
        _onDestroy() {
            this._destroyed ||
                ((this._destroyed = !0),
                this._onFinish(),
                this.players.forEach((t) => t.destroy()),
                this._onDestroyFns.forEach((t) => t()),
                (this._onDestroyFns = []));
        }
        reset() {
            this.players.forEach((t) => t.reset()),
                (this._destroyed = !1),
                (this._finished = !1),
                (this._started = !1);
        }
        setPosition(t) {
            let n = t * this.totalTime;
            this.players.forEach((r) => {
                let o = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
                r.setPosition(o);
            });
        }
        getPosition() {
            let t = this.players.reduce(
                (n, r) => (n === null || r.totalTime > n.totalTime ? r : n),
                null
            );
            return t != null ? t.getPosition() : 0;
        }
        beforeDestroy() {
            this.players.forEach((t) => {
                t.beforeDestroy && t.beforeDestroy();
            });
        }
        triggerCallback(t) {
            let n = t == "start" ? this._onStartFns : this._onDoneFns;
            n.forEach((r) => r()), (n.length = 0);
        }
    },
    gx = "!";
export {
    xe as a,
    lt as b,
    XD as c,
    nd as d,
    L as e,
    pd as f,
    C as g,
    uo as h,
    co as i,
    ce as j,
    $t as k,
    vd as l,
    Ge as m,
    de as n,
    xd as o,
    Sd as p,
    Td as q,
    We as r,
    De as s,
    Ld as t,
    ne as u,
    Gt as v,
    It as w,
    Vd as x,
    Bd as y,
    go as z,
    qd as A,
    qe as B,
    Yd as C,
    wa as D,
    Qd as E,
    Zd as F,
    zt as G,
    wt as H,
    mo as I,
    Kd as J,
    Jd as K,
    tf as L,
    ba as M,
    Do as N,
    nf as O,
    rf as P,
    of as Q,
    sf as R,
    af as S,
    uf as T,
    cf as U,
    lf as V,
    _ as W,
    ve as X,
    pu as Y,
    O as Z,
    Bi as _,
    R_ as $,
    T as aa,
    b as ba,
    R as ca,
    S as da,
    Af as ea,
    Of as fa,
    Qt as ga,
    Ze as ha,
    P_ as ia,
    zi as ja,
    Wi as ka,
    k_ as la,
    ku as ma,
    Ae as na,
    fp as oa,
    Uu as pa,
    L_ as qa,
    j_ as ra,
    V_ as sa,
    B_ as ta,
    oh as ua,
    Le as va,
    Fe as wa,
    jt as xa,
    ie as ya,
    Qo as za,
    $_ as Aa,
    H_ as Ba,
    mh as Ca,
    ss as Da,
    U_ as Ea,
    G_ as Fa,
    cn as Ga,
    Mc as Ha,
    z_ as Ia,
    W_ as Ja,
    q_ as Ka,
    Y_ as La,
    Q_ as Ma,
    xc as Na,
    Z_ as Oa,
    us as Pa,
    Bh as Qa,
    K_ as Ra,
    dr as Sa,
    J_ as Ta,
    _e as Ua,
    X_ as Va,
    rt as Wa,
    gr as Xa,
    Ur as Ya,
    pi as Za,
    dl as _a,
    dn as $a,
    q as ab,
    ym as bb,
    Bt as cb,
    Um as db,
    Km as eb,
    ry as fb,
    _i as gb,
    iy as hb,
    _s as ib,
    dy as jb,
    hy as kb,
    _y as lb,
    My as mb,
    rM as nb,
    oM as ob,
    Ml as pb,
    xl as qb,
    $y as rb,
    Sl as sb,
    Tl as tb,
    Gy as ub,
    iM as vb,
    Yy as wb,
    sM as xb,
    aM as yb,
    uM as zb,
    Ky as Ab,
    cM as Bb,
    lM as Cb,
    dM as Db,
    fM as Eb,
    pM as Fb,
    hM as Gb,
    Xy as Hb,
    Ol as Ib,
    eD as Jb,
    gM as Kb,
    tD as Lb,
    mM as Mb,
    yM as Nb,
    DM as Ob,
    vM as Pb,
    IM as Qb,
    lD as Rb,
    dD as Sb,
    wM as Tb,
    fD as Ub,
    xs as Vb,
    hD as Wb,
    gD as Xb,
    Ss as Yb,
    EM as Zb,
    ND as _b,
    Ns as $b,
    As as ac,
    CM as bc,
    bM as cc,
    LD as dc,
    jD as ec,
    $D as fc,
    _M as gc,
    Os as hc,
    KM as ic,
    $l as jc,
    Ls as kc,
    JM as lc,
    Gr as mc,
    GD as nc,
    XM as oc,
    zD as pc,
    ex as qc,
    tx as rc,
    nx as sc,
    rx as tc,
    QD as uc,
    KD as vc,
    ox as wc,
    ix as xc,
    Wl as yc,
    at as zc,
    ux as Ac,
    cx as Bc,
    lx as Cc,
    dx as Dc,
    fx as Ec,
    px as Fc,
    hx as Gc,
    Ql as Hc,
    Zl as Ic,
    gx as Jc,
};
