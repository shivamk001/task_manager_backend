/**
 * Enum representing the possible statuses of a task.
 */
enum TaskStatus {
    /** Task is currently in progress */
    InProgress = 'in-progress',

    /** Task is pending and not started yet */
    Pending = 'pending',

    /** Task is completed */
    Done = 'done'
}

export default TaskStatus;