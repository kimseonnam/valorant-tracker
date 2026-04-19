'use client'

import { useEffect, useState } from 'react'
import { MainLayout, useApp } from '@/components/main-layout'
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getMatches, getPlayers, addMatch, deleteMatch, getMatchesBySeason } from '@/lib/store'
import { Match, MatchPlayer, Player, AGENTS, MAPS, SEASONS } from '@/lib/types'
import { useAdmin } from '@/lib/admin-context'
import { FileText, Plus, Trash2, Swords, Calendar, MapPin, Shield, ShieldOff, Lock, LogOut } from 'lucide-react'

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
            관리자 코드를 입력하여 매치 관리 권한을 얻으세요.
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

function MatchesContent() {
  const { selectedSeason } = useApp()
  const { isAdmin, logout } = useAdmin()
  const [matches, setMatches] = useState<Match[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [newMatch, setNewMatch] = useState({
    date: new Date().toISOString().split('T')[0],
    map: MAPS[0].name,
    team1: '',
    team2: '',
    team1Score: 0,
    team2Score: 0,
    season: 'Season 1',
    players: [] as MatchPlayer[],
  })
  const [selectedPlayer, setSelectedPlayer] = useState<{
    playerId: string
    team: string
    agent: string
    kills: number
    deaths: number
    assists: number
    acs: number
    adr: number
    headshots: number
  }>({
    playerId: '',
    team: '',
    agent: AGENTS[0].name,
    kills: 0,
    deaths: 0,
    assists: 0,
    acs: 0,
    adr: 0,
    headshots: 0,
  })

  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ocrPreview, setOcrPreview] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setMatches(getMatchesBySeason(selectedSeason))
    setPlayers(getPlayers())
  }, [selectedSeason])

const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  setSelectedImage(file);
};

const handleAnalyzeImage = async () => {
  if (!selectedImage) {
    alert("이미지를 선택해주세요.");
    return;
  }

  setIsAnalyzing(true);

  try {
    const formData = new FormData();
    formData.append("image", selectedImage);

    const res = await fetch("/api/matches/analyze-image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("이미지 분석 실패");
    }

    const data = await res.json();
    setOcrPreview(data);
  } catch (error) {
    console.error(error);
    alert("이미지 분석 중 오류가 발생했습니다.");
  } finally {
    setIsAnalyzing(false);
  }
};

