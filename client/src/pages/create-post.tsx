import { NextPage } from "next";
import Wrapper from "../components/Wrapper";
import { Formik, Form } from "formik";
import { Box, Button, Flex } from "@chakra-ui/react";
import InputField from "../components/InputField";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";

const createPost: NextPage = () => {
  const [createPost] = useCreatePostMutation();
  const { data } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!data?.me) {
      router.replace("/login");
    }
  }, []);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          await createPost({ variables: { input: values } });
          router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text"
                label="text"
              />
            </Box>
            {/* <Flex mt={2}>
              <Box ml="auto">
                <Link href="/forgot-password">Forgot Password</Link>
              </Box>
            </Flex> */}
            <Button mt={4} type="submit" color="teal" isLoading={isSubmitting}>
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default createPost;
