import RPS from "@/constants/abi/Rps.json";
import Hasher from "@/constants/abi/Hasher.json";
import { toast } from "react-toastify";
import { BrowserProvider, Contract, formatEther } from "ethers";
import { ContractFactory } from "ethers";
import { BaseContract } from "ethers";

export const getProvider = () => {
	if (!window?.ethereum) toast.error("Please install MetaMask to use this dapp!");
	const provider = new BrowserProvider(window.ethereum);
	return provider;
};

export const connectToEthereum = async () => {
	if (window?.ethereum) {
		await window.ethereum.request({ method: "eth_requestAccounts" });
		const provider = new BrowserProvider(window.ethereum);
		const network = await provider.getNetwork();
		console.log("Connected to Ethereum network:", network.name);

		if (network.name !== "sepolia") {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: "0xaa36a7" }],
			});
		}

		return provider;
	} else {
		console.error("Ethereum provider not available");
	}
};

export const getBalance = async (address: string) => {
    const provider = getProvider();
    const balance = await provider.getBalance(address)
    return formatEther(balance)
}

export const deployContract = async (abi: any[], bytecode: string, args: any) => {
	const provider = getProvider();
	const signer = await provider.getSigner();

	const factory = new ContractFactory(abi, bytecode, signer);
	const contract = await factory.deploy(...args);
	await contract.waitForDeployment();

	return {
		getInstance: () => contract as BaseContract,
		address: await contract.getAddress(),
	};
};

export const getHash = async (hasherContract: any, moveInt: number, salt: string) => {
	return await (hasherContract as any).hash(moveInt, salt);
};

export const generateSalt = () => {
	const byteCount = 32;
	const randomBytes = new Uint8Array(byteCount);
	window?.crypto?.getRandomValues(randomBytes);

	let salt = "";
	for (let i = 0; i < randomBytes.length; i++) {
		salt += ("00" + randomBytes[i].toString(16)).slice(-2);
	}
	return BigInt(`0x${salt}`).toString();
};

export const isValidEthereumAddress = (address: string) => {
    if (!address) return false;
    return /^0x[0-9a-fA-F]{40}$/.test(address);
}