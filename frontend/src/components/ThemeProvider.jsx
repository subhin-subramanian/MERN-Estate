import React from 'react'
import { useSelector } from 'react-redux'

function ThemeProvider({children}) {
    const {theme} = useSelector(state=>state.theme);
  return (
    <div className={theme}>
        <div className="min-h-screen bg-white text-amber-950 dark:bg-amber-900 dark:text-amber-600">
          {children}
        </div>
    </div>
  )
}

export default ThemeProvider
