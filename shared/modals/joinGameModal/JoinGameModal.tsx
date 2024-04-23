"use client";

import React, { useEffect, useMemo, useState } from "react";
import Modal from "../modal/Modal";
import { Button, Title } from "@/shared";
import styles from "./JoinGameModal.module.scss";
import { formatNum } from "@/utils";
import { useGlobalContext } from "@/contexts/AppContext";
import useAccount from "@/hooks/useAccount";
import { Player } from "@/interfaces";
import { isValidEthereumAddress } from "@/utils/web3Utils";
import { toast } from "react-toastify";
import { formatEther } from "ethers";
import useGameContract from "@/hooks/useGameContract";

interface Props {
	close: () => void;
	openModal: boolean;
}

const JoinGameModal = (props: Props) => {
	const {
		setIsGameJoined,
		stakeAmount,
		setStakeAmount,
		setPlayer1,
		setPlayer2,
		setGameTimeout,
		setIsTimerRunning,
	} = useGlobalContext();

	const { balance, account } = useAccount();
	const { getContract } = useGameContract();
	const [gameId, setGameId] = useState("");

	const handleJoinGame = async () => {
		try {
			// validations
			if (!account) {
				toast.error("Wallet address not found! Did you connect your wallet?");
				return;
			}

			const gasFee = 0.000001; //assumming gasFee. Normally we'd estimate the gas fee required
			if (Number(balance) < Number(stakeAmount) + gasFee) {
				toast.error(
					"Wallet balance is less than stake amount plus estimated gas fee"
				);
				return;
			}

			setIsGameJoined(true);
			setPlayer2((p: Player) => ({ ...p, address: account, isPlaying: true }));
			setIsTimerRunning(true);
			props.close();
		} catch (error: any) {
			toast.error(error?.message || "An unexpected error occurred!");
		}
	};

	const handleSetGame = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		if (isValidEthereumAddress(val)) {
			setGameId(val);
		}
	};

	useEffect(() => {
		async function loadGameState() {
			const contract = (await getContract(gameId)) as any;
			const stake = await contract.stake();
			const player = await contract.j1();
			const timeout = await contract.lastAction();

			if (stake) setStakeAmount(formatEther(stake));
			if (player) {
				setPlayer1((p: Player) => ({
					...p,
					address: player,
					isPlaying: true,
					hasPlayed: true,
				}));
			}

			if (timeout){
				setGameTimeout(
					Math.round(300000 - (Date.now() - (Number(timeout) * 1000)))
				);
			}
		}

		if (gameId) {
			loadGameState();
		}
	}, [gameId]);

	const disableButton = useMemo(
		() => !Number(stakeAmount) || !gameId,
		[stakeAmount, gameId]
	);

	return (
		<Modal close={props.close} openModal={props.openModal} className={styles.modal}>
			<Title title="New Game" type="medium" className={styles.title} />
			<div className={styles.stake_container}>
				<div className={styles.text}>
					<p>Staked Amount (ETH)</p>
				</div>
				<span className={styles.stake_amount}>{stakeAmount || "-"}</span>
				<div className={styles.text} style={{ cursor: "pointer" }}>
					<span>Balance: {formatNum(balance)} ETH</span>
				</div>
			</div>
			<div className={styles.add_player}>
				<div
					className={styles.text}
					style={{ marginTop: "2rem" }}
					data-active={!!gameId}
				>
					<h4>Enter game contract address</h4>
					<input
						className={styles.input}
						value={gameId}
						onChange={handleSetGame}
						placeholder="paste contract address"
						type="text"
					/>
				</div>
			</div>
			<Button
				className={styles.button}
				disabled={disableButton}
				onClick={handleJoinGame}
			>
				Join Game
			</Button>
		</Modal>
	);
};

export default JoinGameModal;
