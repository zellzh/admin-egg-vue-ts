// 使用第三方库时, 给 Vue 声明中添加地方声明
import {Api} from "@/types/api";
import {ElMessage} from "element-ui/types/message";
import {ElMessageBox} from "element-ui/types/message-box";

declare module 'vue/types/vue' {
  interface Vue { // 接口合并
    $message: ElMessage
    $messageBox: ElMessageBox
    $api: Api
  }
}
