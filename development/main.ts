import { createApp } from 'vue'

import { AppWithProvider, AppWithUse } from './App'

import { createContext } from '../src'

const modalisContext = createContext()

createApp(AppWithUse).use(modalisContext).mount('#app-with-use')
createApp(AppWithProvider).mount('#app-with-provider')
