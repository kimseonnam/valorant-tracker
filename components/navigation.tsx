'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Trophy,
  Users,
  Map,
  FileText,
  Menu,
  X,
  GitBranch,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SEASONS } from '@/lib/types'
import { useAdmin } from '@/lib/admin-context'

const navItems = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/rankings', label: '랭킹', icon: Trophy },
  { href: '/players', label: '플레이어', icon: Users },
  { href: '/maps-agents', label: '맵 & 요원', icon: Map },
  { href: '/matches', label: '매치 기록', icon: FileText },
  { href: '/bracket', label: '대진표', icon: GitBranch },
]

interface NavigationProps {
  selectedSeason: string
  onSeasonChange: (season: string) => void
}

export function Navigation({ selectedSeason, onSeasonChange }: NavigationProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAdmin } = useAdmin()

  // Extract season number from selected season (e.g., "Season 1" -> "1")
  const getSeasonNumber = () => {
    if (selectedSeason === '전체 시즌') return '전체'
    const match = selectedSeason.match(/Season (\d+)/)
    return match ? match[1] : selectedSeason
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
                  <span className="text-black font-bold text-sm">V</span>
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:inline">VALORANT</span>
            </Link>
            <span className="text-xs text-muted-foreground border border-border px-2 py-0.5 rounded hidden sm:inline">
              치발동
            </span>
            <span className="text-xs font-medium bg-white text-black px-2 py-0.5 rounded hidden sm:inline">
              시즌 {getSeasonNumber()}
            </span>
          </div>

          {/* Season Selector - Admin Only */}
          {isAdmin && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">시즌 변경:</span>
              <Select value={selectedSeason} onValueChange={onSeasonChange}>
                <SelectTrigger className="w-[140px] h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEASONS.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-white text-black'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <div className="flex items-center gap-2 py-2">
              <span className="text-sm text-muted-foreground">현재 시즌:</span>
              <span className="text-sm font-medium bg-white text-black px-2 py-0.5 rounded">
                시즌 {getSeasonNumber()}
              </span>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2 py-2">
                <span className="text-sm text-muted-foreground">시즌 변경:</span>
                <Select value={selectedSeason} onValueChange={onSeasonChange}>
                  <SelectTrigger className="w-[140px] h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEASONS.map((season) => (
                      <SelectItem key={season} value={season}>
                        {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-white text-black'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </header>
  )
}
