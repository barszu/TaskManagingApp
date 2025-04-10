import { Box, Skeleton } from "@chakra-ui/react";

export default function TaskSkeleton() {
  return (
    <Box width="350px" p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm">
      <Skeleton height="20px" mb="4" />
      <Skeleton height="16px" mb="2" />
      <Skeleton height="90px" />
    </Box>
  );
}
