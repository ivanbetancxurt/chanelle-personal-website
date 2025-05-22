import React from 'react'

interface ModeButtonProps {
	label: string,
	toggleMode: () => void,
	color: 'red' | 'green'
}

export default function ModeButton({label, toggleMode, color} : ModeButtonProps) {
	// color mapping for dynamic coloring of button
	const buttonColors = {
		green: 'bg-green-400',
		red: 'bg-red-400'
	}

	return (
		<button className={`absolute left-15 w-[180px] h-9 ${buttonColors[color]} rounded-lg cursor-pointer`} onClick={toggleMode}>
			{label}
		</button>
	);
}
