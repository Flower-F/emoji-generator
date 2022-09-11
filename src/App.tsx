import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import routes from '~react-pages'

import Header from './components/Header'

const App = () => {
  return (
    <main font-sans p="x-4 y-10" text="center black dark:neutral-100">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        {useRoutes(routes)}
      </Suspense>
    </main>
  )
}

export default App
