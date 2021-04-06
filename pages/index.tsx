import Head from 'next/head'
import JoinForm from '../types/join-form'
import Time from '../types/time'
import PhotoUploader from '../public/photo-uploader'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Home = () => (
  <>
    <Head>
      <title>Pinto Pinto</title>
      <meta
        property='og:title'
        content='Video conferencing for the rest of us'
      />
      <meta
        property='og:description'
        content='Open a room to get started today'
      />
      <meta property='og:type' content='website' />
      <meta property='og:image' content='/hero_thumbnail.png' />
      <meta property='og:url' content='https://pintopinto.org/' />
      <meta
        name='viewport'
        content='initial-scale=1.0, user-scalable=no, width=device-width'
      />
      <link rel='icon' href='/favicon.ico' />
    </Head>

    <div className='grid grid-cols-1 gap-y-4'>
      <Time />
      <JoinForm />
      <PhotoUploader/>
    </div>
    <br></br>
  </>
)

export default Home
