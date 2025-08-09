import express from 'express';
import { TaskController } from '../controllers/task.controller';
import { body, param, query } from 'express-validator';
import currentUser from '../middlewares/currentUser';
import TaskStatus from '../utils/enums';

const router = express.Router();

router.use(currentUser);

router.get('/', TaskController.allTasks);

// TODO: USE express-validator
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

router.delete('/:taskId', 
        [   
        param('taskId')
            .exists()
            .withMessage('TaskId must be passed')
    ],
    TaskController.deleteTask);

router.get('/:taskId/subtasks', TaskController.allSubTasks);

router.put('/:taskId/subtasks', TaskController.updateSubTask);

export default router;