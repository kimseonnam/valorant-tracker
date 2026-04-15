'use client'

import { useEffect, useState } from 'react'
import { MainLayout, useApp } from '@/components/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getTotalMatches,
  getTotalKills,
  getAverageKDA,
  getMostPlayedMap,
  getMostPlayedAgent,
  getRecentMatches,
  getMatchesBySeason,
} from '@/lib/store'
import { Match } from '@/lib/types'
import { Swords, Target, TrendingUp, MapIcon, UserCircle } from 'lucide-react'

function DashboardContent() {
  const { selectedSeason } = useApp()
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalKills: 0,
    averageKDA: 0,
    mostPlayedMap: { name: '없음', count: 0 },
    mostPlayedAgent: { name: '없음', count: 0 },
  })
  const [recentMatches, setRecentMatches] = useState<Match[]>([])

  useEffect(() => {
    const matches = getMatchesBySeason(selectedSeason)
    setStats({
      totalMatches: matches.length,
      totalKills: getTotalKills(),
      averageKDA: getAverageKDA(),
      mostPlayedMap: getMostPlayedMap(),
      mostPlayedAgent: getMostPlayedAgent(),
    })
    setRecentMatches(getRecentMatches(5))
  }, [selectedSeason])

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Swords className="h-4 w-4" />
              총 매치 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalMatches}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              총 킬 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalKills}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              평균 KDA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.averageKDA.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              최다 플레이 맵
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{stats.mostPlayedMap.name}</p>
            <p className="text-sm text-muted-foreground">{stats.mostPlayedMap.count}회</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              최다 선택 요원
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{stats.mostPlayedAgent.name}</p>
            <p className="text-sm text-muted-foreground">{stats.mostPlayedAgent.count}회</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Matches */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Swords className="h-5 w-5" />
            최근 매치
          </CardTitle>
          <p className="text-sm text-muted-foreground">최근 경기 결과를 확인하세요</p>
        </CardHeader>
        <CardContent>
          {recentMatches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              아직 기록된 매치가 없습니다
            </div>
          ) : (
            <div className="space-y-4">
              {recentMatches.map((match) => {
                const team1Won = match.team1Score > match.team2Score
                return (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-xs">
                        {match.map}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(match.date).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={team1Won ? 'font-bold text-white' : 'text-muted-foreground'}>
                        {match.team1}
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className={team1Won ? 'text-green-400 font-bold' : 'text-muted-foreground'}>
                          {match.team1Score}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span className={!team1Won ? 'text-green-400 font-bold' : 'text-muted-foreground'}>
                          {match.team2Score}
                        </span>
                      </div>
                      <span className={!team1Won ? 'font-bold text-white' : 'text-muted-foreground'}>
                        {match.team2}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {match.season}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <MainLayout>
      <DashboardContent />
    </MainLayout>
  )
}
