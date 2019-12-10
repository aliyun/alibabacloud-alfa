# Console OS Loader

An app bundle loader used by console os

## TODO

- [x] load single bundle
- [x] script load error handler
- [x] recursive load
- [x] load with deps
- [ ] combo load bundle

## How to use

```bash
tnpm i @alicloud/console-os-loader
```

```javascript
import { loadBundle } from '@alicloud/console-os-loader'

const vpc = await loadBundle({
  id: 'vpc',
  url: 'https://g.alicdn.com/aliyun-next/vpc/index.js'
})

```

## External library

``` javascript
import react from 'react'
import { loadBundle } from '@alicloud/console-os-loader'

const vpc = await loadBundle(
  {
    id: 'vpc',
    url: 'https://g.alicdn.com/aliyun-next/vpc/index.js'
    deps: {
      react,
    }
  }
)
```

## Build bundle

In OS, an app bundle is built by breezr, you can use @alicloud/console-toolkit-plugin-os to build your bundle

```javascript
/* breezr.config.js */

module.exports = {
  /*
   * other breezr config
   */
  plugins: [
    '@alicloud/console-toolkit-plugin-os'
  ]
}

```