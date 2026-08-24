import {
  FlashList,
  type FlashListProps,
  type FlashListRef,
} from "@shopify/flash-list";
import React from "react";

export const FlashListContainer = React.forwardRef(function FlashListContainer<
  T,
>(
  { keyboardDismissMode = "on-drag", ...props }: FlashListProps<T>,
  ref: React.ForwardedRef<FlashListRef<T>>,
) {
  return (
    <FlashList keyboardDismissMode={keyboardDismissMode} {...props} ref={ref} />
  );
}) as <T>(
  props: FlashListProps<T> & { ref?: React.Ref<FlashListRef<T>> },
) => React.ReactElement;
