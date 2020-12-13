import { test } from 'uvu'
import * as $ from 'uvu/assert'

import promis from '.'

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
    $.is(await promis(res => res('resolved')), 'resolved')
})

test('reject', async () => {
    let err
    try {
        await promis((_, rej) => rej('rejected'))
    } catch (err_) {
        err = err_
    }
    $.is(err, 'rejected')
})

test('chaining', async () => {
    promis(r => r(1))
        .then(push)
        .then(push)
        .then(v => v + 2)
        .then(push)
    $.equal(buf, [])
    await nextTick()
    $.equal(buf, [1])
    await nextTick(3)
    $.equal(buf, [1, 1, 3])
})

test('catch', async () => {
    promis((_, rej) => rej(1))
        .then(push)
        .then(push)
        .catch(v => v + 2)
        .then(push)
    await nextTick(4)
    $.equal(buf, [3])
})

test('flattening', async () => {
    promis(r1 => r1(promis(r2 => r2(1))))
        .then(push)
    await nextTick(2)
    $.equal(buf, [1])
    clear()

    promis(r => r())
        .then(() => promis(r => r(2)))
        .then(push)
    await nextTick(3)
    $.equal(buf, [2])
    clear()

    promis(r => r(promis((_, rej) => rej(3))))
        .then(push)
        .catch(v => v + 2)
        .then(push)
    await nextTick(4)
    $.equal(buf, [5])
    clear()

    promis((_, rej) => rej())
        .catch(() => promis(r => r(4)))
        .then(push)
    await nextTick(3)
    $.equal(buf, [4])
    clear()
})

test.run()
