import React, { useState, forwardRef } from 'react'

const Dropdown = forwardRef(
	({ options, onSelect, description, value, width }, ref) => {
		const [selectedOption, setSelectedOption] = useState(
			description !== undefined ? '' : options[0]
		)

		const handleSelectOption = (e) => {
			if (!value) {
				setSelectedOption(e.target.value)
			}
			onSelect(e.target.value) // Pass selected option back to parent
		}

		return (
			<select
				ref={ref}
				className={`dropdown ${
					selectedOption === '' ? 'default' : ''
				} text-gray-500 border-1 border-gray-400 rounded-lg w-${width}`}
				value={selectedOption}
				onChange={handleSelectOption}
			>
				{description && (
					<option value='' disabled>
						{description}
					</option>
				)}
				{options.map((option, index) => (
					<option key={option} value={option}>
						{option === 'High'
							? '🔴'
							: option === 'Medium'
							? '🟡'
							: option === 'Low'
							? '🟢'
							: ''}
						{option}
					</option>
				))}
			</select>
		)
	}
)

export default Dropdown
