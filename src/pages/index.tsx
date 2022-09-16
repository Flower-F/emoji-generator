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

const initialEmoji = {
  head: 0,
  eyes: 0,
  eyebrows: 0,
  mouth: 0,
  detail: 0,
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
  const [selectedIndex, setSelectedIndex] = useState(initialEmoji)
  // 维护一个栈
  const [steps, setSteps] = useState<{ index: { [key in TEmoji]: number }; tab: TEmoji }[]>([])
  const { t } = useTranslation()

  const selectedImage = useMemo(() => {
    return {
      head: images.head[selectedIndex.head],
      eyes: images.eyes[selectedIndex.eyes],
      eyebrows: images.eyebrows[selectedIndex.eyebrows],
      mouth: images.mouth[selectedIndex.mouth],
      detail: images.detail[selectedIndex.detail],
    }
  }, [images.detail, images.eyebrows, images.eyes, images.head, images.mouth, selectedIndex.detail, selectedIndex.eyebrows, selectedIndex.eyes, selectedIndex.head, selectedIndex.mouth])

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const selectItem = useMemoizedFn(({ tab, index }: { tab: TEmoji; index: number }) => {
    if (steps.length > 0 && steps[steps.length - 1].tab === tab && selectedIndex[tab] === index)
      return

    const newIndex = {
      ...selectedIndex,
      [tab]: index,
    }
    setSelectedIndex(newIndex)
    setSteps([...steps, {
      index: newIndex,
      tab,
    }])
  })

  const getRandom = useCallback(() => {
    const randomIndex = {
      head: randomInt(0, images.head.length - 1),
      eyes: randomInt(0, images.eyes.length - 1),
      eyebrows: randomInt(0, images.eyebrows.length - 1),
      mouth: randomInt(0, images.mouth.length - 1),
      detail: randomInt(0, images.detail.length - 1),
    }
    setSelectedIndex(randomIndex)
    setSteps(steps => [...steps, {
      index: randomIndex,
      tab: selectedTab,
    }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.detail.length, images.eyebrows.length, images.eyes.length, images.head.length, images.mouth.length])

  const undo = useMemoizedFn(() => {
    if (steps.length < 2)
      return

    setSelectedIndex(steps[steps.length - 2].index)
    steps.pop()
    setSteps([...steps])
  })

  const exportImage = useMemoizedFn((blob: Blob | null) => {
    if (!blob)
      return

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emoji_${Date.now()}`
    a.click()
  })

  const loadImage = useCallback(async () => {
    // load materials
    const headModules = import.meta.glob<SvgImageModule>('~/assets/head/*.svg')
    const headImages = await resolveImportGlobModule(headModules)
    const eyesModules = import.meta.glob<SvgImageModule>('~/assets/eyes/*.svg')
    const eyesImages = await resolveImportGlobModule(eyesModules)
    const eyebrowsModules = import.meta.glob<SvgImageModule>('~/assets/eyebrows/*.svg')
    const eyebrowsImages = await resolveImportGlobModule(eyebrowsModules)
    const mouthModules = import.meta.glob<SvgImageModule>('~/assets/mouth/*.svg')
    const mouthImages = await resolveImportGlobModule(mouthModules)
    const detailModules = import.meta.glob<SvgImageModule>('~/assets/details/*.svg')
    const detailImages = await resolveImportGlobModule(detailModules)

    setImages({
      head: headImages,
      eyes: ['', ...eyesImages],
      eyebrows: ['', ...eyebrowsImages],
      mouth: ['', ...mouthImages],
      detail: ['', ...detailImages],
    })
    getRandom()
  }, [getRandom])

  useEffect(() => {
    loadImage()
  }, [loadImage])

  const canvas = useRef<HTMLCanvasElement | null>(null)
  const CANVAS_LENGTH = 640

  useEffect(() => {
    const { head, eyebrows, eyes, mouth, detail } = selectedImage

    Promise.all([
      pathToImage(head),
      pathToImage(eyes),
      pathToImage(eyebrows),
      pathToImage(mouth),
      pathToImage(detail),
    ]).then((images) => {
      const ctx = canvas.current?.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.current?.width || 0, canvas.current?.height || 0)
        images.forEach((img) => {
          img && ctx.drawImage(img, 0, 0, CANVAS_LENGTH, CANVAS_LENGTH)
        })
        canvas.current?.classList.add('animation')
        setTimeout(() => {
          canvas.current?.classList.remove('animation')
        }, 500)
      }
    }).catch((e) => {
      console.error('Error:', e)
    })
  }, [selectedImage])

  return (
    <div
      flex="~ col" items-center justify-center gap-4 w-full h-auto max-w-800px mx-auto py-4
      bg="#f9f9f9 dark:#121212" rounded-md shadow-teal shadow-sm
    >
      {/* 展示区域 */}
      <div flex items-center justify-center mt-4 w="200px" h="200px" border="2 neutral-3" rounded-2xl>
        <canvas width="640" height="640" w="160px" h="160px" ref={canvas}></canvas>
      </div>

      {/* 操作区域 */}
      <div flex gap-2 bg="teal-5" px-3 py-2 rounded-full>
        <button rounded-btn w-12 h-12 title={t('tool.undo')} onClick={undo}>
          <div i-carbon-undo></div>
        </button>
        <button rounded-btn w-12 h-12 title={t('tool.randomize')} onClick={getRandom}>
          <div i-fad-random-1dice w-6 h-6></div>
        </button>
        <button rounded-btn w-12 h-12 title={t('tool.download')} onClick={() => canvas.current?.toBlob(exportImage)}>
          <div i-carbon-cloud-download></div>
        </button>
      </div>

      {/* 一级选择区域 */}
      <div
        flex flex-wrap justify-center items-center gap-3 p-4
        border="b neutral-4 op-20" className="w-85%"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab + index}
            flex items-center justify-center cursor-pointer transition-colors h-16 w-16 rounded-lg
            border="~ teal-7 dark:teal-2 op-40"
            bg="teal-1 dark:#333"
            hover="bg-teal-4 dark:bg-teal-3 border-2 border-op-90"
            onClick={() => setSelectedTab(tab)}
            style={tab === selectedTab ? { background: 'rgba(94, 234, 212, var(--un-bg-opacity))' } : undefined}
          >
            {selectedImage[tab] && <img h-12 w-12 rounded-lg src={selectedImage[tab]} alt={tab} />}
          </button>
        ))}
      </div>

      {/* 二级选择区域 */}
      <div p-4 flex items-center justify-center flex-wrap gap-3 className="w-85%">
        {(Object.keys(images) as (keyof typeof images)[]).map(tab => (
          selectedTab === tab && images[tab].map((image, index) => (
            <button
              key={tab + index}
              flex items-center justify-center cursor-pointer transition-colors h-12 w-12 rounded-lg
              border="~ teal-7 dark:teal-2 op-40"
              bg="teal-1 dark:#333 teal-3 dark:teal-4"
              hover="bg-teal-4 dark:bg-teal-3 border-2 border-op-90"
              onClick={() => selectItem({ tab, index })}
              style={selectedIndex[selectedTab] === index ? { background: 'rgba(94, 234, 212, var(--un-bg-opacity))' } : undefined}
            >
              {image && <img h-10 w-10 rounded-lg src={image} alt={tab + index} />}
            </button>
          ))
        ))}
      </div>
    </div>
  )
}

export default IndexPage
