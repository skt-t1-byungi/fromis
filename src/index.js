export default function promis (exec) {
    var _state = -1 // -1:pending, 0:resolved, 1:rejected
    var _val = null
    var _queue = []
    exec(function (v) {
        if (v && typeof v.then === 'function') {
            v.then(function (v) { done(0, v) }, reject)
        } else {
            done(0, v)
        }
    }, reject)
    function reject (err) {
        done(1, err)
    }
    return {
        then: then,
        'catch': function (fn) { return then(null, fn) }
    }
    function done (state, val) {
        if (~_state) return
        _state = state
        _val = val
        _queue.forEach(function (arr) { arr[state]() })
        _queue = null
    }
    function then (thener, catcher) {
        return promis(function (res, rej) {
            push(
                thener ? wrap(thener) : res,
                catcher ? wrap(catcher) : rej
            )
            function wrap (fn) {
                return function (v) {
                    try {
                        v = fn(v)
                    } catch (err) {
                        return rej(err)
                    }
                    res(v)
                }
            }
        })
    }
    function push (thener, catcher) {
        var tick = setTimeout
        if (~_state) {
            tick(_state ? catcher : thener, 0, _val)
        } else {
            _queue.push([
                function () {
                    tick(thener, 0, _val)
                },
                function () {
                    tick(catcher, 0, _val)
                }
            ])
        }
    }
}
