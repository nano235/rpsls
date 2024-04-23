"use client";

import { Button, Title } from "@/shared";
import styles from "./page.module.scss";
import { GameMode, NewGame } from "@/components";
import { useGlobalContext } from "@/contexts/AppContext";
import { getGameState } from "@/hooks/useGameContract";
import useCopy from "@/hooks/useCopy";

export default function Home() {
	const { isGameStarted, player1 } = useGlobalContext();
	const gameState = getGameState();
	const contractAddress = gameState ? gameState.contractAddress : null;
	const handleCopy = useCopy();
	return (
		<section className={styles.section}>
			<Title
				type="large"
				title="Play, Stake and Win"
				description="Join a high-stakes game of Rock, Paper, Scissors with friends, both parties pitch in, and the ultimate victor claims the entire pot."
			/>
			{contractAddress && player1.hasPlayed && (
				<div className={styles.container}>
					<Button
						buttonType="transparent"
						onClick={() => handleCopy(contractAddress ?? "")}
						className={styles.button}
						title="Copy contract address"
					>
						{contractAddress}
					</Button>
					<div className={styles.title}>
						<p>Game Contract Address</p>
					</div>
				</div>
			)}
			{isGameStarted ? <GameMode /> : <NewGame />}
		</section>
	);
}
