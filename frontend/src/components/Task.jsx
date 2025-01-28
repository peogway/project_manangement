const Task = (props) => {
	return (
		<div>
			<h2>{props.name}</h2>
			<p>{props.description}</p>
			{props.completed ? <div>Completed</div> : <div>In Progress</div>}
			{props.priority}
			<button onClick={() => props.editTask(props.id, props.project.id)}>
				Edit
			</button>
			<button onClick={() => props.deleteTask(props.id, props.project.id)}>
				Delete
			</button>
		</div>
	)
}

export default Task

