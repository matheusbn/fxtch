# fxtch

![codecov](https://img.shields.io/codecov/c/gh/matheusbn/fxtch)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/fxtch)
![npm](https://img.shields.io/npm/v/fxtch)


Minimal wrapper around fetch for an easier API.

## Install

`npm install fxtch`

## Example

```javascript
await fxtch("https://example.com")

await fxtch
  .post("https://example.com")
  .set("Authorization", "Bearer <token>")  
  .send({ name: "Matheus" })

fxtch
  .get("https://example.com")
  .query({ limit: 50 })
  .then(console.log)

const api = fxtch
  .client()
  .baseUrl('https://example.com/')
  .set({ Authorization: 'blabla' })

await api.post('/users')
await api.post('/users')
```  
