'use client'

import { useState, createContext, useContext, useEffect } from 'react'
import { Navigation } from './navigation'
import { initializeStore } from '@/lib/store'
import { AdminProvider } from '@/lib/admin-context'

interface AppContextType {
  selectedSeason: string
  setSelectedSeason: (season: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within MainLayout')
  }
  return context
}

const SEASON_STORAGE_KEY = 'valorant_selected_season'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [selectedSeason, setSelectedSeason] = useState('전체 시즌')
  const [mounted, setMounted] = useState(false)

  // Load saved season from localStorage on mount
  useEffect(() => {
    initializeStore()
    const savedSeason = localStorage.getItem(SEASON_STORAGE_KEY)
    if (savedSeason) {
      setSelectedSeason(savedSeason)
    }
    setMounted(true)
  }, [])

  // Save season to localStorage when it changes
  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season)
    localStorage.setItem(SEASON_STORAGE_KEY, season)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 border-b border-border" />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <AdminProvider>
      <AppContext.Provider value={{ selectedSeason, setSelectedSeason: handleSeasonChange }}>
        <div className="min-h-screen bg-background">
          <Navigation
            selectedSeason={selectedSeason}
            onSeasonChange={handleSeasonChange}
          />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </AppContext.Provider>
    </AdminProvider>
  )
}
