"use client";

import { useGlobalContext } from "@/contexts/AppContext";
import { toast } from "react-toastify";
import useAccount from "./useAccount";
import { useEffect } from "react";
import { GameResult, Player } from "@/interfaces";
import { Contract } from "ethers";

const pollFrequency = 2000;

export default function useGameState() {
	const {
		player1,
		player2,
		setPlayer1,
		setPlayer2,
		timeout,
		contractInstance,
		joinedContractInstance: p2ContractInstance,
		setIsGameRecoveryAvailable,
		setGameOver,
		setGameTimeout,
	} = useGlobalContext();
	const { account } = useAccount();

	useEffect(() => {
		if (contractInstance && player1.address === account) {
			const interval = setInterval(async () => {
				try {
					const _contractInstance = contractInstance as Contract;
					const moveOfPlayer2 = await _contractInstance.c2();
					const lastAction = await _contractInstance.lastAction();
					const lastActionTime = Number(lastAction) * 1000 + 300000;

					const timeout = Math.round(
						300000 - (Date.now() - Number(lastAction) * 1000)
					);
					setGameTimeout(timeout > 0 ? timeout : 0);

					if (Number(moveOfPlayer2) !== 0) {
						clearInterval(interval);
					} else if (Date.now() >= lastActionTime) {
						setIsGameRecoveryAvailable({
							player: player1.address,
							status: true,
						});
						clearInterval(interval);
					}
				} catch (error) {}
			}, pollFrequency);
			return () => clearInterval(interval);
		}
	}, [contractInstance, player1, player2, account, timeout]);

	useEffect(() => {
		if (p2ContractInstance && player2.address === account) {
			const interval = setInterval(async () => {
				try {
					const _p2ContractInstance = p2ContractInstance as Contract;
					const currentStake = await _p2ContractInstance.stake();
					const c2Move = await _p2ContractInstance.c2();
					const lastAction = await _p2ContractInstance.lastAction();
					const lastActionTime = Number(lastAction) * 1000 + 300000;
					// Condition that the time is out and player-1 has not revealed his move
					const timeout = Math.round(
						300000 - (Date.now() - Number(lastAction) * 1000)
					);
					setGameTimeout(timeout > 0 ? timeout : 0);
					if (
						Date.now() >= lastActionTime &&
						Number(c2Move) !== 0 &&
						Number(currentStake) > 0
					) {
						setIsGameRecoveryAvailable({
							player: player2.address,
							status: true,
						});
						clearInterval(interval);
					}
					// If currentStake is 0, then it means player-1 revealed his move
					if (Number(currentStake) === 0) {
						clearInterval(interval);
						toast.info("Player-1 revealed his move! Game Over");
						const result = localStorage.getItem("GameResult");
						if (result) {
							const parsedResult = JSON.parse(result);
							const p1Result =
								parsedResult.result === "win"
									? "loss"
									: parsedResult.result === "loss"
									? "win"
									: "tie";
							setPlayer1((p: Player) => ({
								...p,
								move: parsedResult.p1Move,
								result: GameResult[p1Result as GameResult],
							}));
							setPlayer2((p: Player) => ({
								...p,
								move: parsedResult.p2Move,
								result: GameResult[parsedResult.result as GameResult],
							}));
							setGameOver(true);
						}
					}
				} catch (error) {}
			}, pollFrequency);
			return () => clearInterval(interval);
		}
	}, [p2ContractInstance, player2.address, account]);

	useEffect(() => {
		async function loadGameState(contractInstance: any) {
			try {
				if (!contractInstance) return;
				const p2Move = await contractInstance.c2();
				const _player1 = await contractInstance.j1();
				const _player2 = await contractInstance.j2();
				const lastAction = await contractInstance.lastAction();
				const timeout = Math.round(
					300000 - (Date.now() - Number(lastAction) * 1000)
				);
				setGameTimeout(timeout > 0 ? timeout : 0);

				if (_player1 || _player2) {
					setPlayer1((p: Player) => ({
						...p,
						address: _player1 || player1.address,
						isPlaying: true,
						hasPlayed: true,
					}));

					setPlayer2((p: Player) => ({
						...p,
						address: _player2 || player2.address,
						isPlaying: true,
						hasPlayed: Number(p2Move) !== 0,
					}));
				}
			} catch (error) {}
		}

		const interval = setInterval(() => {
			loadGameState(contractInstance || p2ContractInstance);
		}, pollFrequency);

		return () => {
			clearInterval(interval);
		};
	}, [contractInstance, p2ContractInstance]);
}
