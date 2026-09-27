# Pinto Pinto

Video conferencing for the rest of us. A [Next.js](https://nextjs.org) client that connects browsers directly with WebRTC through [PeerJS](https://peerjs.com/), using the [Pinto](https://github.com/soliskit/pinto) signal server to join rooms. Live at [meet.pintopinto.org](https://meet.pintopinto.org/).

Built with Next.js 16, React 19, Tailwind CSS 4 and TypeScript.

## Requirements

- [Node.js](https://nodejs.org) `22.x` (npm comes with it)
- A running [Pinto](https://github.com/soliskit/pinto) signal server
- A [Twilio](https://www.twilio.com/) account, used to fetch STUN servers for each room

## Getting started

Install dependencies:

```bash
npm install
```

Create a `.env.local` file (see [Configuration](#configuration)), then start the development server:

```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000). Type a room name, or press **Open** to get a random one, and share the room link with others.

## Configuration

| Variable                  | Example       | Purpose                                            |
| ------------------------- | ------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_HOST`        | `localhost`   | Host of the Pinto signal server                    |
| `NEXT_PUBLIC_PORT`        | `443`         | Port of the signal server, used outside production |
| `NEXT_PUBLIC_KEY`         | `pinto`       | Must match `KEY` on the signal server              |
| `NEXT_PUBLIC_NODE_ENV`    | `development` | `production` connects over HTTPS without a port    |
| `NEXT_PUBLIC_ACCOUNT_SID` |               | Twilio account SID                                 |
| `NEXT_PUBLIC_AUTH_TOKEN`  |               | Twilio auth token                                  |

The Twilio values are only read on the server in `getServerSideProps`, but keep them out of client code since `NEXT_PUBLIC_` variables can be bundled for the browser.

## Scripts

| Command          | Description                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `npm run dev`    | Development server on port 4000                                                                |
| `npm run build`  | Production build                                                                               |
| `npm start`      | Serve the production build                                                                     |
| `npm run prod`   | Build with profiling and serve on port 4000                                                    |
| `npm run lint`   | Lint with ESLint                                                                               |
| `npm test`       | Plain Express and EJS test client on port 4000, for checking the signal server without Next.js |
| `npm run vercel` | Run through `vercel dev` on port 4000                                                          |

## Project layout

- `pages/`: the home page, `room/[roomId]` and the `api/room` route
- `types/`: React components (room, presenter, attendees, video, photo uploader)
- `use*.ts`: hooks for user media, the PeerJS peer, the Socket.IO connection and active calls
- `styles/tailwind.css` and `tailwind.config.js`: styles and theme

## Deployment

The app deploys to [Vercel](https://vercel.com). Link the repo once with `npx vercel link`, set the variables above in the project settings, and every push gets a preview deployment. See the [Next.js deployment docs](https://nextjs.org/docs/app/getting-started/deploying) for other hosts.

## License

[GPL 3.0](LICENSE.md)
