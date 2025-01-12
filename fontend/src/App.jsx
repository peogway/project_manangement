import { useState } from 'react'
import Notification from './components/Notification'

import LoginForm from './components/LoginForm'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification, setError } from './reducers/notiReducer'
import { setUserFn, rmUserFn } from './reducers/userReducer'

const App = () => {
	return <div>Hello world</div>
}

export default App

