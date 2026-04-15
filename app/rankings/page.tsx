'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getPlayerRankings } from '@/lib/store'
import { Player } from '@/lib/types'
import { Trophy, Medal, Award } from 'lucide-react'

type RankedPlayer = Player & { kda: number; winRate: number }

function RankingsContent() {
  const [players, setPlayers] = useState<RankedPlayer[]>([])

  useEffect(() => {
    setPlayers(getPlayerRankings())
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-muted-foreground font-mono">{rank}</span>
    }
  }

  const getKDAColor = (kda: number) => {
    if (kda >= 2) return 'text-green-400'
    if (kda >= 1.5) return 'text-yellow-400'
    if (kda >= 1) return 'text-white'
    return 'text-red-400'
  }

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 60) return 'text-green-400'
    if (winRate >= 50) return 'text-yellow-400'
    if (winRate >= 40) return 'text-white'
    return 'text-red-400'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          플레이어 랭킹
        </h1>
        <p className="text-muted-foreground mt-1">KDA 기준 플레이어 순위</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">전체 랭킹</CardTitle>
        </CardHeader>
        <CardContent>
          {players.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              등록된 플레이어가 없습니다
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-16 text-center">순위</TableHead>
                    <TableHead>플레이어</TableHead>
                    <TableHead className="text-center">팀</TableHead>
                    <TableHead className="text-center">매치</TableHead>
                    <TableHead className="text-center">승/패</TableHead>
                    <TableHead className="text-center">승률</TableHead>
                    <TableHead className="text-center">K/D/A</TableHead>
                    <TableHead className="text-center">KDA</TableHead>
                    <TableHead className="text-center">HS%</TableHead>
                    <TableHead className="text-center">주요원</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player, index) => {
                    const hsPercent = player.kills > 0 
                      ? ((player.headshots / player.kills) * 100).toFixed(1) 
                      : '0.0'
                    
                    return (
                      <TableRow key={player.id} className="border-border">
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            {getRankIcon(index + 1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{player.name}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">
                            {player.team || '-'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {player.matchesPlayed}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          <span className="text-green-400">{player.wins}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-red-400">{player.losses}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono ${getWinRateColor(player.winRate)}`}>
                            {player.winRate}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          <span className="text-green-400">{player.kills}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-red-400">{player.deaths}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-blue-400">{player.assists}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-mono font-bold ${getKDAColor(player.kda)}`}>
                            {player.kda.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {hsPercent}%
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {player.favoriteAgent}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      {players.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {[1, 0, 2].map((podiumIndex) => {
            const player = players[podiumIndex]
            if (!player) return null
            
            const rank = podiumIndex === 1 ? 2 : podiumIndex === 0 ? 1 : 3
            const heights = ['h-32', 'h-24', 'h-20']
            const bgColors = ['bg-yellow-500/10 border-yellow-500/30', 'bg-gray-400/10 border-gray-400/30', 'bg-amber-600/10 border-amber-600/30']
            
            return (
              <Card key={player.id} className={`bg-card border ${bgColors[rank - 1]}`}>
                <CardContent className="pt-6 text-center">
                  <div className="flex justify-center mb-4">
                    {getRankIcon(rank)}
                  </div>
                  <h3 className="font-bold text-lg">{player.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{player.team}</p>
                  <p className={`text-2xl font-bold ${getKDAColor(player.kda)}`}>
                    {player.kda.toFixed(2)} KDA
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {player.wins}승 {player.losses}패
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function RankingsPage() {
  return (
    <MainLayout>
      <RankingsContent />
    </MainLayout>
  )
}
