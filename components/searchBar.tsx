import { Box, Button, Flex, Input } from "@chakra-ui/react";
import MiniSearch from "minisearch";
import { useState } from "react";

function SearchBar(props) {
  const { data, setSubdata, ...otherProps } = props;
  const [searchBarInput, setSearchBarInput] = useState("");

  let miniSearch = new MiniSearch({
    fields: ["assetName", "assetDescription", "assetTags"], // fields to index for full-text search // fields to return with search results,
  });
  miniSearch.addAll(data);
  const performSearch = () => {
    const searchResults = miniSearch.search(searchBarInput);
    console.log("search results : " + JSON.stringify(searchResults));
    setSubdata(searchResults);
  };
  return (
    <Box {...otherProps}>
      <Flex flexDirection="row" mt="15" mb="10">
        <Input
          ml="10"
          width="85%"
          value={searchBarInput}
          onChange={(e) => setSearchBarInput(e.target.value)}
        />
        <Button width="15%" onClick={performSearch} mr="10" ml="10">
          Search
        </Button>
      </Flex>
    </Box>
  );
}

export default SearchBar;
