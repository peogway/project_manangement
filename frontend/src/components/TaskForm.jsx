import { useField } from '../hooks/hook'

const TaskForm = (props) => {
	const { remove: rmTask, ...task } = useField('text')
	return (
		<div>
			<h1>Add New Task</h1>
			<button onClick={props.closeForm}>close</button>
			<div className='task-name'>
				<label>Task Name</label>
				<br />
				<input {...task} />
			</div>
		</div>
	)
}

export default TaskForm

