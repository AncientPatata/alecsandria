import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";

import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

import { Controller, useForm } from "react-hook-form";
import { assetTags, createAsset, engines } from "lib/asset";

//@ts-ignore
function NewAssetForm(props) {
  const { onClose, ...otherProps } = props;
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const watchAssetEngine = watch("assetEngine", engines[0]);
  // @ts-ignore
  const onSubmit = (data) => {
    // @ts-ignore
    console.log(data);
    console.log(data.assetTags);
    createAsset({
      assetName: data.assetName,
      assetEngine: data.assetEngine,
      assetDescription: data.assetDescription,
      assetTags: data.assetTags,
      assetPreviews: data.assetPreviews
        .split("\n")
        .filter((elem) => elem.length > 5),
      assetDownloads: {},
    });
  };

  return (
    <Box {...otherProps}>
      <form id="new-asset-form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl marginTop="15px">
          <FormLabel>Asset Name</FormLabel>
          <Input {...register("assetName", { required: true })} />
        </FormControl>
        <FormControl marginTop="15px">
          <FormLabel>Asset Engine</FormLabel>
          <Controller
            control={control}
            name="assetEngine"
            render={({ field }) => (
              <AutoComplete
                onChange={(value) => value && field.onChange(value)}
              >
                <AutoCompleteInput
                  variant="outline"
                  onChange={field.onChange}
                  value={field.value ? field.value : engines[0]}
                  placeholder="Choose an engine"
                />
                <AutoCompleteList>
                  {engines.map((option, oid) => (
                    <AutoCompleteItem
                      key={`option-${oid}`}
                      value={option}
                      textTransform="capitalize"
                    >
                      {option}
                    </AutoCompleteItem>
                  ))}
                </AutoCompleteList>
              </AutoComplete>
            )}
          />
        </FormControl>
        <FormControl marginTop="15px">
          <FormLabel>Asset Description</FormLabel>
          <Textarea {...register("assetDescription", { required: true })} />
        </FormControl>
        <FormControl marginTop="15px">
          <FormLabel>Asset Tags</FormLabel>
          <Controller
            control={control}
            name="assetTags"
            render={({ field }) => (
              <AutoComplete
                openOnFocus
                multiple
                onChange={(value) => value && field.onChange(value)}
              >
                <AutoCompleteInput
                  variant="outline"
                  onChange={field.onChange}
                  value={field.value ? field.value : ""}
                >
                  {({ tags }) => {
                    return tags.map((tag, tid) => (
                      <AutoCompleteTag
                        key={tid}
                        label={tag.label}
                        onRemove={tag.onRemove}
                      />
                    ));
                  }}
                </AutoCompleteInput>
                <AutoCompleteList>
                  {(assetTags[watchAssetEngine]
                    ? assetTags[watchAssetEngine]
                    : ["Choose engine"]
                  ).map((tag) => (
                    <AutoCompleteItem
                      key={`option-${tag}`}
                      value={tag}
                      textTransform="capitalize"
                      _selected={{ bg: "whiteAlpha.50" }}
                      _focus={{ bg: "whiteAlpha.100" }}
                    >
                      {tag}
                    </AutoCompleteItem>
                  ))}
                </AutoCompleteList>
              </AutoComplete>
            )}
          />
        </FormControl>
        <FormControl marginTop="15px">
          <FormLabel>Asset Previews</FormLabel>
          <Textarea
            placeholder="one item per line"
            {...register("assetPreviews", { required: true })}
          />
        </FormControl>
      </form>
    </Box>
  );
}

// @ts-ignore
function NewAssetModal(props) {
  const { isOpen, onClose, ...otherProps } = props;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new asset</ModalHeader>
          <ModalCloseButton />
          <Box
            paddingRight="30px"
            paddingLeft="30px"
            paddingBottom="20px"
            width="100%"
            height="100%"
          >
            <NewAssetForm onCLose={onClose} />
          </Box>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              type="submit"
              form="new-asset-form"
            >
              Create Asset
            </Button>
            <Button colorScheme="red" variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NewAssetModal;
