import express from 'express';
import { TaskController } from '../controllers/task.controller';
import { body, param } from 'express-validator';
import currentUser from '../middlewares/currentUser';
import TaskStatus from '../utils/enums';

const router = express.Router();

/**
 * Middleware to set the current authenticated user on the request.
 */
router.use(currentUser);

/**
 * Get all tasks for the current user.
 * 
 * @route GET /
 * @returns {Array<Task>} 200 - list of tasks
 */
router.get('/', TaskController.allTasks);

/**
 * Create a new task for the current user.
 * 
 * Request body validation:
 * - subject: required, alphanumeric string
 * - status: required, one of Done, InProgress, Pending
 * - lastDate: required, date string (yyyy-mm-dd)
 * 
 * @route POST /
 * @param {string} subject.body.required
 * @param {string} status.body.required
 * @param {string} lastDate.body.required
 * @returns {Task} 201 - created task
 */
router.post('/', 
    [   
        body('subject')
            .notEmpty()
            .isAlphanumeric()
            .withMessage('Subject must be passed'),
        body('status')
            .notEmpty()
            .isIn([TaskStatus.Done, TaskStatus.InProgress, TaskStatus.Pending])
            .withMessage('Status must be valid value: in-progress, done, pending'), 
        body('lastDate')
            .notEmpty()
            .isDate()
            .withMessage('lastDate must be valid yyyy-mm-dd format')
    ],
    TaskController.createTask);

/**
 * Update an existing task by ID.
 * 
 * Request parameters and body validation:
 * - taskId: required URL parameter
 * - subject: required, alphanumeric string
 * - status: required, one of Done, InProgress, Pending
 * - lastDate: required, date string (yyyy-mm-dd)
 * 
 * @route PUT /:taskId
 * @param {string} taskId.path.required - task ID
 * @param {string} subject.body.required
 * @param {string} status.body.required
 * @param {string} lastDate.body.required
 * @returns {Task} 200 - updated task
 */
router.put('/:taskId',
    [   
        param('taskId')
            .exists()
            .withMessage('TaskId must be passed'),
        body('subject')
            .isAlphanumeric()
            .notEmpty()
            .withMessage('Subject must be passed'),
        body('status')
            .notEmpty()
            .isIn([TaskStatus.Done, TaskStatus.InProgress, TaskStatus.Pending])
            .withMessage('Status must be passed'), 
        body('lastDate')
            .isDate()
            .notEmpty()
            .withMessage('lastDate must be passed')
    ],
    TaskController.updateTask);

/**
 * Delete a task by ID.
 * 
 * Request parameter validation:
 * - taskId: required URL parameter
 * 
 * @route DELETE /:taskId
 * @param {string} taskId.path.required - task ID
 * @returns 204 - no content
 */
router.delete('/:taskId', 
        [   
        param('taskId')
            .exists()
            .withMessage('TaskId must be passed')
    ],
    TaskController.deleteTask);

/**
 * Get all subtasks for a specific task.
 * 
 * @route GET /:taskId/subtasks
 * @param {string} taskId.path.required - task ID
 * @returns {Array<Subtask>} 200 - list of subtasks
 */
router.get('/:taskId/subtasks', TaskController.allSubTasks);

/**
 * Update subtasks for a specific task.
 * 
 * Request body should contain the complete list of subtasks.
 * 
 * @route PUT /:taskId/subtasks
 * @param {string} taskId.path.required - task ID
 * @returns {Array<Subtask>} 200 - updated list of subtasks
 */
router.put('/:taskId/subtasks', TaskController.updateSubTask);

export default router;