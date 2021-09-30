import x from './lib/x.ts'

// /api/characters?category=Better+Call+Saul

const api = x.create('https://www.breakingbadapi.com/api')

const res = await api
  .get('/characters', {
    params: {
      category: 'Breaking Bad',
      limit: 1,
    },
  })
  .catch(error => {
    console.error('ERROR')
    console.error(error)
  })

console.log(res)

const h = new Headers()
h.append('Content-Type', 'application/json')
