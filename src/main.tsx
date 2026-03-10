import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Toaster} from 'sonner' // 1. 导入 Toaster 组件
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
        <Toaster
            position="top-center"
            duration={3000}
            // closeButton
            richColors
            className="custom-toast-container"
        />
    </StrictMode>,
)