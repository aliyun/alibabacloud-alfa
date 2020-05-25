# postcss-prefix-wrapper

PostCss 插件 为 css 加上前缀的

```javascript
const postCssPrefixWrap = require('postcss-prefix-wrapper');

postcss([
  postcssWrap({ stackableRoot: '.prefix', repeat: 1, overrideIds: false })
])
```

### Input

```css
div {
  color: '#eee'
}
```

### Output

```css
.prefix div {
  color: 
}
```