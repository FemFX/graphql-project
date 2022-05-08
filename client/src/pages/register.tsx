import { NextPage } from "next";
import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";

const register: NextPage = () => {
  const router = useRouter();
  const [register] = useRegisterMutation({
    refetchQueries: "all",
  });
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        onSubmit={async (values) => {
          await register({
            variables: {
              username: values.username,
              password: values.password,
              email: values.email,
            },
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
                name="email"
                placeholder="email"
                label="email"
                type="email"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>

            <Button mt={4} type="submit" color="teal" isLoading={isSubmitting}>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default register;
