<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Admin-Egg-Ts](#Admin-Egg-Ts)
  - [快速开始](#快速开始)
    - [Development](#development)
    - [Deploy](#deploy)
    - [Npm Scripts](#npm-scripts)
    - [Requirement](#requirement)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Admin-Egg-Ts
基于 Egg+Ts 开发的通用 Admin 系统后台

## 快速开始

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

note: 需要安装全局依赖`ts-noed: npm i -g ts-node`

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- `npm run lint` 检查代码样式
- `npm test` 运行单元测试
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+
- Egg.js 2.x
- Typeorm.js 0.2+
