import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Heading from './Heading'
import profilePicNull from '../assets/profile-picture-null.png'

const Profile = ({ user }) => {
	return (
		<div className='z-999 flex flex-col items-center h-screen flex-1 overflow-auto left-[60px] max-w-[calc(100vw-60px)]  relative'>
			<Heading name='Profile' user={user} />
			<div className='relative h-full w-[60%]  top-[200px]'>
				<div className='absolute h-[95%] bg-white top-0 w-full rounded-t-[10%] rounded-b-2xl '></div>
				<div
					className={`absolute w-50 h-50 bottom-full rounded-full translate-y-[70%] right-[50%] translate-x-[50%] box`}
					style={{
						backgroundImage: user.avatarUrl ? '' : `url(${profilePicNull})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				></div>
			</div>
		</div>
	)
}

export default Profile

