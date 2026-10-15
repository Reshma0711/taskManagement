import sequelize from "../config/sequelizer"
import Task from "./task.model"

// Register all models here
sequelize.addModels([Task]);

export { sequelize, Task };