# Pinto Pinto
## Next.js WebRTC for video conference client

### Prerequisites

This project is managed through something called a **package**. A package contains all the code being shared as well as a `package.json` file (called a **manifest**) which describes the package.

This project requires:

* Node `14.x` installed, if unfamiliar learn more about Node.js by visting [here](https://nodejs.org).
* NPM comes with node installation and will be used to manage packages.
* Optionally, you can use Yarn to manage dependencies instead.

On a Mac, you can obtain all of the above packages using [Homebrew](http://brew.sh).

## Getting Started

First, install the latest packages by running:

```bash
npm install
# or
yarn install
```

First make sure your project is saved in a Git repository of your choosing.

Link your repo to a Vercel project if you haven't already by running and follow the `Vercel CLI` prompts:

```bash
npx vercel link
```

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5000](http://localhost:5000) with your browser to see the homepage of our video client app.