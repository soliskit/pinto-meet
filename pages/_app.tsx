import '../styles/tailwind.css'
import { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />

declare global {
  interface HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream
  }
}

export default App
