// import Image from "next/image";

import TaskControllerView from "@/components/main_page/TaskOverview";
import { HStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <HStack>
      <TaskControllerView />
    </HStack>
  );
}
