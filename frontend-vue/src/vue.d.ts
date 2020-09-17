import Vue from 'vue'

// 使用第三方库时, 给 Vue 声明中添加地方声明
import { Message } from 'element-ui'

declare module 'vue/types/vue' {
  interface Vue { // 接口合并
    $message: Message
  }
}
