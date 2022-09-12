import './i18n'

import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useRoutes } from 'react-router-dom'

import routes from '~react-pages'

import Footer from './components/Footer'
import Header from './components/Header'

const App = () => {
  const { t } = useTranslation()

  return (
    <main font-sans h-full p="x-4 y-6" text="center black dark:neutral-1">
      <Header />
      <p>{t('methods.hook')}</p>
      <Suspense fallback={<div>Loading...</div>}>
        {useRoutes(routes)}
      </Suspense>
      <Footer />
    </main>
  )
}

export default App
