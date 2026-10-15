import { Request, Response } from "express";

import {
  ICreateTaskRequest,
  IUpdateTaskRequest,
  IGetTasksQuery,
  ITaskResponseData,
} from "../interfaces/task.interface";

import {
  sendSuccess,
  sendFailure,
  sendServerError,
  formatTask,
} from "../utils/api-response";

import { Task } from "../models";

export class TaskController {
  // Create task
  async createTask(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        status,
        dueDate,
      }: ICreateTaskRequest = req.body;

      const task = await Task.create({
        title: title.trim(),
        description: description ?? null,
        status: status ?? "pending",
        dueDate: dueDate ? new Date(dueDate) : null,
      });

      return sendSuccess(
        res,
        "Task created successfully",
        { task: formatTask(task) },
        201
      );
    } catch (error) {
      console.error("Failed to create task:", error);
      return sendServerError(res, error);
    }
  }

  // Get all tasks with filtering and pagination
  async getAllTasks(req: Request, res: Response) {
    try {
      const {
        status,
        page = "1",
        limit = "10",
      }: IGetTasksQuery = req.query;

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const { count, rows } = await Task.findAndCountAll({
        where: status ? { status } : {},
        limit: limitNumber,
        offset: (pageNumber - 1) * limitNumber,
        order: [["id", "DESC"]],
      });

      return sendSuccess(res, "Tasks retrieved successfully", {
        tasks: rows.map(formatTask),
        pagination: {
          total: count,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(count / limitNumber),
        },
      });
    } catch (error) {
      console.error("Failed to retrieve tasks:", error);
      return sendServerError(res, error);
    }
  }

  // Get task by ID
  async getTaskById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const task = await Task.findByPk(id);

      if (!task) {
        return sendFailure(res, 404, "Task not found");
      }

      return sendSuccess(
        res,
        "Task retrieved successfully",
        { task: formatTask(task) }
      );
    } catch (error) {
      console.error("Failed to retrieve task:", error);
      return sendServerError(res, error);
    }
  }

  // Update task
  async updateTask(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const task = await Task.findByPk(id);

      if (!task) {
        return sendFailure(res, 404, "Task not found");
      }

      const {
        title,
        description,
        status,
        dueDate,
      }: IUpdateTaskRequest = req.body;

      await task.update({
        ...(title !== undefined && {
          title: title.trim(),
        }),
        ...(description !== undefined && {
          description,
        }),
        ...(status !== undefined && { status }),
        ...(dueDate !== undefined && {
          dueDate: dueDate === null ? null : new Date(dueDate),
        }),
      });

      return sendSuccess(
        res,
        "Task updated successfully",
        { task: formatTask(task) }
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      return sendServerError(res, error);
    }
  }

  // Delete task
  async deleteTask(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const task = await Task.findByPk(id);

      if (!task) {
        return sendFailure(res, 404, "Task not found");
      }

      await task.destroy();

      return sendSuccess(
        res,
        "Task deleted successfully",
        { id }
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
      return sendServerError(res, error);
    }
  }
}