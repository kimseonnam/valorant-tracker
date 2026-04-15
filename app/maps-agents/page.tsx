'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { getAgentStats, getMapStats } from '@/lib/store'
import { AGENTS, MAPS } from '@/lib/types'
import { Map, UserCircle, Swords, Shield, Crosshair, Eye } from 'lucide-react'

function MapsAgentsContent() {
  const [agentStats, setAgentStats] = useState<{ agent: string; picks: number; wins: number; losses: number }[]>([])
  const [mapStats, setMapStats] = useState<{ map: string; plays: number; team1Wins: number; team2Wins: number }[]>([])

  useEffect(() => {
    setAgentStats(getAgentStats())
    setMapStats(getMapStats())
  }, [])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Duelist':
        return <Swords className="h-4 w-4" />
      case 'Sentinel':
        return <Shield className="h-4 w-4" />
      case 'Controller':
        return <Eye className="h-4 w-4" />
      case 'Initiator':
        return <Crosshair className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleKoName = (role: string) => {
    switch (role) {
      case 'Duelist':
        return '타격대'
      case 'Sentinel':
        return '감시자'
      case 'Controller':
        return '전략가'
      case 'Initiator':
        return '척후대'
      default:
        return role
    }
  }

  const getAgentKoName = (agentName: string) => {
    const agent = AGENTS.find(a => a.name === agentName)
    return agent?.nameKo || agentName
  }

  const getMapKoName = (mapName: string) => {
    const map = MAPS.find(m => m.name === mapName)
    return map?.nameKo || mapName
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Duelist':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Sentinel':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Controller':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Initiator':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return ''
    }
  }

  const maxAgentPicks = Math.max(...agentStats.map(s => s.picks), 1)
  const maxMapPlays = Math.max(...mapStats.map(s => s.plays), 1)

  // Group agents by role
  const agentsByRole = AGENTS.reduce((acc, agent) => {
    if (!acc[agent.role]) acc[agent.role] = []
    acc[agent.role].push(agent)
    return acc
  }, {} as Record<string, typeof AGENTS>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Map className="h-6 w-6" />
          맵 & 요원
        </h1>
        <p className="text-muted-foreground mt-1">맵과 요원별 통계 및 정보</p>
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="agents">요원</TabsTrigger>
          <TabsTrigger value="maps">맵</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6 mt-6">
          {/* Agent Stats */}
          {agentStats.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">요원 픽률 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agentStats.map((stat) => {
                  const agent = AGENTS.find(a => a.name === stat.agent)
                  const winRate = stat.picks > 0 ? ((stat.wins / stat.picks) * 100).toFixed(1) : '0'
                  
                  return (
                    <div key={stat.agent} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                            <UserCircle className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <span className="font-medium">{getAgentKoName(stat.agent)}</span>
                            {agent && (
                              <Badge variant="outline" className={`ml-2 text-xs ${getRoleBadgeColor(agent.role)}`}>
                                {getRoleIcon(agent.role)}
                                <span className="ml-1">{getRoleKoName(agent.role)}</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono">{stat.picks}회</span>
                          <span className="text-muted-foreground text-sm ml-2">
                            ({winRate}% 승률)
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={(stat.picks / maxAgentPicks) * 100} 
                        className="h-2"
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* All Agents by Role */}
          <div className="space-y-6">
            {Object.entries(agentsByRole).map(([role, agents]) => (
              <Card key={role} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getRoleIcon(role)}
                    {getRoleKoName(role)}
                    <Badge variant="secondary" className="text-xs ml-2">
                      {agents.length}명
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {agents.map((agent) => {
                      const stat = agentStats.find(s => s.agent === agent.name)
                      return (
                        <div
                          key={agent.id}
                          className="p-3 rounded-lg bg-secondary/50 border border-border text-center hover:border-white/30 transition-colors"
                        >
                          <div className="h-12 w-12 mx-auto rounded-full bg-secondary flex items-center justify-center mb-2">
                            <UserCircle className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-sm">{agent.nameKo}</p>
                          {stat && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {stat.picks}픽 / {stat.wins}승
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maps" className="space-y-6 mt-6">
          {/* Map Stats */}
          {mapStats.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">맵 플레이 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mapStats.map((stat) => (
                  <div key={stat.map} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                          <Map className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{getMapKoName(stat.map)}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono">{stat.plays}회</span>
                      </div>
                    </div>
                    <Progress 
                      value={(stat.plays / maxMapPlays) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* All Maps */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Map className="h-5 w-5" />
                전체 맵 목록
                <Badge variant="secondary" className="text-xs ml-2">
                  {MAPS.length}개
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {MAPS.map((map) => {
                  const stat = mapStats.find(s => s.map === map.name)
                  return (
                    <div
                      key={map.id}
                      className="relative overflow-hidden rounded-lg bg-secondary/50 border border-border hover:border-white/30 transition-colors"
                    >
                      <div className="aspect-video bg-gradient-to-br from-secondary to-background flex items-center justify-center">
                        <Map className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold">{map.nameKo}</h3>
                        {stat ? (
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{stat.plays}게임</span>
                            <span>
                              공격 {stat.team1Wins}승 / 수비 {stat.team2Wins}승
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">
                            플레이 기록 없음
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {agentStats.length === 0 && mapStats.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">아직 통계 데이터가 없습니다</p>
            <p className="text-sm text-muted-foreground mt-1">
              매치를 기록하면 요원과 맵 통계가 여기에 표시됩니다
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function MapsAgentsPage() {
  return (
    <MainLayout>
      <MapsAgentsContent />
    </MainLayout>
  )
}
