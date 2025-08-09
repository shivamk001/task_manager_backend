import express from 'express';
import { TaskController } from '../controllers/task.controller';
// import currentUser from '../middlewares/currentUser';
import { body, query } from 'express-validator';

const router = express.Router();

// TODO: get current user

router.get('/', TaskController.allTasks);

router.post('/', TaskController.createTask);

router.put('/:taskId', TaskController.updateTask);

router.delete('/:taskId', TaskController.deleteTask);

router.get('/:taskId/subtasks', TaskController.allSubTasks);

router.put('/:taskId/subtasks', TaskController.updateSubTask);

export default router;