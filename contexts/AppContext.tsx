"use client";

import { GameRecovery, GameResult, GlobalContext, Move, Player } from "@/interfaces";
import { Contract } from "ethers";
import React, { useState, useContext, createContext } from "react";

const AppContext = createContext<GlobalContext | null>(null);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
	const [isGameJoined, setIsGameJoined] = useState<boolean>(false);
	const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
	const [timeout, setGameTimeout] = useState<number>(300000);
	const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

	const [account, setAccount] = useState<string>("");
	const [connected, setConnected] = useState<boolean>(false);
	const [balance, setBalance] = useState<string>("");
	const [chainId, setChainId] = useState<string>("");

	const [contractInstance, setContractInstance] = useState<Contract | null>(null);
	const [joinedContractInstance, setJoinedContractInstance] =
		useState<Contract | null>(null);
	const [salt, setSalt] = useState<string>("");
	const [gameOver, setGameOver] = useState<boolean>(false);

	const [player1, setPlayer1] = useState<Player>({
		address: "",
		move: Move.idle,
		isPlaying: false,
		hasPlayed: false,
		result: GameResult.idle,
	});

	const [player2, setPlayer2] = useState<Player>({
		address: "",
		move: Move.idle,
		isPlaying: false,
		hasPlayed: false,
		result: GameResult.idle,
	});

	const [stakeAmount, setStakeAmount] = useState<number | string>("");
	const [isGameRecoveryAvailable, setIsGameRecoveryAvailable] = useState<GameRecovery>({
		player: "",
		status: false,
	});
	return (
		<AppContext.Provider
			value={{
				isGameStarted,
				setIsGameStarted,
				player1,
				setPlayer1,
				player2,
				setPlayer2,
				isTimerRunning,
				setIsTimerRunning,
				stakeAmount,
				setStakeAmount,
				account,
				setAccount,
				connected,
				setConnected,
				balance,
				setBalance,
				chainId,
				setChainId,
				contractInstance,
				setContractInstance,
				salt,
				setSalt,
				isGameJoined,
				setIsGameJoined,
				timeout,
				setGameTimeout,
				isGameRecoveryAvailable,
				setIsGameRecoveryAvailable,
				joinedContractInstance,
				setJoinedContractInstance,
				gameOver,
				setGameOver,
				isPageLoading,
				setIsPageLoading,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useGlobalContext = () => {
	if (!AppContext)
		throw new Error("This hook should be called within an AppContext provider");
	return useContext(AppContext) as GlobalContext;
};

export { AppContext, AppProvider };
