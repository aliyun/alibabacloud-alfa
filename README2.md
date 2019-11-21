# Console OS

## 启动项目

```bash
$ yarn install
$ npx lerna bootstrap
```

## 运行

```bash
$ cd packages/kernal

$ npm run storybook
```

## 构建

```
# 全版本构建
$ npm run prepublish

# 构建 commonjs 版本
$ npm run babel

# 构建 esm 版本
$ npm run babel:esm

# 构建 umd 版本
$ npm run build
```