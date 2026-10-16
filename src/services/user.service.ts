import { Request, Response, NextFunction } from "express";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is required",
      });
    }

    const response = await fetch(
      `${process.env.USER_SERVICE_URL}/internal/assignments/validate/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    const data = await response.json();

    // Forward User Management's response to Task Management
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Make the response available to the controller
    res.locals.userValidation = data;

    next();
  } catch (error) {
    console.error("User Management API error:", error);

    return res.status(502).json({
      message: "Unable to communicate with User Management",
    });
  }
};