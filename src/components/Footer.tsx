const Footer = () => {
  const { t } = useTranslation()

  return (
    <div text="base neutral-6 dark:neutral-4" p-6>
      <div>
        {t('footer.assets')} {' '}
        <a dashed-link href="https://github.com/microsoft/fluentui-emoji" target="_blank" rel="noreferrer">Fluent Emoji</a>
      </div>
      <div>
        {t('footer.inspiration')}
        {' '} <a dashed-link href="https://github.com/ddiu8081" target="_blank" rel="noreferrer">Diu</a> &
        {' '} <a dashed-link href="https://github.com/Codennnn" target="_blank" rel="noreferrer">Codennnn</a>
      </div>
      <div>
        Made by
        {' '} <a dashed-link href="https://github.com/Flower-F" target="_blank" rel="noreferrer">Flower-F</a> {' '} |
        {' '} <a dashed-link href="https://github.com/Flower-F/emoji-generator" target="_blank" rel="noreferrer">Source Code</a>
      </div>
    </div>
  )
}

export default Footer
