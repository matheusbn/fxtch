# fxtch
A tiny (~1.2kb) wrapper around fetch for an easier API.

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
