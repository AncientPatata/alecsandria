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
  Alert,
  AlertIcon,
  Skeleton,
  Text,
} from "@chakra-ui/react";

import { Controller, useForm } from "react-hook-form";
import { createAsset, getEngines } from "lib/asset";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Engine } from "@prisma/client";

function QueryResponse(props) {
  console.log(props);
  return (
    <Box height="45px" width="100%" mt="15px" mb="15px">
      {props.submitting ? (
        props.isLoading ? (
          <Skeleton width="100%" height="100%" />
        ) : props.isError ? (
          <Alert status="error">
            <AlertIcon />
            {"Failed to add asset, try again : " + props.error}
          </Alert>
        ) : (
          <Alert status="success">
            <AlertIcon /> Created new asset{" "}
          </Alert>
        )
      ) : (
        <></>
      )}
    </Box>
  );
}

//@ts-ignore
function NewAssetForm(props) {
  const { onClose, ...otherProps } = props;
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm();

  const queryClient = useQueryClient();

  const [submitting, setSubmitting] = useState(false);

  // Mutations
  const mutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  const {
    isLoading,
    error,
    data: engines,
    refetch,
  } = useQuery({
    queryKey: ["engines"],
    queryFn: getEngines,
  });

  // @ts-ignore
  const onSubmit = (data) => {
    // @ts-ignore
    console.log(data);
    console.log(data.assetTags);
    mutation.mutate({
      assetName: data.assetName,
      assetEngine: data.assetEngine,
      assetDescription: data.assetDescription,
      assetTags: data.assetTags,
      assetPreviews: data.assetPreviews
        .split("\n")
        .filter((elem) => elem.length > 5),
      assetDownloads: {},
    });
    setSubmitting(true);
  };

  let watchAssetEngine = watch("assetEngine", null);

  if (isLoading) {
    return (
      <Box>
        <Skeleton width="100%" height="60px" />
      </Box>
    );
  }

  return (
    <Box {...otherProps}>
      <form id="new-asset-form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl marginTop="15px">
          <FormLabel>Asset Name</FormLabel>
          <Input {...register("assetName", { required: true })} />
        </FormControl>
        {errors.assetName && errors.assetName.type === "required" && (
          <Text color="red.200">This is required</Text>
        )}
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
                  value={field.value ? field.value : ""}
                  placeholder="Choose an engine"
                />
                <AutoCompleteList>
                  {engines
                    .map((engine: Engine) => engine.assetEngine)
                    .map((option, oid) => (
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
        {errors.assetEngine && errors.assetEngine.type === "required" && (
          <Text color="red.200">This is required</Text>
        )}
        <FormControl marginTop="15px">
          <FormLabel>Asset Description</FormLabel>

          <Textarea
            placeholder="Asset description supports Markdown. Make sure to also add the link to the asset."
            {...register("assetDescription", { required: true })}
            height="500px"
          />
        </FormControl>
        {errors.assetDescription &&
          errors.assetDescription.type === "required" && (
            <Text color="red.200">This is required</Text>
          )}
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
                  {engines
                    ?.find((el) => el.assetEngine === watchAssetEngine)
                    ?.engineAssetTags?.map((tag) => (
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
        {errors.assetTags && errors.assetTags.type === "required" && (
          <Text color="red.200">This is required</Text>
        )}
        <FormControl marginTop="15px">
          <FormLabel>Asset Previews</FormLabel>
          <Textarea
            placeholder="one item per line"
            {...register("assetPreviews", { required: true })}
          />
        </FormControl>
        {errors.assetPreviews && errors.assetPreviews.type === "required" && (
          <Text color="red.200">This is required</Text>
        )}
      </form>
      <QueryResponse
        submitting={submitting}
        isLoading={mutation.isLoading}
        isError={mutation.isError}
        error={mutation.error}
      />
    </Box>
  );
}

// @ts-ignore
function NewAssetModal(props) {
  const { isOpen, onClose, ...otherProps } = props;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} {...otherProps}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="opensans">Add new asset</ModalHeader>
          <ModalCloseButton />
          <Box
            paddingRight="30px"
            paddingLeft="30px"
            paddingBottom="20px"
            width="100%"
            height="100%"
            fontFamily="opensans"
          >
            <NewAssetForm onCLose={onClose} />
          </Box>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              type="submit"
              form="new-asset-form"
              fontFamily="opensans"
            >
              Create Asset
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={onClose}
              fontFamily="opensans"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NewAssetModal;
