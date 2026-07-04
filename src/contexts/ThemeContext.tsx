import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('asgTheme') as Theme) || 'system'
  })

  const setTheme = (nextTheme: Theme) => {
    localStorage.setItem('asgTheme', nextTheme)
    setThemeState(nextTheme)
  }

  useEffect(() => {
    const root = window.document.documentElement
    const body = window.document.body
    
    const applyTheme = () => {
      let activeTheme: 'light' | 'dark' = 'light'
      
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        activeTheme = systemPrefersDark ? 'dark' : 'light'
      } else {
        activeTheme = theme as 'light' | 'dark'
      }
      
      // Support legacy .asg-theme-dark class
      body.classList.toggle('asg-theme-dark', activeTheme === 'dark')
      
      // Support Tailwind's default dark class
      root.classList.toggle('dark', activeTheme === 'dark')
      root.classList.toggle('light', activeTheme === 'light')
      
      // Set datasets for stylesheets
      body.dataset.theme = activeTheme
      root.style.colorScheme = activeTheme
      
      // Update meta theme colors
      let themeMeta = document.querySelector("meta[name='theme-color']")
      if (!themeMeta) {
        themeMeta = document.createElement('meta')
        themeMeta.setAttribute('name', 'theme-color')
        document.head.appendChild(themeMeta)
      }
      themeMeta.setAttribute('content', activeTheme === 'dark' ? '#0b1020' : '#f5edda')
    }

    applyTheme()
    
    // Listen for system theme changes if set to system
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = () => applyTheme()
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
