import React, { useState, useRef } from 'react'

import AppsIcon from '@mui/icons-material/Apps'
import CloseIcon from '@mui/icons-material/Close'
import AllIcons from './AllIcons'

const IconsWindow = ({ onClose, iconId, setIconId, show }) => {
	const formRef = useRef(null)
	const overlayRef = useRef(null)
	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}
	const Header = () => {
		return (
			<div className='flex justify-between items-center pt-7 px-7 mb-8'>
				<div className='flex items-center gap-2'>
					{/* Icons */}
					<div className='  p-2 bg-orange-200 rounded-lg flex items-center justify-center'>
						<AppsIcon
							sx={{ fontSize: 21 }}
							className='text-orange-400 text-[17px]'
							onClick={onClose}
						/>
					</div>
					{/* Header */}
					<span className='font-semibold text-lg'>All Icons</span>
				</div>
				<CloseIcon
					onClick={onClose}
					className='text-slate-400 text-[18px] cursor-pointer'
				/>
			</div>
		)
	}

	const IconsArea = () => {
		return (
			<div className='w-full flex flex-col items-center mt-3'>
				<div className='border border-slate-100 w-[92%] h-[330px] overflow-auto rounded-md bg-slate-100  '>
					<AllIcons onClose={onClose} setIconId={setIconId} iconId={iconId} />
				</div>
			</div>
		)
	}

	return (
		<div>
			{show && (
				<div>
					<div
						ref={overlayRef}
						onClick={handleClickOutside}
						style={{
							position: 'fixed',
							top: 0,
							left: '120px',
							width: '100%',
							height: '100%',
							backgroundColor: 'rgba(104, 102, 102, 0.5)',
							zIndex: 1001,
							pointerEvents: 'auto',
						}}
					></div>
					<div className='z-1002 absolute top-[5%]' ref={formRef}>
						<div
							className={`fixed absolute p-3 h-[530px] w-[50%] max-sm:w-[90%]  bg-white shadow-md 
      left-1/2  rounded-lg -translate-x-1/2 `}
						>
							{/* Header */}
							<Header />

							<span className=' mx-8 text-[13px] mt-12  text-slate-400'>
								{`Please select the icons you'd like to use from the collection below:`}
							</span>
							{/* All Icons Area */}
							<IconsArea />
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default IconsWindow

