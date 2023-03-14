import { Box, Button, Flex, Input } from "@chakra-ui/react";
import MiniSearch from "minisearch";
import { useState } from "react";

function SearchBar(props) {
  const { data, setSubdata, children, ...otherProps } = props;
  const [searchBarInput, setSearchBarInput] = useState("");

  let miniSearch = new MiniSearch({
    fields: ["assetName", "assetDescription", "assetTags"], // fields to index for full-text search // fields to return with search results,
  });
  miniSearch.addAll(data);
  const performSearch = () => {
    if (searchBarInput != "") {
      const searchResults = miniSearch.search(searchBarInput);
      console.log("search results : " + JSON.stringify(searchResults));
      setSubdata(searchResults);
    } else {
      setSubdata(data);
    }
  };
  return (
    <Box {...otherProps}>
      <Flex flexDirection="row" mt="15" mb="10" height="100%">
        <Input
          ml="10"
          width="85%"
          rounded="none"
          value={searchBarInput}
          onChange={(e) => setSearchBarInput(e.target.value)}
          height="100%"
        />
        <Button
          onClick={performSearch}
          ml="10px"
          width="100px"
          height="100%"
          rounded="none"
          backgroundColor="gray.100"
          _hover={{
            backgroundColor: "mustard.100",
          }}
        >
          Search
        </Button>
        {children}
      </Flex>
    </Box>
  );
}

export default SearchBar;
