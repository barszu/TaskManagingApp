"use client";

import { TaskDBO } from "@/models/Task";
import {
  Button,
  Dialog,
  Textarea,
  Input,
  Checkbox,
  Fieldset,
  Field,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Partial<TaskDBO>;
  onSave: (task: ReturnedTaskDTO) => void;
}

export interface ReturnedTaskDTO extends TaskDBO {
  isNewlyCreated: boolean; // added flag to indicate if the task is newly created
}

export default function TaskDialog({
  isOpen,
  onClose,
  initialTask = {},
  onSave,
}: TaskDialogProps) {
  const [title, setTitle] = useState(initialTask.title || "");
  const [description, setDescription] = useState(initialTask.description || "");
  const [createdAt, setCreatedAt] = useState(
    initialTask.createdAt
      ? new Date(initialTask.createdAt).toISOString().slice(0, 10)
      : ""
  );
  const [isCompleted, setIsCompleted] = useState(
    initialTask.isCompleted || false
  );
  const [priority, setPriority] = useState(initialTask.priority || 1);

  useEffect(() => {
    if (initialTask && Object.keys(initialTask).length > 0) {
      setTitle(initialTask.title || "");
      setDescription(initialTask.description || "");
      setCreatedAt(
        initialTask.createdAt
          ? new Date(initialTask.createdAt).toISOString().slice(0, 10)
          : ""
      );
      setIsCompleted(initialTask.isCompleted || false);
      setPriority(initialTask.priority || 1);
    }
  }, [initialTask, isOpen]);

  const handleSubmit = () => {
    const task: ReturnedTaskDTO = {
      _id: initialTask._id || "",
      title,
      description,
      createdAt: new Date(createdAt),
      isCompleted,
      priority,
      isNewlyCreated: !initialTask.title,
    };
    onSave(task);
    onClose();
  };

  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
    >
      {/* <Dialog.Trigger asChild>
        <Button colorScheme="blue">Dodaj nowe zadanie</Button>
      </Dialog.Trigger> */}

      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>
              {initialTask.title ? "Edytuj zadanie" : "Nowe zadanie"}
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Fieldset.Root size="lg">
              <Fieldset.Legend>
                {initialTask.title
                  ? "Edytuj szczegóły zadania"
                  : "Dodaj nowe zadanie"}
              </Fieldset.Legend>

              <Field.Root>
                <Field.Label>Tytuł</Field.Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Wpisz tytuł zadania"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Opis</Field.Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Wpisz opis zadania"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Data utworzenia</Field.Label>
                <Input
                  type="date"
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Priorytet (1-3)</Field.Label>
                <Input
                  type="number"
                  value={priority}
                  defaultValue={2}
                  onChange={(e) => setPriority(Number(e.target.value))}
                />
              </Field.Root>

              <Field.Root>
                <Checkbox.Root
                  checked={isCompleted}
                  onCheckedChange={(e) => setIsCompleted(!!e.checked)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>Ukończone</Checkbox.Label>
                </Checkbox.Root>
              </Field.Root>
            </Fieldset.Root>
          </Dialog.Body>

          <Dialog.Footer justifyContent="flex-end" gap={3}>
            <Button colorPalette="red" onClick={onClose}>
              Anuluj
            </Button>
            <Button colorPalette="green" onClick={handleSubmit}>
              Zapisz
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
