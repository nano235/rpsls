import { ConnectWallet, Logo } from "@/shared";
import styles from "./Header.module.scss";
import Link from "next/link";

const Header = () => {
	return (
		<header className={styles.header}>
			<Link href="/">
				<Logo />
			</Link>
			<ConnectWallet />
		</header>
	);
};

export default Header;
