"use client";

import React, { useState } from "react";
import styles from "./JoinGame.module.scss";
import Image from "next/image";
import { Button, ConnectWallet } from "@/shared";
import { JoinGameModal } from "@/shared/modals";
import useAccount from "@/hooks/useAccount";

const JoinGame = () => {
	const { connected } = useAccount()

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
					<h3>Ready to play?</h3>
					<p>
						click below to join a game
					</p>
				</div>
				{
					connected ? 
					<Button onClick={() => setOpenModal(true)}>Join New Game</Button> : <ConnectWallet />
				}
			</div>
			{openModal && <JoinGameModal close={closeModal} openModal={openModal} />}
		</div>
	);
};

export default JoinGame;
