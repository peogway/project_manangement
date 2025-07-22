import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'

const SortDropdown = ({ setSortValue, sortTasks, initlaValue, sortByDate }) => {
	const { t, i18n } = useTranslation()
	const [selectedSort, setSelectedSort] = useState(
		initlaValue ? initlaValue : 'A-Z'
	)

	const handleChange = (e) => {
		setSelectedSort(e.target.value)
		setSortValue(e.target.value) // Pass value up
	}
	return (
		<select
			value={selectedSort}
			onChange={handleChange}
			className=' rounded-lg w-[100px]'
		>
			<optgroup label={t('Order')}>
				<option value='A-Z'>A-Z</option>
				<option value='Z-A'>Z-A</option>
			</optgroup>
			{sortByDate && (
				<optgroup label={t('Date')}>
					<option value='newest'>{t('Newest')}</option>
					<option value='oldest'>{t('Oldest')}</option>
				</optgroup>
			)}
			{sortTasks && (
				<optgroup label={t('Priority')}>
					<option value='increasing'>{t('Priority')} &#x2191;</option>
					<option value='decreasing'>{t('Priority')} &#x2193;</option>
				</optgroup>
			)}
		</select>
	)
}

export default SortDropdown
