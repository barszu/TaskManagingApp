import {
  getFilteredTasks,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../services/taskService";
import Task from "../models/Task";
import dbConnect from "../utils/dbConnect";

// Mock dla dbConnect i Mongoose
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

// Sample task data
const sampleTasks = [
  {
    _id: "task1",
    title: "Zadanie 1",
    description: "Opis zadania 1",
    createdAt: new Date("2025-04-01"),
    isCompleted: false,
    priority: 1,
  },
  {
    _id: "task2",
    title: "Zadanie 2",
    description: "Opis zadania 2",
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
    it("powinien zwrócić posortowane i przefiltrowane zadania", async () => {
      // Mock dla funkcji Mongoose
      const mockSort = jest.fn().mockReturnThis();
      const mockSkip = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockResolvedValue(sampleTasks);

      Task.find = jest.fn().mockReturnValue({
        sort: mockSort,
        skip: mockSkip,
        limit: mockLimit,
      });

      Task.countDocuments = jest.fn().mockResolvedValue(2);

      // Wywołanie funkcji
      const result = await getFilteredTasks({
        search: "Zadanie",
        sortField: "priority",
        sortOrder: "desc",
        page: 1,
        limit: 10,
      });

      // Asercje
      expect(dbConnect).toHaveBeenCalled();
      expect(Task.find).toHaveBeenCalledWith({
        title: { $regex: "Zadanie", $options: "i" },
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

    it("powinien użyć domyślnych wartości dla brakujących parametrów", async () => {
      // Mock dla funkcji Mongoose
      const mockSort = jest.fn().mockReturnThis();
      const mockSkip = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockResolvedValue(sampleTasks);

      Task.find = jest.fn().mockReturnValue({
        sort: mockSort,
        skip: mockSkip,
        limit: mockLimit,
      });

      Task.countDocuments = jest.fn().mockResolvedValue(2);

      // Wywołanie funkcji z minimalnymi parametrami
      await getFilteredTasks({});

      // Asercje
      expect(Task.find).toHaveBeenCalledWith({});
      expect(mockSort).toHaveBeenCalledWith({ createdAt: 1 });
      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(mockLimit).toHaveBeenCalledWith(10);
    });
  });

  describe("getAllTasks", () => {
    it("powinien zwrócić wszystkie zadania", async () => {
      Task.find = jest.fn().mockResolvedValue(sampleTasks);

      const result = await getAllTasks();

      expect(dbConnect).toHaveBeenCalled();
      expect(Task.find).toHaveBeenCalledWith({});
      expect(result).toEqual(sampleTasks);
    });
  });
});

describe("updateTask", () => {
  it("powinien zaktualizować istniejące zadanie", async () => {
    const updatedTask = {
      title: "Zaktualizowane zadanie",
      description: "Zaktualizowany opis",
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
    });
    expect(result).toHaveProperty("_id", "task1");
    expect(result).toHaveProperty("title", "Zaktualizowane zadanie");
    expect(result).toHaveProperty("isCompleted", true);
  });

  it("powinien zwrócić null, gdy zadanie nie istnieje", async () => {
    Task.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const result = await updateTask("nieistniejace_id", {
      title: "Test",
      description: "Test",
      isCompleted: false,
      priority: 1,
    });

    expect(result).toBeNull();
  });
});

describe("deleteTask", () => {
  it("powinien usunąć zadanie", async () => {
    Task.findByIdAndDelete = jest.fn().mockResolvedValue(sampleTasks[0]);

    const result = await deleteTask("task1");

    expect(dbConnect).toHaveBeenCalled();
    expect(Task.findByIdAndDelete).toHaveBeenCalledWith("task1");
    expect(result).toEqual(sampleTasks[0]);
  });

  it("powinien zwrócić null, gdy zadanie nie istnieje", async () => {
    Task.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    const result = await deleteTask("nieistniejace_id");

    expect(result).toBeNull();
  });
});
