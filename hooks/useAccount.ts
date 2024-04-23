import { useGlobalContext } from "@/contexts/AppContext";
import { connectToEthereum } from "@/utils/web3Utils";
import { formatUnits } from "ethers";
import { useEffect } from "react";

const walletConnectKey = "WALLET_CONNECTED_PERSISTOR";
export default function useAccount() {
	const {
		setBalance,
		setAccount,
		setConnected,
		setChainId,
		balance,
		account,
		connected,
		chainId,
	} = useGlobalContext();

	useEffect(() => {
		const shouldPersist = localStorage.getItem(walletConnectKey);
		if (shouldPersist === "true") connect();
	}, []);

	const connect = async () => {
		const provider = await connectToEthereum();
		if (provider) {
			const signer = await provider.getSigner();
			const address = signer.address;
			const _balance = await provider.getBalance(address);
			setBalance(formatUnits(_balance));
			setAccount(address);
			setConnected(true);

			const _chainId = (await provider.getNetwork()).chainId;
			setChainId(_chainId.toString());
			localStorage.setItem(walletConnectKey, "true");
		}
	};

	const disconnect = () => {
		setAccount("");
		setBalance("");
		setConnected(false);
		localStorage.setItem(walletConnectKey, "false");
	};

	return {
		account,
		balance,
		chainId,
		connected,
		connect,
		disconnect,
	};
}
