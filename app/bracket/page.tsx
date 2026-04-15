'use client'

import { useState, useEffect } from 'react'
import { MainLayout, useApp } from '@/components/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAdmin } from '@/lib/admin-context'
import { 
  getTournaments, 
  createTournament, 
  updateTournamentMatch, 
  deleteTournament 
} from '@/lib/store'
import { Tournament, BracketMatch, SEASONS } from '@/lib/types'
import { 
  GitBranch, 
  Plus, 
  Trash2, 
  Trophy, 
  Shield, 
  ShieldOff, 
  Lock, 
  LogOut,
  Crown,
  Calendar,
  Users,
  Edit2,
  Check,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
            관리자 코드를 입력하여 대진표 관리 권한을 얻으세요.
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

// Match Score Editor Component
function MatchScoreEditor({
  match,
  onSave,
  onCancel
}: {
  match: BracketMatch
  onSave: (team1Score: number, team2Score: number) => void
  onCancel: () => void
}) {
  const [team1Score, setTeam1Score] = useState(match.team1Score?.toString() || '0')
  const [team2Score, setTeam2Score] = useState(match.team2Score?.toString() || '0')

  return (
    <div className="mt-3 p-3 bg-background/50 rounded-lg border border-border">
      <div className="text-xs text-muted-foreground mb-2 text-center">점수 입력 (승 수)</div>
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground truncate max-w-[60px]">{match.team1}</span>
          <Input
            type="number"
            min="0"
            max="99"
            value={team1Score}
            onChange={(e) => setTeam1Score(e.target.value)}
            className="w-16 h-10 text-center bg-secondary border-border text-lg font-bold"
          />
          <span className="text-xs text-muted-foreground">승</span>
        </div>
        <span className="text-xl font-bold text-muted-foreground">vs</span>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground truncate max-w-[60px]">{match.team2}</span>
          <Input
            type="number"
            min="0"
            max="99"
            value={team2Score}
            onChange={(e) => setTeam2Score(e.target.value)}
            className="w-16 h-10 text-center bg-secondary border-border text-lg font-bold"
          />
          <span className="text-xs text-muted-foreground">승</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-3">
        <Button
          size="sm"
          className="h-8 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => onSave(parseInt(team1Score) || 0, parseInt(team2Score) || 0)}
        >
          <Check className="h-4 w-4 mr-1" />
          저장
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 border-border"
          onClick={onCancel}
        >
          <X className="h-4 w-4 mr-1" />
          취소
        </Button>
      </div>
    </div>
  )
}

// Team Member Popover Component
function TeamMemberPopover({
  teamName,
  members,
  isWinner,
  children
}: {
  teamName: string | null
  members: string[]
  isWinner: boolean
  children: React.ReactNode
}) {
  if (!teamName || members.length === 0) {
    return <>{children}</>
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full text-left cursor-pointer hover:opacity-80 transition-opacity">
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-card border-border p-0" align="start">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            {isWinner && <Crown className="h-4 w-4 text-yellow-400" />}
            <span className="font-bold">{teamName}</span>
          </div>
        </div>
        <div className="p-3">
          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Users className="h-3 w-3" />
            팀 멤버 ({members.length}명)
          </div>
          <div className="space-y-1.5">
            {members.map((member, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 text-sm p-1.5 rounded bg-secondary/50"
              >
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {member.charAt(0).toUpperCase()}
                </div>
                <span>{member}</span>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Single Match Card in Bracket
function BracketMatchCard({
  match,
  isAdmin,
  onUpdateScore,
  roundName,
  teamMembers
}: {
  match: BracketMatch
  isAdmin: boolean
  onUpdateScore: (team1Score: number, team2Score: number) => void
  roundName: string
  teamMembers: Record<string, string[]>
}) {
  const [isEditing, setIsEditing] = useState(false)
  const canEdit = isAdmin && match.team1 && match.team2 && !match.winner

  // Format score as "X승 Y패" style
  const formatScore = (wins: number | null) => {
    if (wins === null) return null
    return `${wins}승`
  }

  const team1Members = match.team1 ? teamMembers[match.team1] || [] : []
  const team2Members = match.team2 ? teamMembers[match.team2] || [] : []

  return (
    <div className="bg-secondary/50 border border-border rounded-lg p-4 w-56">
      <div className="text-xs text-muted-foreground mb-3 text-center font-medium">{roundName}</div>
      
      {/* Team 1 */}
      <TeamMemberPopover 
        teamName={match.team1} 
        members={team1Members}
        isWinner={match.winner === match.team1}
      >
        <div className={cn(
          "flex items-center justify-between p-3 rounded-lg mb-2 transition-colors",
          match.winner === match.team1 
            ? "bg-green-500/20 border border-green-500/30" 
            : "bg-background/50 border border-transparent"
        )}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {match.winner === match.team1 && (
              <Crown className="h-4 w-4 text-yellow-400 shrink-0" />
            )}
            <span className={cn(
              "font-medium truncate",
              !match.team1 && "text-muted-foreground italic"
            )}>
              {match.team1 || 'TBD'}
            </span>
            {team1Members.length > 0 && (
              <Users className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
          </div>
          {match.team1Score !== null && (
            <Badge 
              variant="outline" 
              className={cn(
                "ml-2 text-sm font-bold shrink-0",
                match.winner === match.team1 
                  ? "bg-green-500/20 text-green-400 border-green-500/50" 
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {formatScore(match.team1Score)}
            </Badge>
          )}
        </div>
      </TeamMemberPopover>

      {/* VS Divider */}
      <div className="flex items-center justify-center my-1">
        <span className="text-xs text-muted-foreground font-medium">VS</span>
      </div>

      {/* Team 2 */}
      <TeamMemberPopover 
        teamName={match.team2} 
        members={team2Members}
        isWinner={match.winner === match.team2}
      >
        <div className={cn(
          "flex items-center justify-between p-3 rounded-lg transition-colors",
          match.winner === match.team2 
            ? "bg-green-500/20 border border-green-500/30" 
            : "bg-background/50 border border-transparent"
        )}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {match.winner === match.team2 && (
              <Crown className="h-4 w-4 text-yellow-400 shrink-0" />
            )}
            <span className={cn(
              "font-medium truncate",
              !match.team2 && "text-muted-foreground italic"
            )}>
              {match.team2 || 'TBD'}
            </span>
            {team2Members.length > 0 && (
              <Users className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
          </div>
          {match.team2Score !== null && (
            <Badge 
              variant="outline" 
              className={cn(
                "ml-2 text-sm font-bold shrink-0",
                match.winner === match.team2 
                  ? "bg-green-500/20 text-green-400 border-green-500/50" 
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {formatScore(match.team2Score)}
            </Badge>
          )}
        </div>
      </TeamMemberPopover>

      {/* Score Display when match is completed */}
      {match.winner && match.team1Score !== null && match.team2Score !== null && (
        <div className="mt-3 text-center">
          <div className="text-sm font-bold text-foreground">
            {match.team1Score} : {match.team2Score}
          </div>
          <div className="text-xs text-muted-foreground mt-1">최종 스코어</div>
        </div>
      )}

      {/* Edit Button / Score Editor */}
      {isEditing ? (
        <MatchScoreEditor
          match={match}
          onSave={(t1, t2) => {
            onUpdateScore(t1, t2)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : canEdit && (
        <Button
          size="sm"
          variant="outline"
          className="w-full mt-3 h-9 text-sm border-border hover:bg-white hover:text-black"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          점수 입력
        </Button>
      )}
    </div>
  )
}

// Tournament Bracket View
function TournamentBracket({
  tournament,
  isAdmin,
  onUpdateMatch,
  onDelete
}: {
  tournament: Tournament
  isAdmin: boolean
  onUpdateMatch: (matchId: string, team1Score: number, team2Score: number) => void
  onDelete: () => void
}) {
  const totalRounds = Math.log2(tournament.teamCount)
  const roundNames = ['1라운드', '8강', '4강', '준결승', '결승']
  
  const getRoundName = (round: number) => {
    if (round === totalRounds) return '결승'
    if (round === totalRounds - 1) return '준결승'
    if (totalRounds === 4) {
      if (round === 1) return '16강'
      if (round === 2) return '8강'
      if (round === 3) return '4강'
    }
    if (totalRounds === 3) {
      if (round === 1) return '8강'
      if (round === 2) return '4강'
    }
    if (totalRounds === 2) {
      if (round === 1) return '4강'
    }
    return `라운드 ${round}`
  }

  // Get winner of the tournament
  const finalMatch = tournament.matches.find(m => m.round === totalRounds)
  const champion = finalMatch?.winner

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            {tournament.name}
          </CardTitle>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {tournament.date}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {tournament.teamCount}팀
            </span>
            <Badge 
              variant="outline" 
              className={cn(
                tournament.status === 'completed' && "bg-green-500/10 text-green-400 border-green-500/30",
                tournament.status === 'ongoing' && "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
                tournament.status === 'pending' && "bg-gray-500/10 text-gray-400 border-gray-500/30"
              )}
            >
              {tournament.status === 'completed' ? '완료' : tournament.status === 'ongoing' ? '진행중' : '대기중'}
            </Badge>
          </div>
        </div>
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-red-400"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            삭제
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {/* Champion Display */}
        {champion && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Crown className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-yellow-400 font-medium">우승</p>
                <p className="text-xl font-bold">{champion}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bracket Display */}
        <div className="overflow-x-auto">
          <div className="flex gap-8 min-w-max py-4">
            {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => {
              const matchesInRound = tournament.matches
                .filter(m => m.round === round)
                .sort((a, b) => a.position - b.position)
              
              return (
                <div key={round} className="flex flex-col justify-around gap-4">
                  <div className="text-center text-sm font-medium text-muted-foreground mb-2">
                    {getRoundName(round)}
                  </div>
                  {matchesInRound.map((match) => (
                    <BracketMatchCard
                      key={match.id}
                      match={match}
                      isAdmin={isAdmin}
                      roundName=""
                      teamMembers={tournament.teamMembers || {}}
                      onUpdateScore={(t1, t2) => onUpdateMatch(match.id, t1, t2)}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BracketContent() {
  const { selectedSeason } = useApp()
  const { isAdmin, logout } = useAdmin()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  
  // New tournament form
  const [newName, setNewName] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTeamCount, setNewTeamCount] = useState<4 | 8 | 16>(8)
  const [newTeams, setNewTeams] = useState<string[]>(Array(8).fill(''))
  const [newTeamMembers, setNewTeamMembers] = useState<Record<string, string>>(
    Object.fromEntries(Array(8).fill('').map((_, i) => [`team_${i}`, '']))
  )
  const [newSeason, setNewSeason] = useState('Season 1')

  useEffect(() => {
    const loadTournaments = () => {
      let data = getTournaments()
      if (selectedSeason !== '전체 시즌') {
        data = data.filter(t => t.season === selectedSeason)
      }
      setTournaments(data)
    }
    loadTournaments()
  }, [selectedSeason])

  const handleTeamCountChange = (count: 4 | 8 | 16) => {
    setNewTeamCount(count)
    setNewTeams(Array(count).fill(''))
    setNewTeamMembers(
      Object.fromEntries(Array(count).fill('').map((_, i) => [`team_${i}`, '']))
    )
  }

  const handleCreateTournament = () => {
    if (!newName || !newDate) return
    
    const filledTeams = newTeams.filter(t => t.trim() !== '')
    if (filledTeams.length < 2) return

    // Convert team members input to record
    const teamMembersRecord: Record<string, string[]> = {}
    newTeams.forEach((teamName, idx) => {
      if (teamName.trim()) {
        const membersString = newTeamMembers[`team_${idx}`] || ''
        const members = membersString.split(',').map(m => m.trim()).filter(m => m)
        if (members.length > 0) {
          teamMembersRecord[teamName] = members
        }
      }
    })

    const tournament = createTournament(
      newName,
      newDate,
      newTeamCount,
      newTeams,
      teamMembersRecord,
      newSeason
    )
    
    setTournaments([...tournaments, tournament])
    setNewName('')
    setNewDate('')
    setNewTeamCount(8)
    setNewTeams(Array(8).fill(''))
    setNewTeamMembers(
      Object.fromEntries(Array(8).fill('').map((_, i) => [`team_${i}`, '']))
    )
    setIsDialogOpen(false)
  }

  const handleUpdateMatch = (tournamentId: string, matchId: string, team1Score: number, team2Score: number) => {
    const updated = updateTournamentMatch(tournamentId, matchId, team1Score, team2Score)
    if (updated) {
      setTournaments(tournaments.map(t => t.id === tournamentId ? updated : t))
    }
  }

  const handleDeleteTournament = (id: string) => {
    if (deleteTournament(id)) {
      setTournaments(tournaments.filter(t => t.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GitBranch className="h-6 w-6" />
            대진표
          </h1>
          <p className="text-muted-foreground mt-1">토너먼트 대진표 관리</p>
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
                    대회 생성
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>새 토너먼트 생성</DialogTitle>
                    <DialogDescription>
                      토너먼트 정보와 참가 팀을 입력하세요.
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>대회명</FieldLabel>
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="예: 2024 봄 시즌 대회"
                          className="bg-secondary border-border"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>날짜</FieldLabel>
                        <Input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="bg-secondary border-border"
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>팀 수</FieldLabel>
                        <Select 
                          value={newTeamCount.toString()} 
                          onValueChange={(v) => handleTeamCountChange(parseInt(v) as 4 | 8 | 16)}
                        >
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4">4팀</SelectItem>
                            <SelectItem value="8">8팀</SelectItem>
                            <SelectItem value="16">16팀</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel>시즌</FieldLabel>
                        <Select value={newSeason} onValueChange={setNewSeason}>
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEASONS.filter(s => s !== '전체 시즌').map((season) => (
                              <SelectItem key={season} value={season}>
                                {season}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    {/* Team Inputs */}
                    <div>
                      <FieldLabel className="mb-3">참가 팀 ({newTeamCount}팀)</FieldLabel>
                      <div className="space-y-4">
                        {newTeams.map((team, idx) => (
                          <div key={idx} className="p-3 bg-secondary/30 rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </div>
                              <Input
                                value={team}
                                onChange={(e) => {
                                  const updated = [...newTeams]
                                  updated[idx] = e.target.value
                                  setNewTeams(updated)
                                }}
                                placeholder={`팀 ${idx + 1} 이름`}
                                className="bg-secondary border-border flex-1"
                              />
                            </div>
                            <div className="flex items-start gap-2 ml-8">
                              <Users className="h-4 w-4 text-muted-foreground mt-2.5 shrink-0" />
                              <Input
                                value={newTeamMembers[`team_${idx}`] || ''}
                                onChange={(e) => {
                                  setNewTeamMembers(prev => ({
                                    ...prev,
                                    [`team_${idx}`]: e.target.value
                                  }))
                                }}
                                placeholder="멤버 이름 (쉼표로 구분: 홍길동, 김철수, 이영희)"
                                className="bg-background/50 border-border text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleCreateTournament} 
                      className="w-full bg-white text-black hover:bg-gray-200 mt-4"
                      disabled={!newName || !newDate || newTeams.filter(t => t.trim()).length < 2}
                    >
                      토너먼트 생성
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

      {/* Tournament List */}
      {tournaments.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">등록된 대회가 없습니다</p>
            {isAdmin ? (
              <p className="text-sm text-muted-foreground mt-1">
                위의 버튼을 눌러 대회를 생성해주세요
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                관리자 로그인 후 대회를 생성할 수 있습니다
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {tournaments.map((tournament) => (
            <TournamentBracket
              key={tournament.id}
              tournament={tournament}
              isAdmin={isAdmin}
              onUpdateMatch={(matchId, t1, t2) => handleUpdateMatch(tournament.id, matchId, t1, t2)}
              onDelete={() => handleDeleteTournament(tournament.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function BracketPage() {
  return (
    <MainLayout>
      <BracketContent />
    </MainLayout>
  )
}
