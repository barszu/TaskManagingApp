"use client";

import React from "react";
import {
  Box,
  Heading,
  Text,
  Badge,
  Stack,
  Flex,
  Button,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { TaskDTO } from "@/models/Task";

interface TaskCardProps {
  task: TaskDTO;
  onCompleteTaskClicked?: () => void;
  onEditTaskClicked?: () => void;
  onDeleteTaskClicked?: () => void;
}

export default function TaskCard({
  task,
  onCompleteTaskClicked = () => {},
  onDeleteTaskClicked = () => {},
  onEditTaskClicked = () => {},
}: TaskCardProps) {
  const displayedDate = task.createdAt
    ? format(new Date(task.createdAt), "d MMMM yyyy", { locale: pl })
    : "Brak daty";

  const priorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "red.400";
      case 2:
        return "orange.400";
      case 3:
        return "yellow.400";
      default:
        return "gray.400";
    }
  };

  const displayedDescription =
    task.description.length > 50
      ? task.description.slice(0, 50) + "..."
      : task.description;

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="xl"
      bg={task.isCompleted ? "green.50" : "white"}
      width={"350px"}
    >
      <Stack>
        <Flex justify="space-between" align="center">
          <Heading size="lg">{task.title}</Heading>
          <Badge colorScheme={task.isCompleted ? "green" : "red"}>
            {task.isCompleted ? "Ukończone" : "W toku"}
          </Badge>
        </Flex>

        <Text fontSize={"sm"}>{displayedDescription}</Text>

        <Flex justify="space-between" align="center" spaceX={10} mt={3}>
          <Text fontSize="sm" color="gray.600">
            Dodano: {displayedDate}
          </Text>
          <Badge color={priorityColor(task.priority)}>
            Priorytet: {task.priority}
          </Badge>
        </Flex>

        <Flex mt={2} justify="flex-end" gap={2}>
          {task.isCompleted ? null : (
            <Button
              colorPalette="green"
              size="xs"
              onClick={onCompleteTaskClicked}
            >
              Ukończ
            </Button>
          )}

          <Button colorPalette="blue" size="xs" onClick={onEditTaskClicked}>
            Modyfikuj
          </Button>
          <Button colorPalette="red" size="xs" onClick={onDeleteTaskClicked}>
            Usuń
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}
