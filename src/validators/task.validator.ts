import type { RequestHandler } from "express";
import {
  body,
  param,
  query,
  validationResult,
} from "express-validator";
import { sendFailure } from "../utils/api-response";

const TASK_STATUSES = [
  "pending",
  "in_progress",
  "completed",
] as const;

const TASK_FIELDS = [
  "title",
  "description",
  "status",
  "dueDate",
] as const;
const taskFieldSet = new Set<string>(TASK_FIELDS);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidDate(value: unknown): boolean {
  if (
    typeof value !== "string" ||
    value.trim() === "" ||
    Number.isNaN(Date.parse(value))
  ) {
    return false;
  }

  return (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    new Date(value).toISOString().slice(0, 10) === value
  );
}

const validateRequest: RequestHandler = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return sendFailure(
      res,
      400,
      "Validation failed",
      {
        fields: validationErrors.array().map((error) => ({
          field: error.type === "field" ? error.path : "body",
          message: String(error.msg),
        })),
      }
    );
  }

  return next();
};

const validateTaskBody = (allowEmpty: boolean): RequestHandler[] => [
  body().custom((value: unknown) => {
    if (!isObject(value)) {
      throw new Error("Request body must be a JSON object");
    }

    const fields = Object.keys(value);
    if (!allowEmpty && fields.length === 0) {
      throw new Error("At least one field is required");
    }

    const invalidFields = fields.filter((field) => !taskFieldSet.has(field));
    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
    }

    return true;
  }),
];

export const validateCreateTask: RequestHandler[] = [
  ...validateTaskBody(true),
  body("title")
    .exists()
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Title must be 255 characters or fewer"),
  body("description")
    .optional()
    .custom((value: unknown) => value === null || typeof value === "string")
    .withMessage("Description must be a string or null"),
  body("status")
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage("Status must be pending, in_progress, or completed"),
  body("dueDate")
    .optional()
    .custom((value: unknown) => value === null || isValidDate(value))
    .withMessage("Invalid due date"),
  validateRequest,
];

export const validateGetTasks: RequestHandler[] = [
  query("status")
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage("Invalid task status"),
  query("page")
    .optional()
    .trim()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .trim()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100"),
  validateRequest,
];

export const validateTaskId: RequestHandler[] = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid task ID"),
  validateRequest,
];

export const validateUpdateTask: RequestHandler[] = [
  ...validateTaskBody(false),
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Title must be 255 characters or fewer"),
  body("description")
    .optional()
    .custom((value: unknown) =>
      value === undefined || value === null || typeof value === "string"
    )
    .withMessage("Description must be a string or null"),
  body("status")
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage("Status must be pending, in_progress, or completed"),
  body("dueDate")
    .optional()
    .custom((value: unknown) =>
      value === undefined || value === null || isValidDate(value)
    )
    .withMessage("Invalid due date"),
  validateRequest,
];
