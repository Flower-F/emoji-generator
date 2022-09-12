import { useTranslation } from 'react-i18next'

const Header = () => {
  const { toggleDark } = useDark()
  const { t } = useTranslation()

  return (
    <header flex justify-between text="xl black dark:neutral-2">
      <h1 text-lg font-extrabold tracking-wide>
        Emoji Generator {t('methods.hook')}
      </h1>

      <nav text-xl inline-flex items-center gap-2 pb-4>
        <button icon-btn>
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
