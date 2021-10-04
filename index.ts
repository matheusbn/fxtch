import fxtch from './src'

// /api/characters?category=Better+Call+Saul

// const api = x.create('https://www.breakingbadapi.com/api')

async function main() {
  const res = await fxtch('https://www.breakingbadapi.com/api/characters')

  console.log(res)
}

main()
