import { ref, watch } from "vue";

export type SearchHit = { id: string; transactionHash: string; receivedAt: Date; amount: string; from: string };

import type { OrdersInstance } from "@/db";

import { searchService } from "@/db";
import { formatMoney } from "@/utils/formatters";
import logger from "@/utils/logger";

export default (initialState: { text: string } = { text: "" }) => {
  const pending = ref(false);
  const collection = ref<SearchHit[]>([]);
  const text = ref(initialState.text);

  watch(text, () => {
    search();
  });

  const search = async () => {
    pending.value = true;

    try {
      if (text.value?.length) {
        collection.value = (await searchService.search(text.value, 25)).map((item: OrdersInstance) => ({
          id: item.orderId,
          transactionHash: item.transactionHash,
          from: item.from,
          amount: formatMoney(item.amount),
          receivedAt: new Date(item.receivedAt),
        }));
      } else {
        collection.value = [];
      }
    } catch (e: unknown) {
      logger.error(e);
      collection.value = [];
    } finally {
      pending.value = false;
    }
  };

  return {
    text,
    collection,
    search,
    pending,
  };
};
