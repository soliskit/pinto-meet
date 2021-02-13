import Head from 'next/head'
import JoinForm from '../types/join-form'
import Time from '../types/time'

const Home = () => (
  <div className='bg-hero-image min-h-screen bg-cover bg-center'>
    <Head>
      <title>Pinto Pinto</title>
      <meta property='og:title' content='Video conferencing for the rest of us'/>
      <meta property='og:description' content='Open a room to get started today' />
      <meta property='og:type' content='website' />
      <meta property='og:image' content='/hero_thumbnail.png' />
      <meta property='og:url' content='https://pintopinto.org/' />
      <meta name='viewport' content='initial-scale=1.0, user-scalable=no, width=device-width' />
      <link rel='icon' href='/favicon.ico' />
    </Head>

    <div className='pt-10 pl-5'>

      <header>
        <Time/>
      </header>

      <main>
        <JoinForm/>
      </main>

    </div>
  </div>
)

export default Home