const handleConfirmMatchSave = () => {
  if (!ocrPreview) {
    alert("분석된 데이터가 없습니다.");
    return;
  }

  console.log("저장할 매치 데이터:", ocrPreview);
  alert("저장 준비 완료 (다음 단계에서 실제 저장 연결)");
};

  const handleAddPlayerToMatch = () => {
    if (!selectedPlayer.playerId) return
    const player = players.find(p => p.id === selectedPlayer.playerId)
    if (!player) return

    const matchPlayer: MatchPlayer = {
      playerId: selectedPlayer.playerId,
      playerName: player.name,
      team: selectedPlayer.team || newMatch.team1,
      agent: selectedPlayer.agent,
      kills: selectedPlayer.kills,
      deaths: selectedPlayer.deaths,
      assists: selectedPlayer.assists,
      acs: selectedPlayer.acs,
      adr: selectedPlayer.adr,
      headshots: selectedPlayer.headshots,
    }

    setNewMatch({
      ...newMatch,
      players: [...newMatch.players, matchPlayer],
    })

    setSelectedPlayer({
      playerId: '',
      team: '',
      agent: AGENTS[0].name,
      kills: 0,
      deaths: 0,
      assists: 0,
      acs: 0,
      adr: 0,
      headshots: 0,
    })
  }

  const handleAddMatch = () => {
    if (!newMatch.team1 || !newMatch.team2) return

    addMatch({
      date: newMatch.date,
      map: newMatch.map,
      team1: newMatch.team1,
      team2: newMatch.team2,
      team1Score: newMatch.team1Score,
      team2Score: newMatch.team2Score,
      season: newMatch.season,
      players: newMatch.players,
    })

    setMatches(getMatchesBySeason(selectedSeason))
    setNewMatch({
      date: new Date().toISOString().split('T')[0],
      map: MAPS[0].name,
      team1: '',
      team2: '',
      team1Score: 0,
      team2Score: 0,
      season: 'Season 1',
      players: [],
    })
    setIsDialogOpen(false)
  }

  const handleDeleteMatch = (id: string) => {
    if (confirm('이 매치를 삭제하시겠습니까?')) {
      deleteMatch(id)
      setMatches(matches.filter((m) => m.id !== id))
    }
  }

  const removePlayerFromMatch = (index: number) => {
    setNewMatch({
      ...newMatch,
      players: newMatch.players.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            매치 기록
          </h1>
          <p className="text-muted-foreground mt-1">내전 경기 결과 기록 및 관리</p>
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

<Button
  variant="outline"
  onClick={() => setIsImageUploadOpen(true)}
  className="border-border bg-card hover:bg-accent"
>
  이미지 등록
</Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-black hover:bg-gray-200">
                    <Plus className="h-4 w-4 mr-2" />
                    매치 추가
                  </Button>
                </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 매치 등록</DialogTitle>
              <DialogDescription>
                새로운 매치 정보를 입력하세요.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>날짜</FieldLabel>
                  <Input
                    type="date"
                    value={newMatch.date}
                    onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </Field>
                <Field>
                  <FieldLabel>시즌</FieldLabel>
                  <Select
                    value={newMatch.season}
                    onValueChange={(value) => setNewMatch({ ...newMatch, season: value })}
                  >
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

              <Field>
                <FieldLabel>맵</FieldLabel>
                <Select
                  value={newMatch.map}
                  onValueChange={(value) => setNewMatch({ ...newMatch, map: value })}
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

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>팀 1</FieldLabel>
                  <Input
                    value={newMatch.team1}
                    onChange={(e) => setNewMatch({ ...newMatch, team1: e.target.value })}
                    placeholder="팀 이름"
                    className="bg-secondary border-border"
                  />
                </Field>
                <Field>
                  <FieldLabel>팀 2</FieldLabel>
                  <Input
                    value={newMatch.team2}
                    onChange={(e) => setNewMatch({ ...newMatch, team2: e.target.value })}
                    placeholder="팀 이름"
                    className="bg-secondary border-border"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>팀 1 점수</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={13}
                    value={newMatch.team1Score}
                    onChange={(e) => setNewMatch({ ...newMatch, team1Score: parseInt(e.target.value) || 0 })}
                    className="bg-secondary border-border"
                  />
                </Field>
                <Field>
                  <FieldLabel>팀 2 점수</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    max={13}
                    value={newMatch.team2Score}
                    onChange={(e) => setNewMatch({ ...newMatch, team2Score: parseInt(e.target.value) || 0 })}
                    className="bg-secondary border-border"
                  />
                </Field>
              </div>

              {/* Players Section */}
              <div className="border-t border-border pt-4 mt-4">
                <h4 className="font-semibold mb-4">플레이어 추가 (선택)</h4>
                
                {newMatch.players.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {newMatch.players.map((mp, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-secondary/50 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{mp.team}</Badge>
                          <span>{mp.playerName}</span>
                          <Badge variant="secondary">{mp.agent}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">
                            {mp.kills}/{mp.deaths}/{mp.assists}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removePlayerFromMatch(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>플레이어</FieldLabel>
                    <Select
                      value={selectedPlayer.playerId}
                      onValueChange={(value) => setSelectedPlayer({ ...selectedPlayer, playerId: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>팀</FieldLabel>
                    <Select
                      value={selectedPlayer.team}
                      onValueChange={(value) => setSelectedPlayer({ ...selectedPlayer, team: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {newMatch.team1 && <SelectItem value={newMatch.team1}>{newMatch.team1}</SelectItem>}
                        {newMatch.team2 && <SelectItem value={newMatch.team2}>{newMatch.team2}</SelectItem>}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Field>
                    <FieldLabel>요원</FieldLabel>
                    <Select
                      value={selectedPlayer.agent}
                      onValueChange={(value) => setSelectedPlayer({ ...selectedPlayer, agent: value })}
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
                  <div className="grid grid-cols-3 gap-2">
                    <Field>
                      <FieldLabel>킬</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        value={selectedPlayer.kills}
                        onChange={(e) => setSelectedPlayer({ ...selectedPlayer, kills: parseInt(e.target.value) || 0 })}
                        className="bg-secondary border-border"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>데스</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        value={selectedPlayer.deaths}
                        onChange={(e) => setSelectedPlayer({ ...selectedPlayer, deaths: parseInt(e.target.value) || 0 })}
                        className="bg-secondary border-border"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>어시</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        value={selectedPlayer.assists}
                        onChange={(e) => setSelectedPlayer({ ...selectedPlayer, assists: parseInt(e.target.value) || 0 })}
                        className="bg-secondary border-border"
                      />
                    </Field>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleAddPlayerToMatch}
                  disabled={!selectedPlayer.playerId}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  플레이어 추가
                </Button>
              </div>

              <Button onClick={handleAddMatch} className="w-full bg-white text-black hover:bg-gray-200 mt-4">
                매치 등록하기
              </Button>
            </FieldGroup>
          </DialogContent>
        </Dialog>
  <Dialog open={isImageUploadOpen} onOpenChange={setIsImageUploadOpen}>
  <DialogContent className="bg-card border-border max-w-2xl">
    <DialogHeader>
      <DialogTitle>매치 결과 이미지 등록</DialogTitle>
      <DialogDescription>
        내전 결과 이미지를 업로드하면 자동으로 분석합니다.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
      />

      <Button
        onClick={handleAnalyzeImage}
        disabled={!selectedImage || isAnalyzing}
      >
        {isAnalyzing ? "분석 중..." : "이미지 분석하기"}
      </Button>

      {ocrPreview && (
        <div className="space-y-3 border p-3 rounded">
          <div>맵: {ocrPreview.map}</div>

          <div>
            점수: {ocrPreview.team1} {ocrPreview.team1Score} : {ocrPreview.team2Score} {ocrPreview.team2}
          </div>

          <div className="space-y-2">
            {ocrPreview.players?.map((p: any, i: number) => (
              <div key={i} className="border p-2 rounded">
                {p.nickname} → {p.matchedPlayerName || "미매칭"}
              </div>
            ))}
          </div>

          <Button onClick={handleConfirmMatchSave}>
            저장하기
          </Button>
             )}
            </div>
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

      {/* Matches List */}
      {matches.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">기록된 매치가 없습니다</p>
            {isAdmin ? (
              <p className="text-sm text-muted-foreground mt-1">
                위의 버튼을 눌러 매치를 추가해주세요
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                관리자 로그인 후 매치를 추가할 수 있습니다
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {matches.map((match) => {
            const team1Won = match.team1Score > match.team2Score

            return (
              <AccordionItem key={match.id} value={match.id} className="border border-border rounded-lg bg-card overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(match.date).toLocaleDateString('ko-KR')}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {match.map}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {match.season}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={team1Won ? 'font-bold text-white' : 'text-muted-foreground'}>
                        {match.team1}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-lg">
                        <span className={team1Won ? 'text-green-400 font-bold' : 'text-muted-foreground'}>
                          {match.team1Score}
                        </span>
                        <Swords className="h-4 w-4 text-muted-foreground" />
                        <span className={!team1Won ? 'text-green-400 font-bold' : 'text-muted-foreground'}>
                          {match.team2Score}
                        </span>
                      </div>
                      <span className={!team1Won ? 'font-bold text-white' : 'text-muted-foreground'}>
                        {match.team2}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {match.players.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead>팀</TableHead>
                            <TableHead>플레이어</TableHead>
                            <TableHead>요원</TableHead>
                            <TableHead className="text-center">K/D/A</TableHead>
                            <TableHead className="text-center">ACS</TableHead>
                            <TableHead className="text-center">ADR</TableHead>
                            <TableHead className="text-center">HS</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {match.players.map((player, index) => (
                            <TableRow key={index} className="border-border">
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {player.team}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-semibold">
                                {player.playerName}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs">
                                  {player.agent}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                <span className="text-green-400">{player.kills}</span>
                                <span className="text-muted-foreground">/</span>
                                <span className="text-red-400">{player.deaths}</span>
                                <span className="text-muted-foreground">/</span>
                                <span className="text-blue-400">{player.assists}</span>
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                {player.acs}
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                {player.adr}
                              </TableCell>
                              <TableCell className="text-center font-mono">
                                {player.headshots}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      이 매치에 등록된 플레이어 정보가 없습니다
                    </div>
                  )}
                  {isAdmin && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-red-400"
                        onClick={() => handleDeleteMatch(match.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        매치 삭제
                      </Button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}
    </div>
  )
}

export default function MatchesPage() {
  return (
    <MainLayout>
      <MatchesContent />
    </MainLayout>
  )
}
