import { NextRequest, NextResponse } from "next/server";
import {
  // getAllTasks,
  getFilteredTasks,
  createTask,
  updateTask,
  deleteTask,
  TaskQueryParams,
} from "../../services/taskService";
import { TaskDTO } from "../../models/Task";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sortFieldParam = searchParams.get("sortField") || "createdAt";
    const validSortFields = [
      "title",
      "description",
      "createdAt",
      "isCompleted",
      "priority",
    ];

    // preparing queryParams
    const queryParams: TaskQueryParams = {
      search: searchParams.get("search") || "",
      sortField: validSortFields.includes(sortFieldParam)
        ? (sortFieldParam as keyof TaskDTO)
        : "createdAt",
      sortOrder: searchParams.get("sortOrder") === "desc" ? "desc" : "asc",
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };

    const result = await getFilteredTasks(queryParams);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching tasks: " + error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newTask = await createTask(body);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating task: " + error },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const updatedTask = await updateTask(id!, body);
    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating task: " + error },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const deletedTask = await deleteTask(id!);
    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting task: " + error },
      { status: 500 }
    );
  }
}
