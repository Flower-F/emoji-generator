type SvgImageModule = typeof import('*.svg')
type ImportModuleFunction = () => Promise<SvgImageModule>

const pathToImage = (path: string) => {
  return new Promise<HTMLImageElement | null>((resolve) => {
    if (path === '')
      resolve(null)

    const img = new Image(400, 400)
    img.src = path
    img.onload = () => {
      resolve(img)
    }
  })
}

const resolveImportGlobModule = async (modules: Record<string, ImportModuleFunction>) => {
  const imports = Object.values(modules).map(importFn => importFn())
  const loadedModules = await Promise.all(imports)
  return loadedModules.map(module => module.default)
}

type TEmoji = 'head' | 'eyes' | 'eyebrows' | 'mouth' | 'detail'
const tabs: TEmoji[] = ['head', 'eyes', 'eyebrows', 'mouth', 'detail']

const IndexPage = () => {
  const [selectedTab, setSelectedTab] = useState<TEmoji>('head')
  const [images, setImages] = useState<{ [key in TEmoji]: string[] }>({
    head: [],
    eyes: [],
    eyebrows: [],
    mouth: [],
    detail: [],
  })
  const [selectedIndex, setSelectedIndex] = useState({
    head: 0,
    eyes: 0,
    eyebrows: 0,
    mouth: 0,
    detail: 0,
  })

  const selectedImage = () => {
    return {
      head: images.head[selectedIndex.head],
      eyes: images.eyes[selectedIndex.eyes],
      eyebrows: images.eyebrows[selectedIndex.eyebrows],
      mouth: images.mouth[selectedIndex.mouth],
      detail: images.detail[selectedIndex.detail],
    }
  }

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const getRandom = () => {
    const randomIndex = {
      head: randomInt(0, images.head.length - 1),
      eyes: randomInt(0, images.eyes.length - 1),
      eyebrows: randomInt(0, images.eyebrows.length - 1),
      mouth: randomInt(0, images.mouth.length - 1),
      detail: randomInt(0, images.detail.length - 1),
    }
    setSelectedIndex(randomIndex)
  }

  const exportImage = (blob: Blob | null) => {
    if (!blob)
      return

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emoji_${Date.now()}`
    a.click()
  }

  const loadImage = async () => {
    // head
    const headModules = import.meta.glob<SvgImageModule>('./assets/head/*.svg')
    const fullHeadImages = await resolveImportGlobModule(headModules)
    // eyes
    const eyesModules = import.meta.glob<SvgImageModule>('./assets/eyes/*.svg')
    const fullEyesImages = await resolveImportGlobModule(eyesModules)
    // eyebrows
    const eyebrowsModules = import.meta.glob<SvgImageModule>('./assets/eyebrows/*.svg')
    const fullEyebrowsImages = await resolveImportGlobModule(eyebrowsModules)
    // mouth
    const mouthModules = import.meta.glob<SvgImageModule>('./assets/mouth/*.svg')
    const fullMouthImages = await resolveImportGlobModule(mouthModules)
    // detail
    const detailModules = import.meta.glob<SvgImageModule>('./assets/details/*.svg')
    const fullDetailImages = await resolveImportGlobModule(detailModules)
    setImages({
      head: fullHeadImages,
      eyes: ['', ...fullEyesImages],
      eyebrows: ['', ...fullEyebrowsImages],
      mouth: ['', ...fullMouthImages],
      detail: ['', ...fullDetailImages],
    })
    getRandom()
  }

  useEffect(() => {
    loadImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let canvas: HTMLCanvasElement
  const CANVAS_LENGTH = 640

  useEffect(() => {
    const headPath = selectedImage().head
    const eyesPath = selectedImage().eyes
    const eyebrowsPath = selectedImage().eyebrows
    const mouthPath = selectedImage().mouth
    const detailPath = selectedImage().detail

    Promise.all([
      pathToImage(headPath),
      pathToImage(eyesPath),
      pathToImage(eyebrowsPath),
      pathToImage(mouthPath),
      pathToImage(detailPath),
    ]).then((images) => {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        images.forEach((img) => {
          img && ctx.drawImage(img, 0, 0, CANVAS_LENGTH, CANVAS_LENGTH)
        })
        canvas.classList.add('animation')
        setTimeout(() => {
          canvas.classList.remove('animation')
        }, 500)
        return true
      }
      return false
    }).catch((e) => {
      console.error('Error:', e)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectItem = (tab: TEmoji, index: number) => {
    setSelectedIndex({ ...selectedIndex, [tab]: index })
  }

  return (
    <div
      flex="~ col" items-center justify-center gap-4 w-full h-auto max-w-800px mx-auto py-4
      bg="#f9f9f9 dark:#121212" rounded-md shadow-teal shadow-sm
    >
      <div flex items-center justify-center mt-4 w="200px" h="200px" border="2 neutral-3" rounded-2xl>
        <canvas width="640" height="640" w="160px" h="160px"></canvas>
      </div>

      <div flex gap-2 bg="teal-5" px-3 py-2 rounded-full>
        <button rounded-btn>
          <div i-ooui-previous-ltr></div>
        </button>
        <button rounded-btn>
          <div i-ooui:previous-rtl></div>
        </button>
        <button rounded-btn>
          <div i-carbon-reflect-horizontal></div>
        </button>
        <button rounded-btn>
          <div i-ri-code-s-slash-line></div>
        </button>
      </div>

      <div flex flex-col sm:flex-row gap-2 bg="teal-4 dark:teal-6" transition-colors p-3 rounded mt-4>
        <button className="btn" onClick={getRandom}>
          <div>Randomize</div>
          <div i-carbon-loop text-xl></div>
        </button>
        <button className="btn" onClick={() => canvas.toBlob(exportImage)}>
          <div>Download</div>
          <div i-carbon-download text-base></div>
        </button>
      </div>

      <div
        flex flex-wrap justify-center items-center gap-3 p-4
        border="b neutral-4 op-20" className="w-85%"
      >
        {tabs.map((tab, index) => (
          selectedTab === tab
            ? <button
                key={tab + index}
                flex items-center justify-center cursor-pointer transition-colors h-16 w-16 rounded-lg
                border="~ teal-7 dark:teal-2 op-40"
                bg="teal-2 dark:teal-2"
                hover="bg-teal-4 dark:bg-teal-3 border-2 border-op-90"
                onClick={() => setSelectedTab(tab)}
              >
                {
                  selectedImage()[tab]
                  && <img h-12 w-12 rounded-lg src={selectedImage()[tab]} alt={tab} />
                }
              </button>
            : <button
              key={tab + index}
              flex items-center justify-center cursor-pointer transition-colors h-16 w-16 rounded-lg
              bg="teal-1 dark:#333"
              hover="bg-teal-4 dark:bg-teal-3"
              onClick={() => setSelectedTab(tab)}
            >
              {
                selectedImage()[tab]
                && <img h-12 w-12 rounded-lg src={selectedImage()[tab]} alt={tab} />
              }
            </button>
        ))}
      </div>

      <div p-4 flex items-center justify-center flex-wrap gap-3 className="w-85%">
        {(Object.keys(images) as (keyof typeof images)[]).map((tab, index) => (
          selectedTab === tab
            ? <button
                key={tab + index}
                flex items-center justify-center cursor-pointer transition-colors h-12 w-12 rounded-lg
                border="~ teal-7 dark:teal-2 op-40"
                bg="teal-2 dark:teal-2"
                hover="bg-teal-4 dark:bg-teal-3 border-2 border-op-90"
              >
                {
                  selectedImage()[tab]
                  && <img h-10 w-10 rounded-lg src={selectedImage()[tab]} alt={tab} />
                }
              </button>
            : <button
                key={tab + index}
                flex items-center justify-center cursor-pointer transition-colors h-12 w-12 rounded-lg
                bg="teal-1 dark:#333"
                hover="bg-teal-4 dark:bg-teal-3"
                onClick={() => selectItem(tab, index)}
              >
                {
                  selectedImage()[tab]
                  && <img h-10 w-10 rounded-lg src={selectedImage()[tab]} alt={tab} />
                }
              </button>
        ))}
      </div>
    </div>
  )
}

export default IndexPage
