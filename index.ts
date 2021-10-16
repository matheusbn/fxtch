import fxtch from './lib/index.js'

// /api/characters?category=Better+Call+Saul

// const api = x.create('https://www.breakingbadapi.com/api')
// Public APIS
;[
  'https://api.publicapis.org/entries',
  'https://catfact.ninja/fact',
  'https://api.coindesk.com/v1/bpi/currentprice.json',
  'https://www.boredapi.com/api/activity',
  'https://datausa.io/api/data?drilldowns=Nation&measures=Population',
  'https://dog.ceo/api/breeds/image/random',
  'https://api.ipify.org?format=json',
  'https://official-joke-api.appspot.com/random_joke',
  'https://randomuser.me/api/',
  'http://universities.hipolabs.com/search?country=United+States',
  'https://api.zippopotam.us/us/33162',
]

async function main() {
  const res = await fxtch('https://official-joke-api.appspot.com/random_joke')

  console.log(res)
}

main()
