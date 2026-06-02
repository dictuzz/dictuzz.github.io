import { defineConfig, presetIcons } from 'unocss'

export default defineConfig({
  content: {
    filesystem: [
      'resources/*.html'
    ]
  },
  presets: [
    presetIcons({
      autoInstall: true,
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    })
  ]
})
