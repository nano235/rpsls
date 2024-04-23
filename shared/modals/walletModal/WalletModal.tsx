import React from "react";
import Modal from "../modal/Modal";
import styles from "./WalletModal.module.scss";
import Image from "next/image";
import { wallets } from "@/mock";
import { Wallet } from "@/interfaces";
import useAccount from "@/hooks/useAccount";

interface Props {
	close: () => void;
	openModal: boolean;
}

const WalletModal = (props: Props) => {
	const { connect } = useAccount();
	
	const handleConnect = () => {
		connect();
		props.close();
	};

	
	return (
		<Modal
			title="Get Started"
			description="Select your wallet to gain access to your RPS game"
			close={props.close}
			openModal={props.openModal}
			className={styles.modal}
		>
			<ul className={styles.wallet_list}>
				{wallets.map((wallet: Wallet, index) => {
					return (
						<ConnectorButton
							key={index}
							wallet={wallet}
							onClick={handleConnect}
						/>
					);
				})}
			</ul>
			<div className={styles.text}>
				<p>
					Dont have a wallet?{" "}
					<a
						href="https://ethereum.org/en/wallets/find-wallet/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn more
					</a>
				</p>
			</div>
		</Modal>
	);
};

export default WalletModal;

const ConnectorButton = ({
	onClick,
	wallet,
}: {
	onClick: () => void;
	wallet: Wallet;
}) => {
	return (
		<li className={styles.wallet_list__item} onClick={onClick}>
			<div className={styles.icon}>
				<Image src={wallet.icon} alt="" fill sizes="100vw" />
			</div>
			<h3>{wallet.label}</h3>
		</li>
	);
};
