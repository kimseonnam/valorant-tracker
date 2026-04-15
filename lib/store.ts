import { Player, Match, MatchPlayer, AGENTS, MAPS, Tournament, BracketMatch } from './types'

// Mock data for demonstration
const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Shadow',
    team: 'Team Alpha',
    kills: 245,
    deaths: 180,
    assists: 89,
    headshots: 98,
    matchesPlayed: 15,
    wins: 9,
    losses: 6,
    favoriteAgent: 'Jett',
    favoriteMap: 'Ascent',
  },
  {
    id: '2',
    name: 'Phoenix',
    team: 'Team Alpha',
    kills: 220,
    deaths: 195,
    assists: 102,
    headshots: 75,
    matchesPlayed: 15,
    wins: 9,
    losses: 6,
    favoriteAgent: 'Reyna',
    favoriteMap: 'Bind',
  },
  {
    id: '3',
    name: 'Viper',
    team: 'Team Beta',
    kills: 198,
    deaths: 165,
    assists: 145,
    headshots: 62,
    matchesPlayed: 12,
    wins: 7,
    losses: 5,
    favoriteAgent: 'Omen',
    favoriteMap: 'Haven',
  },
  {
    id: '4',
    name: 'Ace',
    team: 'Team Beta',
    kills: 276,
    deaths: 190,
    assists: 78,
    headshots: 115,
    matchesPlayed: 14,
    wins: 8,
    losses: 6,
    favoriteAgent: 'Chamber',
    favoriteMap: 'Icebox',
  },
  {
    id: '5',
    name: 'Nova',
    team: 'Team Gamma',
    kills: 185,
    deaths: 175,
    assists: 167,
    headshots: 55,
    matchesPlayed: 13,
    wins: 6,
    losses: 7,
    favoriteAgent: 'Sage',
    favoriteMap: 'Pearl',
  },
]

const mockMatches: Match[] = [
  {
    id: '1',
    date: '2024-01-15',
    map: 'Ascent',
    team1: 'Team Alpha',
    team2: 'Team Beta',
    team1Score: 13,
    team2Score: 11,
    season: 'Season 1',
    players: [
      { playerId: '1', playerName: 'Shadow', team: 'Team Alpha', agent: 'Jett', kills: 24, deaths: 18, assists: 5, acs: 285, adr: 165, headshots: 10 },
      { playerId: '2', playerName: 'Phoenix', team: 'Team Alpha', agent: 'Reyna', kills: 19, deaths: 16, assists: 8, acs: 245, adr: 145, headshots: 7 },
      { playerId: '3', playerName: 'Viper', team: 'Team Beta', agent: 'Omen', kills: 16, deaths: 15, assists: 12, acs: 210, adr: 125, headshots: 5 },
      { playerId: '4', playerName: 'Ace', team: 'Team Beta', agent: 'Chamber', kills: 22, deaths: 17, assists: 4, acs: 268, adr: 155, headshots: 12 },
    ],
  },
  {
    id: '2',
    date: '2024-01-20',
    map: 'Haven',
    team1: 'Team Gamma',
    team2: 'Team Alpha',
    team1Score: 9,
    team2Score: 13,
    season: 'Season 1',
    players: [
      { playerId: '5', playerName: 'Nova', team: 'Team Gamma', agent: 'Sage', kills: 14, deaths: 17, assists: 15, acs: 180, adr: 105, headshots: 4 },
      { playerId: '1', playerName: 'Shadow', team: 'Team Alpha', agent: 'Jett', kills: 26, deaths: 12, assists: 6, acs: 310, adr: 180, headshots: 11 },
    ],
  },
  {
    id: '3',
    date: '2024-02-05',
    map: 'Bind',
    team1: 'Team Beta',
    team2: 'Team Gamma',
    team1Score: 13,
    team2Score: 7,
    season: 'Season 2',
    players: [
      { playerId: '3', playerName: 'Viper', team: 'Team Beta', agent: 'Viper', kills: 18, deaths: 10, assists: 14, acs: 235, adr: 138, headshots: 6 },
      { playerId: '4', playerName: 'Ace', team: 'Team Beta', agent: 'Jett', kills: 28, deaths: 11, assists: 3, acs: 325, adr: 185, headshots: 14 },
      { playerId: '5', playerName: 'Nova', team: 'Team Gamma', agent: 'Killjoy', kills: 12, deaths: 16, assists: 9, acs: 165, adr: 95, headshots: 3 },
    ],
  },
]

