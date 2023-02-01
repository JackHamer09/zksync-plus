import { ref } from "vue";

import { db, type OrdersInstance } from "@/db";

export default () => {
  const orders = ref<OrdersInstance[] | []>([]);
  const pending = ref(false);

  const getOrders = async () => {
    pending.value = true;
    if (db.transactions) {
      orders.value = await db.transactions.orderBy("receivedAt").reverse().toArray();
      pending.value = false;
    }
  };

  return {
    orders,
    pending,
    getOrders,
  };
};
