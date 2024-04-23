import { parseEther } from "ethers";
import useAccount from "./useAccount";
import RPS from "@/constants/abi/Rps.json";
import Hasher from "@/constants/abi/Hasher.json";
import { deployContract, generateSalt, getHash, getProvider } from "@/utils/web3Utils";
import { toast } from "react-toastify";
import { moveMapping } from "@/constants";
import { useGlobalContext } from "@/contexts/AppContext";
import { truncateAddress } from "@/utils";
import { GameResult, Move, Player } from "@/interfaces";
import { Contract } from "ethers";

export default function useGameContract() {
	const {
		player1,
		player2,
		setPlayer1,
		setPlayer2,
		contractInstance,
		setContractInstance,
		setSalt,
		salt,
		setGameTimeout,
		setGameOver,
		setIsTimerRunning,
		joinedContractInstance: p2ContractInstance,
		setJoinedContractInstance: p2SetContractInstance,
		setIsPageLoading,
	} = useGlobalContext() 
	const { account } = useAccount();

	const startGame = async (stake: number, move: number, address: string) => {
		resetGameState();
		if (player1.address !== account) {
			toast.error(
				`Please connect or switch to player1 wallet: ${truncateAddress(
					player1.address
				)}`
			);
			return;
		}

		try {
			setIsPageLoading(true);
			const hasherContractRes = await deployContract(
				Hasher.abi,
				Hasher.bytecode,
				[]
			); //deploy hasher contract
			const hasherContract = hasherContractRes.getInstance();
			const value = parseEther(stake.toString());
			const _salt = generateSalt();
			setSalt(_salt);
			const moveHash = await getHash(hasherContract, move, _salt);
			const rpsContractRes = await deployContract(RPS.abi, RPS.bytecode, [
				moveHash,
				address,
				{
					value,
					from: account,
				},
			]);
			const rpsContract = rpsContractRes.getInstance() as Contract;
			setContractInstance(rpsContract);
			setPlayer1((p: Player) => ({ ...p, hasPlayed: true }));
			const timeout = await rpsContract.lastAction();
			setGameTimeout(Math.round(300000 - (Date.now() - (Number(timeout) * 1000))));
			setIsTimerRunning(true);
			setPlayer2((p: Player) => ({ ...p, isPlaying: true }));
			console.log(`
				Game started! Contract deployed at:
				${rpsContractRes.address} 
				
				Salt: ${_salt}
				Move: ${move}
	
				"Warning: Keep your salt and move secret!!
			`);
			saveGameState(_salt, rpsContractRes.address);
			toast.success(
				"Game contract created and deployed: " + rpsContractRes.address
			);
		} catch (error: any) {
			console.log(error);
			toast.error(error.message);
		} finally {
			setIsPageLoading(false);
		}
	};

	const _contractInstance = contractInstance as Contract;
	const revealMove = async () => {
		if (!(contractInstance && salt)) {
			return;
		}

		if (player1.address !== account) {
			toast.error(
				`Please connect or switch to player1 wallet: ${truncateAddress(
					player1.address
				)}`
			);
			return;
		}

		const move = player1.move as Move;
		let moveIndexed = move !== Move.idle ? moveMapping[move] : 0;

		try {
			setIsPageLoading(true);
			const tx = await _contractInstance.solve(moveIndexed, salt, { from: account });
			await tx?.wait(1);
			const moveOfPlayer2 = await (contractInstance as Contract).c2();
			let p2Result = "";
			if (Number(moveOfPlayer2) === moveIndexed) {
				setPlayer1((p: Player) => ({ ...p, result: GameResult.tie }));
				setPlayer2((p: Player) => ({
					...p,
					move: Object.keys(moveMapping).find(
						key => moveMapping[key] === Number(moveOfPlayer2)
					) as Move,
					result: GameResult.tie,
				}));
				toast.info("Game was a tie!");
				p2Result = "tie";
			} else if (win(moveIndexed, Number(moveOfPlayer2))) {
				setPlayer1((p: Player) => ({ ...p, result: GameResult.win }));
				setPlayer2((p: Player) => ({ ...p, result: GameResult.loss }));
				toast.success("Congratulations! You won the game");
				p2Result = "loss";
			} else {
				setPlayer1((p: Player) => ({ ...p, result: GameResult.loss }));
				setPlayer2((p: Player) => ({ ...p, result: GameResult.win }));
				toast.error("Oops!, You lost this one");
				p2Result = "win";
			}
			resetGameState();
			localStorage.setItem(
				"GameResult",
				JSON.stringify({
					result: p2Result,
					p1Move: player1.move,
					p2Move: Object.keys(moveMapping).find(
						key => moveMapping[key] === Number(moveOfPlayer2)
					),
				})
			);
			setGameOver(true);
		} catch (error) {
			console.log(error);
		} finally {
			setIsPageLoading(false);
		}
	};

	const recoverFunds = async () => {
		const provider = getProvider();
		if (!provider || !account) {
			toast.error("Please connect MetaMask to use this dapp!");
			return;
		}
		try {
			// Call the j2Timeout function from the RPS contract instance
			setIsPageLoading(true);
			const tx = await _contractInstance.j2Timeout({ from: account });
			await tx?.wait(1);
			setPlayer1((p: Player) => ({ ...p, result: GameResult.win }));
			setPlayer2((p: Player) => ({ ...p, result: GameResult.loss }));
			setGameOver(true);
			resetGameState();
		} catch (error: any) {
			toast.error("An error occurred while recovering the funds: " + error.message);
		} finally {
			setIsPageLoading(false);
		}
	};

	const getContract = async (address: string) => {
		try {
			const provider = getProvider();
			const signer = await provider.getSigner();
			const contract = new Contract(address, RPS.abi, signer);
			p2SetContractInstance(contract);
			return contract;
		} catch (error) {}
	};

	const _p2ContractInstance = p2ContractInstance as Contract;

	const p2Play = async () => {
		if (!(p2ContractInstance && player2?.move)) {
			toast.error("Game contract not initialized.");
			return;
		}

		if (player2.address !== account) {
			toast.error(
				`Please connect or switch to player2 wallet: ${truncateAddress(
					player2.address
				)}`
			);
			return;
		}

		const move = player2.move as Move;
		let moveIndexed = move !== Move.idle ? moveMapping[move] : 0;

		try {
			setIsPageLoading(true);
			const stake = await _p2ContractInstance.stake();
			const tx = await _p2ContractInstance.play(moveIndexed, { from: account, value: stake });
			await tx?.wait(1);
			const timeout = await _p2ContractInstance.lastAction();
			setGameTimeout(
				Math.round(300000 - (Date.now() - (Number(timeout) * 1000)))
			);
			setPlayer2((p: Player) => ({ ...p, hasPlayed: true }));
			toast.success("Your move has been submitted! Waiting for the reveal.");
		} catch (error: any) {
			toast.error("An error occurred while joining the game: " + error.message);
		} finally {
			setIsPageLoading(false);
		}
	};

	const p2RecoverFunds = async () => {
		const provider = getProvider();
		if (!provider || !account) {
			toast.error("Please connect MetaMask to use this dapp!");
			return;
		}
		try {
			setIsPageLoading(true);
			await _p2ContractInstance.j1Timeout({ from: account });
			setPlayer1((p: Player) => ({ ...p, result: GameResult.loss }));
			setPlayer2((p: Player) => ({ ...p, result: GameResult.win }));
			setGameOver(true);
		} catch (error: any) {
			toast.error("An error occurred while recovering the funds: " + error.message);
		} finally {
			setIsPageLoading(false);
		}
	};

	return {
		contractInstance,
		startGame,
		revealMove,
		recoverFunds,
		getContract,
		p2Play,
		p2RecoverFunds,
	};
}

export const saveGameState = (salt: string, contractAddress: string) => {
	localStorage.setItem("salt", salt);
	localStorage.setItem("contractAddress", contractAddress);
};

export const getGameState = () => {
	if (typeof window === "undefined") return;
	return {
		salt: localStorage.getItem("salt"),
		contractAddress: localStorage.getItem("contractAddress"),
	};
};

export const resetGameState = () => {
	localStorage.removeItem("salt");
	localStorage.removeItem("contractAddress");
};

export const win = (c1: number, c2: number) => {
	if (c1 === c2) return false;
	else if (c1 === 0) return false;
	else if (c1 % 2 === c2 % 2) return c1 < c2;
	else return c1 > c2;
};
