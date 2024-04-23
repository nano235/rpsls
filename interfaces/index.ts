import { Contract } from "ethers";
import { BaseContract } from "ethers";

export interface Wallet {
	label: string;
	icon: string;
	connectorName: string;
}

export interface Hand {
	label: string;
	icon: string;
	iconActive: string;
}

export enum Move {
	idle = "idle",
	rock = "rock",
	paper = "paper",
	scissors = "scissors",
	lizard = "lizard",
	spock = "spock",
}

export enum GameResult {
	idle = "idle",
	win = "win",
	loss = "loss",
	tie = "tie",
}

export interface Player {
	address: string;
	isPlaying: boolean;
	hasPlayed: boolean;
	move: Move;
	result: GameResult;
}

export interface GameRecovery {
	player: string;
	status: boolean;
}

export interface GlobalContext {
	player1: Player;
	setPlayer1: React.Dispatch<React.SetStateAction<Player>>;
	player2: Player;
	setPlayer2: React.Dispatch<React.SetStateAction<Player>>;
	isGameStarted: boolean;
	setIsGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
	isGameJoined: boolean;
	setIsGameJoined: React.Dispatch<React.SetStateAction<boolean>>;
	isTimerRunning: boolean;
	setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
	stakeAmount: string | number;
	setStakeAmount: React.Dispatch<React.SetStateAction<string | number>>;
	connected: boolean;
	setConnected: React.Dispatch<React.SetStateAction<boolean>>;
	account: string;
	setAccount: React.Dispatch<React.SetStateAction<string>>;
	balance: string;
	setBalance: React.Dispatch<React.SetStateAction<string>>;
	chainId: string;
	setChainId: React.Dispatch<React.SetStateAction<string>>;
	contractInstance: Contract | null;
	setContractInstance: React.Dispatch<React.SetStateAction<Contract | null>>;
	salt: string;
	setSalt: React.Dispatch<React.SetStateAction<string>>;
	timeout: number;
	setGameTimeout: React.Dispatch<React.SetStateAction<number>>;
	isGameRecoveryAvailable: GameRecovery;
	setIsGameRecoveryAvailable: React.Dispatch<React.SetStateAction<GameRecovery>>;
	joinedContractInstance: Contract | null;
	setJoinedContractInstance: React.Dispatch<React.SetStateAction<Contract | null>>;
	gameOver: boolean;
	setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
	isPageLoading: boolean;
	setIsPageLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
