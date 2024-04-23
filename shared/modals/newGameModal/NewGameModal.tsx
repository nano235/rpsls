"use client";

import React from "react";
import Modal from "../modal/Modal";
import { Button, Title } from "@/shared";
import styles from "./NewGameModal.module.scss";
import { formatNum } from "@/utils";
import { useGlobalContext } from "@/contexts/AppContext";
import useAccount from "@/hooks/useAccount";
import { Player } from "@/interfaces";
import { getBalance, isValidEthereumAddress } from "@/utils/web3Utils";
import { toast } from "react-toastify";

interface Props {
	close: () => void;
	openModal: boolean;
}

const NewGameModal = (props: Props) => {
	const {
		setIsGameStarted,
		setPlayer1,
		player2,
		setPlayer2,
		stakeAmount,
		setStakeAmount,
	} = useGlobalContext();

	const { balance, account } = useAccount();

	const handleStartGame = async () => {
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

			if (!isValidEthereumAddress(player2.address)) {
				toast.error(
					"Player 2 wallet address is not a valid ethereum wallet address!"
				);
				return;
			}

			const player2Balance = await getBalance(player2.address);			
			if (Number(player2Balance) < (Number(stakeAmount) + gasFee)) {
				toast.error(
					"Player 2 wallet's balance is less than stake amount plus estimated gas fee"
				);
				return;
			}

			setIsGameStarted(true);
			setPlayer1((p: Player) => ({ ...p, address: account, isPlaying: true }));
			props.close();
		} catch (error: any) {
			toast.error(error?.message || "An unexpected error occurred!");
		}
	};

	const handleAddPlayer = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		if (isValidEthereumAddress(val)) {
			setPlayer2((p: Player) => ({ ...p, address: val, hasPlayed: false }));
		}
	};

	const disableButton = !Number(stakeAmount) || !player2.address;
	return (
		<Modal close={props.close} openModal={props.openModal} className={styles.modal}>
			<Title title="New Game" type="medium" className={styles.title} />
			<div className={styles.stake_container}>
				<div className={styles.text}>
					<p>Stake Amount (ETH)</p>
				</div>
				<input
					className={styles.input}
					value={stakeAmount}
					onChange={e => setStakeAmount(e.target.value)}
					placeholder="0"
					type="number"
					max={balance}
				/>
				<div
					className={styles.text}
					onClick={() => setStakeAmount(balance)}
					style={{ cursor: "pointer" }}
				>
					<span>Balance: {formatNum(balance)} ETH</span>
				</div>
			</div>
			<div className={styles.add_player}>
				<div className={styles.text}>
					<h3>Add Player</h3>
				</div>
				<div
					className={styles.text}
					style={{ marginTop: "2rem" }}
					data-active={player2.isPlaying}
				>
					<h4>Enter Player Address</h4>
					<input
						className={styles.input}
						value={player2.address}
						onChange={handleAddPlayer}
						placeholder="paste wallet address"
						type="text"
					/>
				</div>
			</div>
			<Button
				className={styles.button}
				disabled={disableButton}
				onClick={handleStartGame}
			>
				Start Game
			</Button>
		</Modal>
	);
};

export default NewGameModal;
