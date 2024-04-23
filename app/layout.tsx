import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/index.scss";
import { Header, PreLoader } from "@/shared";
import styles from "./layout.module.scss";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
	title: "RPSLS Game",
	description: "Play Rock Paper Scissors Lizard Spock With friends",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<AppProvider>
					<PreLoader />
					<ToastContainer
						position="top-right"
						autoClose={2000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="dark"
					/>
					<Header />
					<main className={styles.main}>{children}</main>
				</AppProvider>
			</body>
		</html>
	);
}
