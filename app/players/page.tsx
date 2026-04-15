'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getPlayers, addPlayer, deletePlayer } from '@/lib/store'
import { Player, AGENTS, MAPS } from '@/lib/types'
import { useAdmin } from '@/lib/admin-context'
import { Users, Plus, Trash2, UserCircle, Shield, ShieldOff, Lock, LogOut } from 'lucide-react'

function AdminLoginDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void 
}) {
  const { login } = useAdmin()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (login(code)) {
      setCode('')
      setError('')
      onOpenChange(false)
    } else {
      setError('잘못된 관리자 코드입니다')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            관리자 인증
          </DialogTitle>
          <DialogDescription>
            관리자 코드를 입력하여 플레이어 관리 권한을 얻으세요.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>관리자 코드</FieldLabel>
            <Input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError('')
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="관리자 코드를 입력하세요"
              className="bg-secondary border-border"
            />
            {error && (
              <p className="text-sm text-red-400 mt-1">{error}</p>
            )}
          </Field>
          <Button 
            onClick={handleLogin} 
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            <Lock className="h-4 w-4 mr-2" />
            인증하기
          </Button>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  )
}

// Helper functions to get Korean names
const getAgentKoName = (agentName: string) => {
  const agent = AGENTS.find(a => a.name === agentName)
  return agent?.nameKo || agentName
}

const getMapKoName = (mapName: string) => {
  const map = MAPS.find(m => m.name === mapName)
  return map?.nameKo || mapName
}

