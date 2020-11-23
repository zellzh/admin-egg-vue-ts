declare module '*.vue' { // .vue 后缀的文件, 使用 Vue 声明解析
  import Vue from 'vue'
  export default Vue
}

// 声明 js 库
declare module 'af-table-column'
