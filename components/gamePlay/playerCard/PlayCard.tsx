"use client";

import React, { useState } from "react";
import styles from "./PlayCard.module.scss";
import { movesList } from "@/mock";
import { GameResult, Hand, Move, Player } from "@/interfaces";
import Image from "next/image";
import { Button } from "@/shared";
import Timer from "../timer/Timer";
import { useGlobalContext } from "@/contexts/AppContext";
import useAccount from "@/hooks/useAccount";

interface Props {
	player: Player;
	setPlayer: React.Dispatch<React.SetStateAction<Player>>;
	opponent: Player;
	onPlay: (player: Player) => void;
}

const PlayCard = ({ player, setPlayer, onPlay }: Props) => {
	const { isTimerRunning, timeout, setIsTimerRunning, gameOver } =
		useGlobalContext();
	const [selectedMove, setSelectedMove] = useState<number>(-1);

	const { account } = useAccount();

	const handleClick = (index: number, move: any) => {
		if (player.address !== account) return;
		setSelectedMove(index);
		setPlayer({ ...player, move });
	};

	const playHand = () => {
		onPlay(player);
	};

	const disableButton = player.move === Move.idle || player.hasPlayed || (Number(timeout) / 60000) <= 0;

	const disableMove = player.result !== GameResult.idle || (Number(timeout) / 60000) <= 0;

	return (
		<div className={styles.card} data-result={player.result}>
			{player.isPlaying ? (
				<>
					<div className={styles.text}>
						<h3>Player</h3>
						<p>
							{player.address} {player.address === account ? "(You)" : ""}
						</p>
					</div>
					{isTimerRunning && player.result === GameResult.idle && (
						<div className={styles.countDown}>
							<Timer
								initialTime={Math.round(Number(timeout) / 60000)}
								onTimerFinish={setIsTimerRunning}
							/>
						</div>
					)}
					<div className={styles.hand_container}>
						{movesList.map((item: Hand, index: number) => (
							<div
								className={styles.hand}
								key={index}
								data-active={selectedMove === index}
								data-disabled={disableMove}
								onClick={() =>
									disableMove ? {} : handleClick(index, item.label)
								}
							>
								<div className={styles.icon}>
									<Image
										src={
											selectedMove === index ||
											(gameOver && item.label === player.move)
												? item.iconActive
												: item.icon
										}
										fill
										alt={item.label}
										sizes="100vw"
										title={item.label}
									/>
								</div>
							</div>
						))}
					</div>
					<Button
						buttonType="transparent"
						className={styles.button}
						disabled={disableButton}
						onClick={playHand}
					>
						Play
					</Button>
				</>
			) : (
				<div className={styles.text}>
					<h6>You will see the player&apos;s hand once they&apos;ve played</h6>
				</div>
			)}
		</div>
	);
};

export default PlayCard;
