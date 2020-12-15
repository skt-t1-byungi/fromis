import { test } from 'uvu'
import * as $ from 'uvu/assert'

import fromis from '.'

const buf = []
const push = v => (buf.push(v), v)
const clear = () => { buf.length = 0 }
const nextTick = (n = 1) => new Promise(function recur (res) {
    if (n--) {
        setTimeout(recur, 0, res)
    } else {
        res()
    }
})

test.before.each(clear)

test('resolve', async () => {
    $.is(await fromis(res => res('resolved')), 'resolved')
})

test('reject', async () => {
    let err
    try {
        await fromis((_, rej) => rej('rejected'))
    } catch (err_) {
        err = err_
    }
    $.is(err, 'rejected')
})

test('chaining', async () => {
    fromis(r => r(1))
        .then(push)
        .then(push)
        .then(v => v + 2)
        .then(push)
    $.equal(buf, [])
    await nextTick(4)
    $.equal(buf, [1, 1, 3])
})

test('catch', async () => {
    fromis((_, rej) => rej(1))
        .then(push)
        .then(push)
        .catch(v => v + 2)
        .then(push)
    await nextTick()
    $.equal(buf, [3])
})

test('flattening', async () => {
    fromis(r1 => r1(fromis(r2 => r2(1))))
        .then(push)
    await nextTick(2)
    $.equal(buf, [1])
    clear()

    fromis(r => r())
        .then(() => fromis(r => r(2)))
        .then(push)
    await nextTick(3)
    $.equal(buf, [2])
    clear()

    fromis(r => r(fromis((_, rej) => rej(3))))
        .then(push)
        .catch(v => v + 2)
        .then(push)
    await nextTick(4)
    $.equal(buf, [5])
    clear()

    fromis((_, rej) => rej())
        .catch(() => fromis(r => r(4)))
        .then(push)
    await nextTick(3)
    $.equal(buf, [4])
    clear()
})

test.run()
