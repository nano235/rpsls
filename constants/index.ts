export const GAME_STARTED = 'GAME_STARTED'
export const GAME_WAIT_FOR_PLAYER = 'GAME_WAIT_FOR_PLAYER'
export const GAME_ERROR = 'GAME_ERROR'
export const WALLET_ERROR = 'WALLET_ERROR'

export const moveMapping: {[key: string]: number} = {
    rock: 1,
    paper: 2,
    scissors: 3,
    spock: 4,
    lizard: 5
};

export const timeout = 300000 // 5minutes