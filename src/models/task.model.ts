import {
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "Tasks",
  timestamps: true,
})
class Task extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare title: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.ENUM(
      "pending",
      "in_progress",
      "completed"
    ),
    allowNull: false,
    defaultValue: "pending",
  })
  declare status: "pending" | "in_progress" | "completed";

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dueDate: Date | null;

 @Column({
  type: DataType.INTEGER,
  allowNull: true,
})
declare assignedTo: number | null;

@Column({
  type: DataType.INTEGER,
  allowNull: true,
})
declare assignedByAdmin: number | null;

@Column({
    type: DataType.DATE,
    allowNull: true,
})
declare assignedOn: Date | null;
}

export default Task;