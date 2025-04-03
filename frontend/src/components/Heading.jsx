import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
const Heading = ({ name, user }) => {
	return (
		/* Heading */
		<div className='min-h-[110px] left-[20px] right-0 box flex flex-row justify-between items-center z-990 bg-white rounded-2xl absolute  '>
			<div className='flex w-full justify-end select-none relative'>
				<div className='absolute top-[50%] translate-y-[-50%] left-15'>
					<h1 className='text-3xl text-slate-800 font-bold'>
						My <span className='text-orange-600'>{name}</span>
					</h1>
				</div>

				{/* Avartar */}
				<div className='absolute right-[86px] top-[50%] translate-y-[-50%]'>
					<Avatar user={user} />
				</div>
			</div>
		</div>
	)
}

export default Heading