// Local storage keys
const PLAYERS_KEY = 'valorant_players'
const MATCHES_KEY = 'valorant_matches'
const TOURNAMENTS_KEY = 'valorant_tournaments'

// Initialize with mock data if empty
export function initializeStore() {
  if (typeof window === 'undefined') return

  const storedPlayers = localStorage.getItem(PLAYERS_KEY)
  const storedMatches = localStorage.getItem(MATCHES_KEY)

  if (!storedPlayers) {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(mockPlayers))
  }
  if (!storedMatches) {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(mockMatches))
  }
}

export function getPlayers(): Player[] {
  if (typeof window === 'undefined') return mockPlayers
  initializeStore()
  const data = localStorage.getItem(PLAYERS_KEY)
  return data ? JSON.parse(data) : mockPlayers
}

export function getMatches(): Match[] {
  if (typeof window === 'undefined') return mockMatches
  initializeStore()
  const data = localStorage.getItem(MATCHES_KEY)
  return data ? JSON.parse(data) : mockMatches
}

export function addPlayer(player: Omit<Player, 'id'>): Player {
  const players = getPlayers()
  const newPlayer: Player = {
    ...player,
    id: Date.now().toString(),
  }
  players.push(newPlayer)
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
  return newPlayer
}

export function updatePlayer(id: string, updates: Partial<Player>): Player | null {
  const players = getPlayers()
  const index = players.findIndex(p => p.id === id)
  if (index === -1) return null
  
  players[index] = { ...players[index], ...updates }
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
  return players[index]
}

export function deletePlayer(id: string): boolean {
  const players = getPlayers()
  const filtered = players.filter(p => p.id !== id)
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(filtered))
  return filtered.length < players.length
}

export function addMatch(match: Omit<Match, 'id'>): Match {
  const matches = getMatches()
  const newMatch: Match = {
    ...match,
    id: Date.now().toString(),
  }
  matches.push(newMatch)
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches))
  
  // Update player stats based on match results
  updatePlayerStatsFromMatch(newMatch)
  
  return newMatch
}

function updatePlayerStatsFromMatch(match: Match) {
  const players = getPlayers()
  
  match.players.forEach(mp => {
    const player = players.find(p => p.id === mp.playerId)
    if (player) {
      player.kills += mp.kills
      player.deaths += mp.deaths
      player.assists += mp.assists
      player.headshots += mp.headshots
      player.matchesPlayed += 1
      
      const isWinner = 
        (mp.team === match.team1 && match.team1Score > match.team2Score) ||
        (mp.team === match.team2 && match.team2Score > match.team1Score)
      
      if (isWinner) {
        player.wins += 1
      } else {
        player.losses += 1
      }
    }
  })
  
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
}

export function deleteMatch(id: string): boolean {
  const matches = getMatches()
  const filtered = matches.filter(m => m.id !== id)
  localStorage.setItem(MATCHES_KEY, JSON.stringify(filtered))
  return filtered.length < matches.length
}

// Statistics helpers
export function getTotalKills(): number {
  return getPlayers().reduce((sum, p) => sum + p.kills, 0)
}

export function getTotalMatches(): number {
  return getMatches().length
}

export function getAverageKDA(): number {
  const players = getPlayers()
  if (players.length === 0) return 0
  
  const totalKills = players.reduce((sum, p) => sum + p.kills, 0)
  const totalDeaths = players.reduce((sum, p) => sum + p.deaths, 0)
  const totalAssists = players.reduce((sum, p) => sum + p.assists, 0)
  
  if (totalDeaths === 0) return totalKills + totalAssists
  return Number(((totalKills + totalAssists) / totalDeaths).toFixed(2))
}

