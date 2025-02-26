import IconsWindow from './IconsWindow'
import { AccountBalanceWallet } from '@mui/icons-material'
import { useState, useRef } from 'react'
import { allIconsArray } from './AllIcons'

const IconButton = ({ iconId, setShow }) => {
	const icon =
		iconId === undefined
			? allIconsArray[0]
			: allIconsArray.filter((icon) => icon.id === iconId)[0]

	return (
		<div>
			<div
				onClick={() => setShow(true)}
				className='bg-orange-600 text-white w-9 h-9 shadow-sm border border-slate-50 flex items-center justify-center rounded-lg'
			>
				{icon.icon}
			</div>
		</div>
	)
}
export default IconButton

