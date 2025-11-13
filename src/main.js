import { createApp } from 'vue'
import './style.css'
import 'virtual:uno.css'
import App from './App.vue'

// 禁用所有控制台输出（生产环境）
if (import.meta.env.PROD) {
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}
  console.info = () => {}
  console.debug = () => {}
}

// 开发环境也禁用 Vue 警告
const app = createApp(App)
app.config.warnHandler = () => {}
app.config.errorHandler = () => {}

app.mount('#app')

