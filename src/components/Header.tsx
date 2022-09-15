import { useTranslation } from 'react-i18next'

import i18n, { resources } from '~/i18n'

const Header = () => {
  const { toggleDark } = useDark()
  const { t } = useTranslation()

  const [language, setLanguage] = useLocalStorageState(
    'lang',
    {
      defaultValue: Number(localStorage.getItem('lang')) ?? 0,
    },
  )

  const toggleLocales = () => {
    const locales = Object.keys(resources)
    setLanguage((language + 1) % locales.length)
    i18n.changeLanguage(locales[(language + 1) % locales.length])
  }

  return (
    <header flex justify-between items-center mb-2 pb-4 text="xl black dark:neutral-2">
      <h1 text-lg font-extrabold tracking-wide flex items-center gap-2>
        <img src="/favicon.svg" alt="logo" w-6 h-6 />
        {t('title')}
      </h1>

      <nav text-xl inline-flex items-center gap-3>
        <button icon-btn onClick={toggleLocales}>
          <div i-carbon-language />
        </button>

        <button icon-btn onClick={toggleDark}>
          <div dark:i-carbon-moon i-carbon-sun />
        </button>

        <a
          icon-btn i-carbon-logo-github
          rel="noreferrer"
          href="https://github.com/flower-f/emoji-generator"
          target="_blank"
        >
          Github Link
        </a>
      </nav>
    </header>
  )
}

export default Header
