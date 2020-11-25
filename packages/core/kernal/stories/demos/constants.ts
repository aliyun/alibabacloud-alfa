export const appInfo = {
  name: 'os-example',
  manifest: 'http://g.alicdn.com/ConsoleOS/OSExample/0.0.5/os-example.manifest.json'
}

export const appManifest = {
  name: "os-example",
  resources: {
    "index.css": "//g.alicdn.com/ConsoleOS/OSExample/0.0.5/index.css",
    "index.js": "//g.alicdn.com/ConsoleOS/OSExample/0.0.5/index.js"
  },
  "entrypoints": {
    "index": {
      "css": [
        "//g.alicdn.com/ConsoleOS/OSExample/0.0.5/index.css"
      ],
      "js": [
        "//g.alicdn.com/ConsoleOS/OSExample/0.0.5/index.js"
      ]
    }
  }
}