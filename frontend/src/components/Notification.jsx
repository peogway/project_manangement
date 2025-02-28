// import { useDispatch } from 'react-redux'
// import { setNotification } from '../reducers/notiReducer'

// eslint-disable-next-line react/prop-types
const Notification = ({ message, className }) => {
  
  if (!message) {
    return null
  }

  return <div className={`${className} absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg`}>{message}</div>
}

export default Notification

