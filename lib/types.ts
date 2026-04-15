export interface Player {
  id: string
  name: string
  team?: string
  kills: number
  deaths: number
  assists: number
  headshots: number
  matchesPlayed: number
  wins: number
  losses: number
  favoriteAgent: string
  favoriteMap: string
}

export interface Match {
  id: string
  date: string
  map: string
  team1: string
  team2: string
  team1Score: number
  team2Score: number
  players: MatchPlayer[]
  season: string
}

export interface MatchPlayer {
  playerId: string
  playerName: string
  team: string
  agent: string
  kills: number
  deaths: number
  assists: number
  acs: number
  adr: number
  headshots: number
}

export interface Agent {
  id: string
  name: string
  nameKo: string
  role: string
  roleKo: string
  image: string
}

export interface Map {
  id: string
  name: string
  nameKo: string
  image: string
}

export const AGENTS: Agent[] = [
  { id: 'jett', name: 'Jett', nameKo: '제트', role: 'Duelist', roleKo: '타격대', image: '/agents/jett.png' },
  { id: 'phoenix', name: 'Phoenix', nameKo: '피닉스', role: 'Duelist', roleKo: '타격대', image: '/agents/phoenix.png' },
  { id: 'reyna', name: 'Reyna', nameKo: '레이나', role: 'Duelist', roleKo: '타격대', image: '/agents/reyna.png' },
  { id: 'raze', name: 'Raze', nameKo: '레이즈', role: 'Duelist', roleKo: '타격대', image: '/agents/raze.png' },
  { id: 'yoru', name: 'Yoru', nameKo: '요루', role: 'Duelist', roleKo: '타격대', image: '/agents/yoru.png' },
  { id: 'neon', name: 'Neon', nameKo: '네온', role: 'Duelist', roleKo: '타격대', image: '/agents/neon.png' },
  { id: 'iso', name: 'Iso', nameKo: '아이소', role: 'Duelist', roleKo: '타격대', image: '/agents/iso.png' },
  { id: 'sage', name: 'Sage', nameKo: '세이지', role: 'Sentinel', roleKo: '감시자', image: '/agents/sage.png' },
  { id: 'cypher', name: 'Cypher', nameKo: '사이퍼', role: 'Sentinel', roleKo: '감시자', image: '/agents/cypher.png' },
  { id: 'killjoy', name: 'Killjoy', nameKo: '킬조이', role: 'Sentinel', roleKo: '감시자', image: '/agents/killjoy.png' },
  { id: 'chamber', name: 'Chamber', nameKo: '챔버', role: 'Sentinel', roleKo: '감시자', image: '/agents/chamber.png' },
  { id: 'deadlock', name: 'Deadlock', nameKo: '데드락', role: 'Sentinel', roleKo: '감시자', image: '/agents/deadlock.png' },
  { id: 'brimstone', name: 'Brimstone', nameKo: '브림스톤', role: 'Controller', roleKo: '전략가', image: '/agents/brimstone.png' },
  { id: 'omen', name: 'Omen', nameKo: '오멘', role: 'Controller', roleKo: '전략가', image: '/agents/omen.png' },
  { id: 'viper', name: 'Viper', nameKo: '바이퍼', role: 'Controller', roleKo: '전략가', image: '/agents/viper.png' },
  { id: 'astra', name: 'Astra', nameKo: '아스트라', role: 'Controller', roleKo: '전략가', image: '/agents/astra.png' },
  { id: 'harbor', name: 'Harbor', nameKo: '하버', role: 'Controller', roleKo: '전략가', image: '/agents/harbor.png' },
  { id: 'clove', name: 'Clove', nameKo: '클로브', role: 'Controller', roleKo: '전략가', image: '/agents/clove.png' },
  { id: 'sova', name: 'Sova', nameKo: '소바', role: 'Initiator', roleKo: '척후대', image: '/agents/sova.png' },
  { id: 'breach', name: 'Breach', nameKo: '브리치', role: 'Initiator', roleKo: '척후대', image: '/agents/breach.png' },
  { id: 'skye', name: 'Skye', nameKo: '스카이', role: 'Initiator', roleKo: '척후대', image: '/agents/skye.png' },
  { id: 'kayo', name: 'KAY/O', nameKo: '케이오', role: 'Initiator', roleKo: '척후대', image: '/agents/kayo.png' },
  { id: 'fade', name: 'Fade', nameKo: '페이드', role: 'Initiator', roleKo: '척후대', image: '/agents/fade.png' },
  { id: 'gekko', name: 'Gekko', nameKo: '게코', role: 'Initiator', roleKo: '척후대', image: '/agents/gekko.png' },
]

export const MAPS: Map[] = [
  { id: 'bind', name: 'Bind', nameKo: '바인드', image: '/maps/bind.png' },
  { id: 'haven', name: 'Haven', nameKo: '헤이븐', image: '/maps/haven.png' },
  { id: 'split', name: 'Split', nameKo: '스플릿', image: '/maps/split.png' },
  { id: 'ascent', name: 'Ascent', nameKo: '어센트', image: '/maps/ascent.png' },
  { id: 'icebox', name: 'Icebox', nameKo: '아이스박스', image: '/maps/icebox.png' },
  { id: 'breeze', name: 'Breeze', nameKo: '브리즈', image: '/maps/breeze.png' },
  { id: 'fracture', name: 'Fracture', nameKo: '프랙처', image: '/maps/fracture.png' },
  { id: 'pearl', name: 'Pearl', nameKo: '펄', image: '/maps/pearl.png' },
  { id: 'lotus', name: 'Lotus', nameKo: '로터스', image: '/maps/lotus.png' },
  { id: 'sunset', name: 'Sunset', nameKo: '선셋', image: '/maps/sunset.png' },
  { id: 'abyss', name: 'Abyss', nameKo: '어비스', image: '/maps/abyss.png' },
]

export const SEASONS = [
  '전체 시즌',
  'Season 1',
  'Season 2',
  'Season 3',
  'Season 4',
]

// Tournament Bracket Types
export interface BracketMatch {
  id: string
  round: number
  position: number
  team1: string | null
  team2: string | null
  team1Score: number | null
  team2Score: number | null
  winner: string | null
  nextMatchId: string | null
}

export interface TeamWithMembers {
  name: string
  members: string[]
}

export interface Tournament {
  id: string
  name: string
  date: string
  teamCount: 4 | 8 | 16
  teams: string[]
  teamMembers: Record<string, string[]>  // teamName -> memberNames
  matches: BracketMatch[]
  status: 'pending' | 'ongoing' | 'completed'
  season: string
}
