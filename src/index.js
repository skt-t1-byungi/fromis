export default function fromis(exec) {
    return _fromis(false, exec)
}

function _fromis(sync, exec) {
    var _state = -1 // -1:pending, 0:resolved, 1:rejected
    var _val = null
    var _queue = []
    exec(function (v) {
        if (v && typeof v.then === 'function') {
            v.then(function (v) {
                done(0, v)
            }, reject)
        } else {
            done(0, v)
        }
    }, reject)
    function reject(err) {
        done(1, err)
    }
    return {
        then: then,
        catch: function (fn) {
            return then(null, fn)
        },
    }
    function done(state, val) {
        if (~_state) return
        _state = state
        _val = val
        if (sync) {
            flush()
        } else {
            setTimeout(flush)
        }
    }
    function flush() {
        _queue.forEach(function (arr) {
            arr[_state](_val)
        })
        _queue = null
    }
    function then(thener, catcher) {
        return _fromis(true, function (res, rej) {
            var arr = [
                thener ? wrap(thener) : res,
                catcher ? wrap(catcher) : rej,
            ]
            if (_queue) {
                _queue.push(arr)
            } else {
                arr[_state](_val)
            }
            function wrap(fn) {
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
}
