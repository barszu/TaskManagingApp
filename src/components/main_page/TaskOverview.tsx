"use client";

import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TaskCard from "./TaskCard";
import { TaskDBO } from "@/models/Task";
import TaskSkeleton from "./TaskSkeleton";
import TaskDialog, { ReturnedTaskDTO } from "./TaskDialog";
import { useState } from "react";
import TaskFilters, { TaskQueryParams } from "./TaskFilters";

function postTask(task: ReturnedTaskDTO) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...taskWithoutId } = task;
  return fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskWithoutId),
  });
}

function putTask(task: ReturnedTaskDTO) {
  return fetch(`/api?id=${task._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

function parseQueryParams(params: TaskQueryParams | undefined) {
  if (!params) return "";
  const { search, sortField, sortOrder, page, limit } = params;
  const queryParams: string[] = [];

  if (search) queryParams.push(`search=${search}`);
  if (sortField) queryParams.push(`sortField=${sortField}`);
  if (sortOrder) queryParams.push(`sortOrder=${sortOrder}`);
  if (page) queryParams.push(`page=${page}`);
  if (limit) queryParams.push(`limit=${limit}`);

  return queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
}

export default function TaskOverview() {
  const [editingTask, setEditingTask] = useState<TaskDBO | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<TaskQueryParams | undefined>(
    undefined
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      fetch("/api" + parseQueryParams(filters)).then((res) => res.json()),
  });

  const openEditDialog = (task: TaskDBO | null) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const queryClient = useQueryClient();

  const mutationFromDialog = useMutation({
    mutationFn: async (task: ReturnedTaskDTO) => {
      const response = task.isNewlyCreated
        ? await postTask(task)
        : await putTask(task);
      if (!response.ok) throw new Error("Błąd podczas zapisu taska");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleSave = (task: ReturnedTaskDTO) => {
    mutationFromDialog.mutate(task, {
      onSuccess: () => {
        setDialogOpen(false);
        setEditingTask(null);
      },
      onError: (error) => {
        alert(
          "Wystąpił błąd: " +
            error.message +
            "\n pewnie już taki task o takim tytule istnieje"
        );
      },
    });
  };

  const handleFinishTask = (task: TaskDBO) => {
    const updatedTask = { ...task, isCompleted: true, isNewlyCreated: false };
    mutationFromDialog.mutate(updatedTask, {
      onError: (error) => {
        alert("Wystąpił błąd: " + error.message);
      },
    });
  };

  const mutationFromDeletingTask = useMutation({
    mutationFn: async (task: TaskDBO) => {
      return fetch(`/api?id=${task._id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleDeleteTask = (task: TaskDBO) => {
    mutationFromDeletingTask.mutate(task, {
      onError: (error) => {
        alert("Wystąpił błąd: " + error.message);
      },
    });
  };

  const mutationFromFilters = useMutation({
    mutationFn: async (params: TaskQueryParams) => {
      return fetch("/api" + parseQueryParams(params)).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleTaskDialogSave = (params: TaskQueryParams) => {
    setFilters(params);
    mutationFromFilters.mutate(params, {
      onSuccess: () => {
        setFilters(params);
      },
      onError: (error) => {
        alert("Wystąpił błąd: " + error.message);
      },
    });
  };

  if (error) return <p>Something went wrong</p>;

  return (
    <Flex p={5} gap={5}>
      {/* Kolumna filtrów */}
      <Box width="250px" spaceY={4}>
        <TaskFilters
          onSubmit={handleTaskDialogSave}
          currPage={data ? data.page : undefined}
          currPageLimit={data ? data.totalPages : undefined}
        />
        <TaskDialog
          isOpen={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          initialTask={editingTask || undefined}
          onSave={handleSave}
        />
        <VStack p={4} borderWidth="1px" borderRadius="md">
          <Button
            colorPalette={"green"}
            width={"100%"}
            onClick={() => openEditDialog(null)}
          >
            + Dodaj nowy task
          </Button>
        </VStack>
      </Box>

      {/* cards column */}
      <Box flex="1">
        <Flex flexWrap="wrap" gap={4}>
          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <TaskSkeleton key={idx} />
            ))}

          {data &&
            data.tasks.map((task: TaskDBO) => (
              <TaskCard
                key={task._id}
                task={task}
                onEditTaskClicked={() => openEditDialog(task)}
                onCompleteTaskClicked={() => handleFinishTask(task)}
                onDeleteTaskClicked={() => handleDeleteTask(task)}
              />
            ))}
        </Flex>
      </Box>
    </Flex>
  );
}
