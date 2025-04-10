"use server";

import dbConnect from "@/utils/dbConnect";
import Task, { TaskDTO, ITask } from "../models/Task";

// Interface for paginated tasks
export interface PaginatedTasks {
  tasks: ITask[]; // List of tasks as Mongoose documents
  total: number; // Total number of tasks
  page: number; // Current page
  totalPages: number; // Total number of pages
}

export type sortOrderType = "asc" | "desc"; // Type for sorting order

// Interface for filtering, sorting, and pagination parameters
export interface TaskQueryParams {
  search?: string; // Optional search by title
  sortField?: keyof TaskDTO; // Field to sort by
  sortOrder?: sortOrderType; // Sorting order (ascending/descending)
  page?: number; // Page number
  limit?: number; // Number of results per page
}

export async function getFilteredTasks(
  params: TaskQueryParams
): Promise<PaginatedTasks> {
  const {
    search = "",
    sortField = "createdAt",
    sortOrder = "asc",
    page = 1,
    limit = 10,
  } = params;

  const query = search
    ? { title: { $regex: search, $options: "i" } } // Case-insensitive search
    : {};

  await dbConnect();
  const tasksList = await Task.find(query)
    .sort({ [sortField]: sortOrder === "desc" ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalTasks = await Task.countDocuments(query);

  return {
    tasks: tasksList,
    total: totalTasks,
    page,
    totalPages: Math.ceil(totalTasks / limit),
  };
}

export async function getAllTasks() {
  await dbConnect();
  return await Task.find({});
}

export async function createTask(data: TaskDTO) {
  await dbConnect();
  const newTask = new Task(data);
  return await newTask.save();
}

export async function updateTask(id: string, data: Partial<TaskDTO>) {
  await dbConnect();
  return await Task.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteTask(id: string) {
  await dbConnect();
  return await Task.findByIdAndDelete(id);
}
