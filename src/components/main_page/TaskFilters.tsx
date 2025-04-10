"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  HStack,
  Input,
  Text,
  VStack,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { TaskDTO } from "@/models/Task";

export type sortOrderType = "asc" | "desc";

export interface TaskQueryParams {
  search?: string; // Optional search by title
  sortField?: keyof TaskDTO; // Field to sort by
  sortOrder?: sortOrderType; // Sorting order (ascending/descending)
  page?: number; // Page number
  limit?: number; // Number of results per page
}

interface TaskFiltersProps {
  onSubmit: (params: TaskQueryParams) => void;
  currPage?: number; // Displaying current page (default = 1)
  currPageLimit?: number; // Maximum number of results per page (default = 1)
}

const sortFieldOptions = createListCollection({
  items: [
    { label: "Tytuł", value: "title" },
    { label: "Opis", value: "description" },
    { label: "Data utworzenia", value: "createdAt" },
    { label: "Status", value: "isCompleted" },
    { label: "Priorytet", value: "priority" },
  ],
});

const sortOrderOptions = createListCollection({
  items: [
    { label: "Rosnąco", value: "asc" },
    { label: "Malejąco", value: "desc" },
  ],
});

export default function TaskFilters({
  onSubmit,
  currPage = 1,
  currPageLimit = 1,
}: TaskFiltersProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof TaskDTO>("title");
  const [sortOrder, setSortOrder] = useState<sortOrderType>("asc");
  const [page, setPage] = useState(currPage);
  const [limit, setLimit] = useState(10);

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, currPageLimit));
  };

  const handleSubmit = () => {
    onSubmit({
      search,
      sortField,
      sortOrder,
      page,
      limit,
    });
  };

  useEffect(() => {
    handleSubmit();
  }, [page]);

  return (
    <VStack align="start" spaceY={4} p={4} borderWidth="1px" borderRadius="md">
      <Text fontWeight="bold">Filtry Tasków</Text>

      <Input
        placeholder="Wpisz wyszukiwaną frazę"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <VStack>
        <Select.Root
          collection={sortFieldOptions}
          value={[sortField]}
          width="180px"
          onValueChange={(e) => setSortField(e.value[0] as keyof TaskDTO)}
        >
          <Select.HiddenSelect />
          <Select.Label>Sortuj wg</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Wybierz pole" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {sortFieldOptions.items.map((option) => (
                  <Select.Item key={option.value} item={option}>
                    {option.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        {/* Select dla sortOrder */}
        <Select.Root
          collection={sortOrderOptions}
          width="180px"
          value={[sortOrder]}
          onValueChange={(e) => setSortOrder(e.value[0] as sortOrderType)}
        >
          <Select.HiddenSelect />
          <Select.Label>Sortowanie</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Wybierz kolejność" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {sortOrderOptions.items.map((option) => (
                  <Select.Item key={option.value} item={option}>
                    {option.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </VStack>

      <VStack>
        <Text>Limit wyników na stronę:</Text>
        <Input
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        />
      </VStack>

      <Button colorPalette={"blue"} width={"100%"} onClick={handleSubmit}>
        Filtruj
      </Button>
      <HStack spaceX={2}>
        <Button size="sm" onClick={handlePrevPage}>
          {"<"}
        </Button>
        <Text>Strona {page}</Text>
        <Button size="sm" onClick={handleNextPage}>
          {">"}
        </Button>
      </HStack>
    </VStack>
  );
}
