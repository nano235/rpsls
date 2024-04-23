import useGameContract from "@/hooks/useGameContract";
import PlayCard from "../playerCard/PlayCard";
import styles from "./GameMode.module.scss";
import { useGlobalContext } from "@/contexts/AppContext";
import { toast } from "react-toastify";
import { Move, Player } from "@/interfaces";
import { moveMapping } from "@/constants";
import useAccount from "@/hooks/useAccount";
import { useState } from "react";
import { Button } from "@/shared";
import useGameState from "@/hooks/useGameState";

const GameMode = () => {
	const {
		player1,
		setPlayer1,
		player2,
		setPlayer2,
		stakeAmount,
		isGameRecoveryAvailable,
		gameOver,
	} = useGlobalContext();
	const { startGame, revealMove, recoverFunds, p2Play, p2RecoverFunds } =
		useGameContract();
	const { account } = useAccount();

	useGameState();

	const [isLoading, setIsLoading] = useState(false);

	const onPlay = async (player: Player) => {
		if (!player) return;
		const move = player.move !== Move.idle ? moveMapping[player.move] : null;
		if (!move) {
			toast.error("Invalid move! Cannot initiate game");
			return;
		}

		switch (player.address) {
			case player1.address:
				await startGame(Number(stakeAmount), move, player2.address);
				break;
			case player2.address:
				await p2Play();
				break;
			default:
				toast.error("Invalid action");
		}
	};

	const onRevealMove = async () => {
		setIsLoading(true);
		await revealMove();
		setIsLoading(false);
	};

	return (
		<>
			<div className={styles.title}>
				<h3>{stakeAmount} ETH</h3>
				<p>Stake Amount</p>
			</div>
			<div className={styles.container}>
				<div className={styles.game_card}>
					<PlayCard
						player={player1}
						setPlayer={setPlayer1}
						opponent={player2}
						onPlay={onPlay}
					/>
				</div>
				<div className={styles.game_card}>
					<PlayCard
						player={player2}
						setPlayer={setPlayer2}
						opponent={player1}
						onPlay={onPlay}
					/>
				</div>
			</div>
			{!gameOver && (
				<div className={styles.game_buttons}>
					{player2.hasPlayed && player1.address === account && (
						<Button
							className={styles.btn}
							disabled={!player2.hasPlayed || isLoading}
							onClick={onRevealMove}
						>
							Reveal Move
						</Button>
					)}
					{isGameRecoveryAvailable.status &&
						isGameRecoveryAvailable.player === account && (
							<Button
								className={styles.btn}
								disabled={!isGameRecoveryAvailable || isLoading}
								onClick={() => {
									if (
										isGameRecoveryAvailable.player ===
											player1.address &&
										player1.address === account
									)
										recoverFunds();
									if (
										isGameRecoveryAvailable.player ===
											player2.address &&
										player2.address === account
									)
										p2RecoverFunds();
								}}
							>
								Recover Stake
							</Button>
						)}
				</div>
			)}
		</>
	);
};

export default GameMode;
