"use client";

import React, { useState } from "react";
import styles from "./NewGame.module.scss";
import Image from "next/image";
import { Button, ConnectWallet } from "@/shared";
import { NewGameModal } from "@/shared/modals";
import useAccount from "@/hooks/useAccount";
import Link from "next/link";

const NewGame = () => {
	const { connected } = useAccount();

	const [openModal, setOpenModal] = useState<boolean>(false);
	const closeModal = () => {
		setOpenModal(false);
	};
	return (
		<div className={styles.container}>
			<div className={styles.centered_container}>
				<div className={styles.icon}>
					<Image
						src="/svgs/controller.svg"
						fill
						alt="controller"
						sizes="100vw"
					/>
				</div>
				<div className={styles.text}>
					<h3>Ready to play</h3>
					<p>
						No game in progress, click below to invite a player to get started
					</p>
				</div>
				{connected ? (
					<>
						<Button
							onClick={() => setOpenModal(true)}
							className={styles.button}
						>
							Start New Game
						</Button>
						<Button className={styles.button}>
							<Link href="/join-game">Join a Game</Link>
						</Button>
					</>
				) : (
					<ConnectWallet />
				)}
			</div>
			{openModal && <NewGameModal close={closeModal} openModal={openModal} />}
		</div>
	);
};

export default NewGame;
