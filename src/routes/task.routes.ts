import { Router } from "express";
import { TaskController } from "../controllers/task.controller"
import {
  validateCreateTask,
  validateGetTasks,
  validateTaskId,
  validateUpdateTask,
} from "../validators/task.validator";

const router = Router();
const taskController = new TaskController();

router
  .route("/")
  .post(validateCreateTask, taskController.createTask)
  .get(validateGetTasks, taskController.getAllTasks);

router
  .route("/:id")
  .get(validateTaskId, taskController.getTaskById)
  .put(validateTaskId,validateUpdateTask, taskController.updateTask
 )
  .delete(validateTaskId, taskController.deleteTask)

export default router;