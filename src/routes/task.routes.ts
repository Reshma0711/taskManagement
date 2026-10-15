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

router.post("/", validateCreateTask, taskController.createTask);

router.get("/", validateGetTasks, taskController.getAllTasks);

router.get("/:id", validateTaskId, taskController.getTaskById);

router.put("/:id", validateTaskId, validateUpdateTask, taskController.updateTask);

router.delete("/:id", validateTaskId, taskController.deleteTask);

export default router;