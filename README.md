# Pinto Pinto (retired)

This was the Next.js client for Pinto Pinto. The client now lives in [soliskit/pinto](https://github.com/soliskit/pinto), where the signal server serves it as plain HTML, CSS and JavaScript. One app, one deploy, no build step.

Everything this repo did is covered there:

| Here                                                        | Now in pinto                                                                |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| Next.js pages and React components                          | `public/index.html`, `public/room.html`, `public/home.js`, `public/room.js` |
| Tailwind CSS                                                | `public/style.css`                                                          |
| Twilio SDK in `getServerSideProps` (first STUN server only) | `/config`, which calls Twilio's REST API and also returns TURN servers      |
| `haikunator` room names                                     | a short word list in `public/home.js`                                       |
| `test/` Express and EJS client                              | not needed; the real client is plain JavaScript now                         |

The last version of the Next.js app is in this repo's history, at commit [`8133c46`](https://github.com/soliskit/pinto-meet/tree/8133c46).

Until the `pintopinto` Vercel project is deleted, `vercel.json` makes it deploy `public/index.html`, a page pointing here, instead of trying to build Next.js.

## License

[GPL 3.0](LICENSE.md)
