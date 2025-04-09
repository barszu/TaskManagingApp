import mongoose, { Schema, Document, Model } from "mongoose";

export interface TaskDTO {
  title: string;
  description: string;
  createdAt: Date;
  isCompleted: boolean;
  priority: number;
}

export interface ITask extends TaskDTO, Document {}

// Schema for the task
const taskSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true }, // Title is required, unique
  description: { type: String, required: false }, // Description is optional
  createdAt: { type: Date, default: Date.now }, // Default set to the current date
  isCompleted: { type: Boolean, default: false }, // By default, the task is not completed
  priority: { type: Number, default: 3 }, // Default priority is 3 (low)
});

// Create the model or use an existing one
const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;
