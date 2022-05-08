import { NextPage } from "next";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import Wrapper from "../../components/Wrapper";
import InputField from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";

const changePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values) => {
          const res = await changePassword({
            variables: { newPassword: values.newPassword, token },
          });
          router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type={"password"}
            />
            <Button mt={4} type="submit" color="teal" isLoading={isSubmitting}>
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

changePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default changePassword;
