import React, { useState } from 'react'

const Dropdown = ({ options, onSelect, title }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState(null)

	const toggleDropdown = () => {
		setIsOpen(!isOpen)
	}

	const handleSelectOption = (option) => {
		setSelectedOption(option)
		onSelect(option) // Pass selected option back to parent
		setIsOpen(false) // Close dropdown after selection
	}

	return (
		<div
			className='dropdown'
			style={{ position: 'relative', display: 'inline-block' }}
		>
			<button onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
				{selectedOption || title} <span>{isOpen ? '▲' : '▼'}</span>
			</button>
			{isOpen && (
				<ul
					style={{
						position: 'absolute',
						listStyle: 'none',
						padding: 0,
						margin: 0,
						border: '1px solid #ccc',
						background: '#fff',
					}}
				>
					{options.map((option) => (
						<li
							key={option}
							onClick={() => handleSelectOption(option)}
							style={{ padding: '5px', cursor: 'pointer' }}
						>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default Dropdown

