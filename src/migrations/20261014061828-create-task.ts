import { DataTypes, QueryInterface } from "sequelize";

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      title: {
        type: DataTypes.STRING,
      },

      description: {
        type: DataTypes.TEXT,
      },

      status: {
        type: DataTypes.STRING,
      },

      dueDate: {
        type: DataTypes.DATE,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Tasks");
  },
};
