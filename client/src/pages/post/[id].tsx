import { Box, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";

const Post: NextPage = () => {
  const router = useRouter();
  const { data, loading } = usePostQuery({
    variables: {
      id: +router.query.id,
    },
  });
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Heading mb={4}>{data.post.title}</Heading>
          <Box mb={4}>{data.post.text}</Box>
          {/* <EditDeletePostButtons
            id={data.post.id}
            creatorId={data.post.creator.id}
          /> */}
        </>
      )}
    </>
  );
};

export default Post;
