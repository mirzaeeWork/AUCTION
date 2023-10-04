import Layout from '../component/layout/layout'
import '../styles/globals.css'
import ContextProvider from '../utils/context'


function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ContextProvider>
  )
}

export default MyApp
