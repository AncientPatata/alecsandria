import { Box, Flex } from "@chakra-ui/react";

function Comment(props) {
  const { commenter, comment, creationDate, karma, ...otherProps } = props;
  return (
    <Box width="90%" minHeight="40px" {...otherProps}>
      <Box height="20px" width="100%">
        <Flex>
          <Box>{commenter}</Box>
          <Box>{creationDate}</Box>
          <Box>- {karma} +</Box>
        </Flex>
      </Box>
      <Box>{comment}</Box>
    </Box>
  );
}

export default Comment;
