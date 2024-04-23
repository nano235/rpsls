"use client";

import React, { useState } from "react";
import { Button } from "..";
import WalletModal from "../modals/walletModal/WalletModal";
import styles from "./ConnectWallet.module.scss";
import Image from "next/image";
import { truncateAddress } from "@/utils";
import useAccount from "@/hooks/useAccount";

const ConnectWallet = () => {
	const [openModal, setOpenModal] = useState<{
		walletModal: boolean;
		profileModal: boolean;
	}>({ walletModal: false, profileModal: false });

	const { account, connected, disconnect } = useAccount()


	const closeWalletModal = () => {
		setOpenModal({ ...openModal, walletModal: false });
	};

	const openWalletModal = () => {
		setOpenModal({ ...openModal, walletModal: true });
	};

	const toggleProfileModal = () => {
		setOpenModal({ ...openModal, profileModal: !openModal.profileModal });
	};

	const disconnectWallet = () => {
		setOpenModal({ ...openModal, profileModal: false });
	};

	return (
		<>
			{!connected ? (
				<Button onClick={openWalletModal}>Connect Wallet</Button>
			) : (
				<div className={styles.profile} onClick={toggleProfileModal}>
					<div className={styles.text}>
						<p>{truncateAddress(account)}</p>
					</div>
					<div className={styles.icon}>
						<Image src="/svgs/chevron.svg" alt="" fill sizes="100vw" />
					</div>
					{openModal.profileModal && (
						<div className={styles.profile_body} onClick={disconnect}>
							<div className={styles.text}>
								<h3>Disconnect</h3>
							</div>
						</div>
					)}
				</div>
			)}
			{openModal.walletModal && (
				<WalletModal openModal={openModal.walletModal} close={closeWalletModal} />
			)}
		</>
	);
};

export default ConnectWallet;
