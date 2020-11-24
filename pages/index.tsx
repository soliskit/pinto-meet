import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Time from '../types/time'
import JoinForm from '../types/join-form'

function Home () {
  return (
    <div className={styles.background}>
      <Head>
        <title>Pinto Pinto</title>
        <meta property='og:title' content='Pinto Pinto' />
        <meta property='og:type' content='website' />
        <meta property='og:image' content='/hero_thumbnail.png' />
        <meta property='og:url' content='https://pintopinto.org/' />
        <meta name='viewport' content='initial-scale=1.0, user-scalable=no, width=device-width' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={styles.container} >
        
        <header>
          <h1 className={styles.title}>
            <Time/>
          </h1>
        </header>

        <main>
          <JoinForm/>
        </main>

      </div>
    </div>
  )
}

export default Home
