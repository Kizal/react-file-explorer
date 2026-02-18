import { useState } from 'react'
import { ThemeProvider } from './theme/ThemeContext'
import { FileExplorerProvider } from './context/FileExplorerContext'
import AppLayout from './components/layout/AppLayout'

function App() {
    return (
        <ThemeProvider>
            <FileExplorerProvider>
                <AppLayout />
            </FileExplorerProvider>
        </ThemeProvider>
    )
}

export default App
