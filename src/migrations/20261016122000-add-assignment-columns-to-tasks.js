"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn("Tasks", "assignedTo", {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("Tasks", "assignedByAdmin", {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Tasks", "assignedByAdmin");
    await queryInterface.removeColumn("Tasks", "assignedTo");
  },
};
