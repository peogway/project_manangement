import 'react-phone-input-2/lib/style.css'
import { useState, useEffect } from 'react'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const PhoneDisplay = ({ user }) => {
	const [phone, setPhone] = useState(`+${user.phoneNumber}`) // handle null phone number
	const [country, setCountry] = useState('')
	const [formattedPhone, setFormattedPhone] = useState('')

	useEffect(() => {
		if (phone) {
			// Parse the phone number and format it based on the country
			const phoneNumber = parsePhoneNumberFromString(phone, country)

			if (phoneNumber) {
				const formatted = `${phoneNumber.formatInternational()}`
				setFormattedPhone(formatted)
				setCountry(phoneNumber.country)
			}
		}
	}, [phone, country])

	// Get the flag URL based on country code
	const getCountryFlag = () => {
		return country ? `https://flagcdn.com/w20/${country.toLowerCase()}.png` : ''
	}

	return (
		<div>
			{phone && country && (
				<div className='flex items-center'>
					<div className='bg-slate-100 rounded-lg flex items-center justify-center p-2'>
						<img
							src={getCountryFlag()}
							alt='Flag'
							className='w-[90%] h-[90%] scale-130'
						/>
					</div>
					<span>{formattedPhone}</span>
				</div>
			)}
		</div>
	)
}

export default PhoneDisplay