function PlayersContent() {
  const { isAdmin, logout } = useAdmin()
  const [players, setPlayers] = useState<Player[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    team: '',
    favoriteAgent: AGENTS[0].name,
    favoriteMap: MAPS[0].name,
  })

  useEffect(() => {
    setPlayers(getPlayers())
  }, [])

  const handleAddPlayer = () => {
    if (!newPlayer.name.trim()) return

    const player = addPlayer({
      name: newPlayer.name,
      team: newPlayer.team,
      favoriteAgent: newPlayer.favoriteAgent,
      favoriteMap: newPlayer.favoriteMap,
      kills: 0,
      deaths: 0,
      assists: 0,
      headshots: 0,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
    })

    setPlayers([...players, player])
    setNewPlayer({
      name: '',
      team: '',
      favoriteAgent: AGENTS[0].name,
      favoriteMap: MAPS[0].name,
    })
    setIsDialogOpen(false)
  }

  const handleEdit = (player: Player) => {
  alert(player.name + " 수정 기능 준비중!");
  }

  const handleDeletePlayer = (id: string) => {
    if (confirm('이 플레이어를 삭제하시겠습니까?')) {
      deletePlayer(id)
      setPlayers(players.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            플레이어 관리
          </h1>
          <p className="text-muted-foreground mt-1">내전 참가자 등록 및 관리</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                <Shield className="h-3 w-3 mr-1" />
                관리자 모드
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-1" />
                로그아웃
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-black hover:bg-gray-200">
                    <Plus className="h-4 w-4 mr-2" />
                    플레이어 추가
                  </Button>
                </DialogTrigger>
<DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>새 플레이어 등록</DialogTitle>
            <DialogDescription>
              새로운 플레이어 정보를 입력하세요.
            </DialogDescription>
          </DialogHeader>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>이름</FieldLabel>
                      <Input
                        value={newPlayer.name}
                        onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        placeholder="플레이어 이름"
                        className="bg-secondary border-border"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>팀</FieldLabel>
                      <Input
                        value={newPlayer.team}
                        onChange={(e) => setNewPlayer({ ...newPlayer, team: e.target.value })}
                        placeholder="팀 이름 (선택)"
                        className="bg-secondary border-border"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>주 요원</FieldLabel>
                      <Select
                        value={newPlayer.favoriteAgent}
                        onValueChange={(value) => setNewPlayer({ ...newPlayer, favoriteAgent: value })}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AGENTS.map((agent) => (
                            <SelectItem key={agent.id} value={agent.name}>
                              {agent.nameKo} ({agent.roleKo})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>선호 맵</FieldLabel>
                      <Select
                        value={newPlayer.favoriteMap}
                        onValueChange={(value) => setNewPlayer({ ...newPlayer, favoriteMap: value })}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MAPS.map((map) => (
                            <SelectItem key={map.id} value={map.name}>
                              {map.nameKo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Button onClick={handleAddPlayer} className="w-full bg-white text-black hover:bg-gray-200">
                      등록하기
                    </Button>
                  </FieldGroup>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsLoginDialogOpen(true)}
              className="border-border"
            >
              <ShieldOff className="h-4 w-4 mr-2" />
              관리자 로그인
            </Button>
          )}
        </div>
      </div>

      <AdminLoginDialog 
        open={isLoginDialogOpen} 
        onOpenChange={setIsLoginDialogOpen} 
      />

      {/* Player Cards - Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => {
          const kda = player.deaths === 0 
            ? player.kills + player.assists 
            : ((player.kills + player.assists) / player.deaths).toFixed(2)
          const winRate = player.matchesPlayed === 0 
            ? 0 
            : ((player.wins / player.matchesPlayed) * 100).toFixed(1)

          return (
            <Card key={player.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <UserCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{player.name}</CardTitle>
                      {player.team && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {player.team}
                        </Badge>
                      )}
                    </div>
                  </div>

<CardHeader>
  <div className="flex items-start justify-between">
    <div>
      <CardTitle className="text-base">{player.name}</CardTitle>
      {player.team && (
        <Badge variant="outline" className="text-xs mt-1">
          {player.team}
        </Badge>
      )}
    </div>

    {isAdmin && (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-blue-400"
          onClick={() => handleEdit(player)}
        >
          ✏️
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-red-400"
          onClick={() => handleDeletePlayer(player.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
    )}
</CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">매치</p>
                    <p className="font-semibold">{player.matchesPlayed}게임</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">승률</p>
                    <p className="font-semibold">{winRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">K/D/A</p>
                    <p className="font-mono">
                      <span className="text-green-400">{player.kills}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-red-400">{player.deaths}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-blue-400">{player.assists}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">KDA</p>
                    <p className="font-semibold">{kda}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">주요원:</span>
                    <Badge variant="secondary">{getAgentKoName(player.favoriteAgent)}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">맵:</span>
                    <Badge variant="outline">{getMapKoName(player.favoriteMap)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {players.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">등록된 플레이어가 없습니다</p>
            {isAdmin ? (
              <p className="text-sm text-muted-foreground mt-1">
                위의 버튼을 눌러 플레이어를 추가해주세요
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                관리자 로그인 후 플레이어를 추가할 수 있습니다
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Player Table View */}
      {players.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">전체 플레이어 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>이름</TableHead>
                    <TableHead>팀</TableHead>
                    <TableHead className="text-center">매치</TableHead>
                    <TableHead className="text-center">승/패</TableHead>
                    <TableHead className="text-center">K/D/A</TableHead>
                    <TableHead className="text-center">HS</TableHead>
                    <TableHead className="text-center">주요원</TableHead>
                    <TableHead className="text-center">선호맵</TableHead>
                    {isAdmin && <TableHead></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player) => (
                    <TableRow key={player.id} className="border-border">
                      <TableCell className="font-semibold">{player.name}</TableCell>
                      <TableCell>
                        {player.team ? (
                          <Badge variant="outline" className="text-xs">
                            {player.team}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {player.matchesPlayed}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        <span className="text-green-400">{player.wins}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-red-400">{player.losses}</span>
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        <span className="text-green-400">{player.kills}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-red-400">{player.deaths}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-blue-400">{player.assists}</span>
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {player.headshots}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {getAgentKoName(player.favoriteAgent)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">
                          {getMapKoName(player.favoriteMap)}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-red-400"
                            onClick={() => handleDeletePlayer(player.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function PlayersPage() {
  return (
    <MainLayout>
      <PlayersContent />
    </MainLayout>
  )
}
