import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerAttributifyJsx,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['icon-btn', 'inline-flex gap-1 justify-center items-center cursor-pointer select-none opacity-90 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-6 outline-none'],
    ['rounded-btn', 'inline-flex justify-center items-center p-3 rounded-full bg-neutral-1 dark:bg-neutral-6 text-black dark:text-white cursor-pointer transition-colors hover:bg-teal-6 dark:hover:bg-teal-9 hover:text-white'],
    ['dashed-link', 'border-neutral-6 border-b border-dotted hover:text-teal-6 dark:hover:text-teal-2'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerAttributifyJsx(),
  ],
})
