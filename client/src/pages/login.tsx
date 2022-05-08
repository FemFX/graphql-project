import { NextPage } from "next";
import { Formik, Form } from "formik";
import { Box, Button, Flex } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import Link from "next/link";

const login: NextPage = () => {
  const router = useRouter();
  const [login] = useLoginMutation({
    refetchQueries: "all",
  });
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values) => {
          await login({
            variables: { username: values.username, password: values.password },
          }).then(() => router.push("/"));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex mt={2}>
              <Box ml="auto">
                <Link href="/forgot-password">Forgot Password</Link>
              </Box>
            </Flex>
            <Button mt={4} type="submit" color="teal" isLoading={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default login;
