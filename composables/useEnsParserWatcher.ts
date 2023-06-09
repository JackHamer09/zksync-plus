import { watch } from "vue";

import type { FetchEnsAddressResult } from "@wagmi/core";
import type { Ref } from "vue";

export default (
  search: Ref<string>,
  ensAddress: Ref<FetchEnsAddressResult | undefined>,
  parseEns: () => Promise<FetchEnsAddressResult | undefined>
) => {
  watch(search, async (newValue) => {
    ensAddress.value = undefined;
    if (newValue.endsWith(".eth")) {
      await parseEns();
    }
  });
};
