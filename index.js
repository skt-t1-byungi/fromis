function promis (exec) {
    var _state = 0 // 0:pending, 1:resolved, 2:rejected
    var _val = null
    var _queue = []
    exec(resolve, reject)
    return {
        then: then,
        catch: catch_
    }
    function resolve (v) {
        if (v && typeof v.then === 'function') {
            v.then(function (v) { done(1, v) })
        } else {
            done(1, v)
        }
    }
    function reject (err) {
        done(2, err)
    }
    function done (state, val) {
        if (_state > 0) return
        _state = state
        _val = val
        var i = state - 1
        _queue.forEach(function (arr) { arr[i]() })
        _queue = null
    }
    function then (fn) {
        return promis(function (res, rej) {
            push(createHandler(fn, res, rej), rej)
        })
    }
    function catch_ (fn) {
        return promis(function (res, rej) {
            push(res, createHandler(fn, res, rej))
        })
    }
    function push (then, catcher) {
        switch (_state) {
        case 0:
            _queue.push([
                function () {
                    setTimeout(then, 0, _val)
                },
                function () {
                    setTimeout(catcher, 0, _val)
                }
            ])
            break
        case 1:
            setTimeout(then, 0, _val)
            break
        case 2:
            setTimeout(catcher, 0, _val)
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
