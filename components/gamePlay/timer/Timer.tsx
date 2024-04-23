"use client";

import { useEffect, useState } from "react";

interface TimerProps {
	initialTime: number; //This is in minutes
	onTimerFinish: React.Dispatch<React.SetStateAction<boolean>>;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimerFinish }) => {
	const [time, setTime] = useState(initialTime * 60);

	useEffect(() => {
		setTime(initialTime * 60);
	}, [initialTime]);

	useEffect(() => {
		let timerId: NodeJS.Timeout;

		if (time > 0) {
			timerId = setInterval(() => {
				setTime(prevTime => prevTime - 1);
			}, 1000);
		} else {
			onTimerFinish(false);
		}

		return () => clearInterval(timerId);
	}, [time, onTimerFinish]);

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(
			2,
			"0"
		)}`;
	};

	return <div>{formatTime(time)}</div>;
};

export default Timer;
