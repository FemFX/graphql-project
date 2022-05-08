import { NextPage } from "next";
import { useState } from "react";
import { usePostsQuery } from "../generated/graphql";
import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

const Index: NextPage = () => {
  const [limit, setLimit] = useState<number>(5);
  const [offset, setOffset] = useState<number | null>(null);
  const { data, loading, fetchMore, refetch } = usePostsQuery({
    variables: {
      limit,
      offset,
    },
    notifyOnNetworkStatusChange: true,
  });
  return (
    <>
      <NextLink href={"/create-post"}>
        <Button>
          <Link>Create Post</Link>
        </Button>
      </NextLink>
      <br />
      {!data && loading ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.map((p) => (
            <Box key={p.id} p={5} shadow="md" borderWidth={"1px"}>
              <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                <Heading fontSize={"xl"}>
                  <Link>{p.title}</Link>
                </Heading>
              </NextLink>
              <Text mt={4}>{p.text.slice(0, 100)}...</Text>
            </Box>
          ))}
        </Stack>
      )}
      <Flex>
        <Button
          m="auto"
          isLoading={loading}
          mt={3}
          my={4}
          onClick={() => {
            // fetchMore({
            //   variables: {
            //     limit,
            //     offset,
            //   },
            // });
            setOffset(limit);
            setLimit(limit * 2);
            fetchMore({
              variables: {
                limit,
                offset,
              },
            });
          }}
        >
          Load more
        </Button>
      </Flex>
    </>
  );
};
export default Index;
