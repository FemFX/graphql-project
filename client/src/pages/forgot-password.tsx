import React, { useState } from "react";
import Wrapper from "../components/Wrapper";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";
import { NextPage } from "next";
import { Box, Button } from "@chakra-ui/react";

const forgotPassword: NextPage = () => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              if an account with that email exists, we sent you can email
            </Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variant="teal"
              >
                forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default forgotPassword;