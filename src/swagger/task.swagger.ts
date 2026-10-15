/**
 * @openapi
 * /task:
 *   post:
 *     tags:
 *       - Task Management API
 *     summary: Create a task
 *     description: Creates a new task with a title and optional details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Finish the task management API
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 default: pending
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: "2026-10-20T10:00:00.000Z"
 *     responses:
 *       '201':
 *         description: Task created successfully
 *       '400':
 *         description: Invalid task data
 *       '500':
 *         description: Server error
 */