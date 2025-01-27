import { useEffect } from 'react'

const Home = () => {
	useEffect(() => {
		document.title = 'Project Management'
	}, [])
	return <div>Hello world!</div>
}

export default Home

