import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Time from '../types/time'
import JoinForm from '../types/join-form'

export default function Home () {
  return (
    <div className={styles.home}>
      <Head>
        <title>Pinto Pinto</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container} >
        
        <section>
          <h1 className={styles.title}>
            <Time/>
          </h1>
        </section>

        <section>
          <JoinForm/>
        </section>

      </div>
    </div>
  )
}
