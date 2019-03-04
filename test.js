import test from 'ava'
import paramap from '.'

test('should map a single item', async t => {
  const iterable = (async function * () { yield 2 })()
  const mapper = async (value) => value * 2

  for await (const value of paramap(iterable, mapper)) {
    t.is(value, 4)
  }
})

test('should map may items', async t => {
  const iterable = (async function * () {
    for (let i = 0; i < 100; i++) {
      yield new Promise(resolve => setTimeout(() => resolve(i), 10))
    }
  })()
  const mapper = async value => {
    // console.log('inflight', value + 1)
    return new Promise(resolve => setTimeout(() => resolve(value + 1), 100))
  }

  let i = 1
  for await (const value of paramap(iterable, mapper)) {
    // console.log(value)
    t.is(value, i)
    i++
  }

  t.is(i, 101)
})
