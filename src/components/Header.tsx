const Header = () => {
  const { toggleDark } = useDark()

  return (
    <header flex justify-between text="xl black dark:neutral-2">
      <h1 text-lg font-extrabold tracking-wide>
        Emoji Generator
      </h1>

      <nav text-xl inline-flex pb-4>
        <button icon-btn onClick={toggleDark}>
          <div dark:i-carbon-moon i-carbon-sun />
        </button>

        <a
          icon-btn i-carbon-logo-github
          rel="noreferrer"
          href="https://github.com/flower-f/emoji-generator"
          target="_blank"
          ml-1
        >
          Github Link
        </a>
      </nav>
    </header>
  )
}

export default Header
