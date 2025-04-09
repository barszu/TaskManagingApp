import {
  getFilteredTasks,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../services/taskService";
import Task from "../models/Task";
import dbConnect from "../utils/dbConnect";

jest.mock("../utils/dbConnect", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));

jest.mock("../models/Task", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

const sampleTasks = [
  {
    _id: "task1",
    title: "Task 1",
    description: "Description of task 1",
    createdAt: new Date("2025-04-01"),
    isCompleted: false,
    priority: 1,
  },
  {
    _id: "task2",
    title: "Task 2",
    description: "Description of task 2",
    createdAt: new Date("2025-04-02"),
    isCompleted: true,
    priority: 2,
  },
];

describe("Task Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFilteredTasks", () => {
    it("should return sorted and filtered tasks", async () => {
      // Mock for Mongoose functions
      const mockSort = jest.fn().mockReturnThis();
      const mockSkip = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockResolvedValue(sampleTasks);

      Task.find = jest.fn().mockReturnValue({
        sort: mockSort,
        skip: mockSkip,
        limit: mockLimit,
      });

      Task.countDocuments = jest.fn().mockResolvedValue(2);

      // Function call
      const result = await getFilteredTasks({
        search: "Task",
        sortField: "priority",
        sortOrder: "desc",
        page: 1,
        limit: 10,
      });

      // Assertions
      expect(dbConnect).toHaveBeenCalled();
      expect(Task.find).toHaveBeenCalledWith({
        title: { $regex: "Task", $options: "i" },
      });
      expect(mockSort).toHaveBeenCalledWith({ priority: -1 });
      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(mockLimit).toHaveBeenCalledWith(10);
      expect(Task.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        tasks: sampleTasks,
        total: 2,
        page: 1,
        totalPages: 1,
      });
    });

    it("should use default values for missing parameters", async () => {
      // Mock for Mongoose functions
      const mockSort = jest.fn().mockReturnThis();
      const mockSkip = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockResolvedValue(sampleTasks);

      Task.find = jest.fn().mockReturnValue({
        sort: mockSort,
        skip: mockSkip,
        limit: mockLimit,
      });

      Task.countDocuments = jest.fn().mockResolvedValue(2);

      // Function call with minimal parameters
      await getFilteredTasks({});

      // Assertions
      expect(Task.find).toHaveBeenCalledWith({});
      expect(mockSort).toHaveBeenCalledWith({ createdAt: 1 });
      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(mockLimit).toHaveBeenCalledWith(10);
    });
  });

  describe("getAllTasks", () => {
    it("should return all tasks", async () => {
      Task.find = jest.fn().mockResolvedValue(sampleTasks);

      const result = await getAllTasks();

      expect(dbConnect).toHaveBeenCalled();
      expect(Task.find).toHaveBeenCalledWith({});
      expect(result).toEqual(sampleTasks);
    });
  });
});

describe("updateTask", () => {
  it("should update an existing task", async () => {
    const updatedTask = {
      title: "Updated task",
      description: "Updated description",
      isCompleted: true,
      priority: 1,
    };

    Task.findByIdAndUpdate = jest.fn().mockResolvedValue({
      _id: "task1",
      ...updatedTask,
      createdAt: new Date(),
    });

    const result = await updateTask("task1", updatedTask);

    expect(dbConnect).toHaveBeenCalled();
    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith("task1", updatedTask, {
      new: true,
      runValidators: true,
    });
    expect(result).toHaveProperty("_id", "task1");
    expect(result).toHaveProperty("title", "Updated task");
    expect(result).toHaveProperty("isCompleted", true);
  });

  it("should return null when the task does not exist", async () => {
    Task.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const result = await updateTask("nonexistent_id", {
      title: "Test",
      description: "Test",
      isCompleted: false,
      priority: 1,
    });

    expect(result).toBeNull();
  });
});

describe("deleteTask", () => {
  it("should delete a task", async () => {
    Task.findByIdAndDelete = jest.fn().mockResolvedValue(sampleTasks[0]);

    const result = await deleteTask("task1");

    expect(dbConnect).toHaveBeenCalled();
    expect(Task.findByIdAndDelete).toHaveBeenCalledWith("task1");
    expect(result).toEqual(sampleTasks[0]);
  });

  it("should return null when the task does not exist", async () => {
    Task.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    const result = await deleteTask("nonexistent_id");

    expect(result).toBeNull();
  });
});
