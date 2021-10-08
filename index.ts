// import fxtch from './src'
import fetch from 'cross-fetch'

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
  // const res = await fxtch('https://www.breakingbadapi.com/api/characters')

  // console.log(res)
  // 'https://images.dog.ceo//breeds//spaniel-irish//n02102973_2763.jpg'

  const resposne = await fetch(
    'https://www.breakingbadapi.com/api/characters/5'
  ).then(async r => {
    console.log(r.headers.get('Content-Type'))
    const text = await r.formData()
    // const blob = await r.clone().blob()
    // const formData = await r.clone().formData()

    console.log(text)
    // console.log(blob)
  })
}

main()