export function getMostPlayedMap(): { name: string; count: number } {
  const matches = getMatches()
  if (matches.length === 0) return { name: '없음', count: 0 }
  
  const mapCounts: Record<string, number> = {}
  matches.forEach(m => {
    mapCounts[m.map] = (mapCounts[m.map] || 0) + 1
  })
  
  let maxMap = ''
  let maxCount = 0
  Object.entries(mapCounts).forEach(([map, count]) => {
    if (count > maxCount) {
      maxMap = map
      maxCount = count
    }
  })
  
  return { name: maxMap || '없음', count: maxCount }
}

export function getMostPlayedAgent(): { name: string; count: number } {
  const matches = getMatches()
  if (matches.length === 0) return { name: '없음', count: 0 }
  
  const agentCounts: Record<string, number> = {}
  matches.forEach(m => {
    m.players.forEach(p => {
      agentCounts[p.agent] = (agentCounts[p.agent] || 0) + 1
    })
  })
  
  let maxAgent = ''
  let maxCount = 0
  Object.entries(agentCounts).forEach(([agent, count]) => {
    if (count > maxCount) {
      maxAgent = agent
      maxCount = count
    }
  })
  
  return { name: maxAgent || '없음', count: maxCount }
}

export function getPlayerRankings(): (Player & { kda: number; winRate: number })[] {
  const players = getPlayers()
  return players
    .map(p => ({
      ...p,
      kda: p.deaths === 0 ? p.kills + p.assists : Number(((p.kills + p.assists) / p.deaths).toFixed(2)),
      winRate: p.matchesPlayed === 0 ? 0 : Number(((p.wins / p.matchesPlayed) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.kda - a.kda)
}

export function getRecentMatches(limit: number = 5): Match[] {
  const matches = getMatches()
  return [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit)
}

export function getMatchesBySeason(season: string): Match[] {
  const matches = getMatches()
  if (season === '전체 시즌') return matches
  return matches.filter(m => m.season === season)
}

export function getAgentStats(): { agent: string; picks: number; wins: number; losses: number }[] {
  const matches = getMatches()
  const stats: Record<string, { picks: number; wins: number; losses: number }> = {}
  
  AGENTS.forEach(a => {
    stats[a.name] = { picks: 0, wins: 0, losses: 0 }
  })
  
  matches.forEach(m => {
    m.players.forEach(p => {
      if (stats[p.agent]) {
        stats[p.agent].picks += 1
        
        const isWinner = 
          (p.team === m.team1 && m.team1Score > m.team2Score) ||
          (p.team === m.team2 && m.team2Score > m.team1Score)
        
        if (isWinner) {
          stats[p.agent].wins += 1
        } else {
          stats[p.agent].losses += 1
        }
      }
    })
  })
  
  return Object.entries(stats)
    .map(([agent, data]) => ({ agent, ...data }))
    .filter(s => s.picks > 0)
    .sort((a, b) => b.picks - a.picks)
}

export function getMapStats(): { map: string; plays: number; team1Wins: number; team2Wins: number }[] {
  const matches = getMatches()
  const stats: Record<string, { plays: number; team1Wins: number; team2Wins: number }> = {}
  
  MAPS.forEach(m => {
    stats[m.name] = { plays: 0, team1Wins: 0, team2Wins: 0 }
  })
  
  matches.forEach(m => {
    if (stats[m.map]) {
      stats[m.map].plays += 1
      if (m.team1Score > m.team2Score) {
        stats[m.map].team1Wins += 1
      } else {
        stats[m.map].team2Wins += 1
      }
    }
  })
  
  return Object.entries(stats)
    .map(([map, data]) => ({ map, ...data }))
    .filter(s => s.plays > 0)
    .sort((a, b) => b.plays - a.plays)
}

// Tournament functions
export function getTournaments(): Tournament[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(TOURNAMENTS_KEY)
  return data ? JSON.parse(data) : []
}

export function getTournamentById(id: string): Tournament | null {
  const tournaments = getTournaments()
  return tournaments.find(t => t.id === id) || null
}

export function createTournament(
  name: string,
  date: string,
  teamCount: 4 | 8 | 16,
  teams: string[],
  teamMembers: Record<string, string[]>,
  season: string
): Tournament {
  const tournaments = getTournaments()
  
  // Generate bracket matches
  const matches: BracketMatch[] = []
  const totalRounds = Math.log2(teamCount)
  let matchId = 1
  
  // Create all matches for each round
  for (let round = 1; round <= totalRounds; round++) {
    const matchesInRound = teamCount / Math.pow(2, round)
    for (let pos = 0; pos < matchesInRound; pos++) {
      const nextRound = round + 1
      const nextPos = Math.floor(pos / 2)
      const nextMatchId = round < totalRounds 
        ? `${Date.now()}-r${nextRound}-p${nextPos}`
        : null
      
      matches.push({
        id: `${Date.now()}-r${round}-p${pos}`,
        round,
        position: pos,
        team1: round === 1 ? teams[pos * 2] || null : null,
        team2: round === 1 ? teams[pos * 2 + 1] || null : null,
        team1Score: null,
        team2Score: null,
        winner: null,
        nextMatchId,
      })
      matchId++
    }
  }
  
  // Fix nextMatchId references
  for (let round = 1; round < totalRounds; round++) {
    const currentRoundMatches = matches.filter(m => m.round === round)
    const nextRoundMatches = matches.filter(m => m.round === round + 1)
    
    currentRoundMatches.forEach((match, idx) => {
      const nextMatchIdx = Math.floor(idx / 2)
      if (nextRoundMatches[nextMatchIdx]) {
        match.nextMatchId = nextRoundMatches[nextMatchIdx].id
      }
    })
  }
  
  const newTournament: Tournament = {
    id: Date.now().toString(),
    name,
    date,
    teamCount,
    teams,
    teamMembers,
    matches,
    status: 'pending',
    season,
  }
  
  tournaments.push(newTournament)
  localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments))
  return newTournament
}

export function updateTournamentMatch(
  tournamentId: string,
  matchId: string,
  team1Score: number,
  team2Score: number
): Tournament | null {
  const tournaments = getTournaments()
  const tournament = tournaments.find(t => t.id === tournamentId)
  if (!tournament) return null
  
  const match = tournament.matches.find(m => m.id === matchId)
  if (!match || !match.team1 || !match.team2) return null
  
  match.team1Score = team1Score
  match.team2Score = team2Score
  match.winner = team1Score > team2Score ? match.team1 : match.team2
  
  // Advance winner to next match
  if (match.nextMatchId) {
    const nextMatch = tournament.matches.find(m => m.id === match.nextMatchId)
    if (nextMatch) {
      // Find position in next match (top or bottom)
      const currentRoundMatches = tournament.matches
        .filter(m => m.round === match.round)
        .sort((a, b) => a.position - b.position)
      const matchIndex = currentRoundMatches.findIndex(m => m.id === match.id)
      
      if (matchIndex % 2 === 0) {
        nextMatch.team1 = match.winner
      } else {
        nextMatch.team2 = match.winner
      }
    }
  }
  
  // Update tournament status
  const allMatchesCompleted = tournament.matches.every(m => m.winner !== null)
  const hasStarted = tournament.matches.some(m => m.winner !== null)
  
  if (allMatchesCompleted) {
    tournament.status = 'completed'
  } else if (hasStarted) {
    tournament.status = 'ongoing'
  }
  
  localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments))
  return tournament
}

export function deleteTournament(id: string): boolean {
  const tournaments = getTournaments()
  const filtered = tournaments.filter(t => t.id !== id)
  localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(filtered))
  return filtered.length < tournaments.length
}
