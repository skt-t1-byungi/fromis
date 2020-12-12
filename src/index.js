export default function promis (exec) {
    var _state = 0 // 0:pending, 1:resolved, 2:rejected
    var _val = null
    var _queue = []
    exec(function (v) {
        if (v && typeof v.then === 'function') {
            v.then(function (v) { done(1, v) }, reject)
        } else {
            done(1, v)
        }
    }, reject)
    function reject (err) {
        done(2, err)
    }
    return {
        then: then,
        'catch': catch_
    }
    function done (state, val) {
        if (_state) return
        _state = state
        _val = val
        var i = state - 1
        _queue.forEach(function (arr) { arr[i]() })
        _queue = null
    }
    function then (thener, catcher) {
        return promis(function (res, rej) {
            push(
                thener ? createHandler(thener, res, rej) : res,
                catcher ? createHandler(catcher, res, rej) : rej
            )
        })
    }
    function catch_ (fn) {
        return then(fn)
    }
    function push (thener, catcher) {
        var tick = setTimeout
        if (_state) {
            tick(_state === 1 ? thener : catcher, 0, _val)
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

function createHandler (fn, res, rej) {
    return function (v) {
        try {
            v = fn(v)
        } catch (err) {
            return rej(err)
        }
        res(v)
    }
}
