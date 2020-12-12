import { test } from 'uvu'
import { is } from 'uvu/assert'

import promis from '.'

test('awaitable', async () => {
    is(1, await promis(res => res(1)))
})

test.run()
