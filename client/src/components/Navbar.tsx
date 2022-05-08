import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";

import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const Navbar: React.FC = (): JSX.Element => {
  const { data, loading } = useMeQuery({});
  const [logout, { loading: logoutLoading }] = useLogoutMutation({
    refetchQueries: "all",
  });
  let body = null;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={4} color="white">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box>{data.me.username}</Box>
        <Button
          ml={2}
          variant="link"
          color={"white"}
          isLoading={logoutLoading}
          onClick={() => {
            logout();
          }}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tomato" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default Navbar;
