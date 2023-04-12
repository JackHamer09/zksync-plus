import { ref, watch } from "vue";

export default <ResultType>(fn: () => Promise<ResultType>, delay: number) => {
  let interval: NodeJS.Timer | undefined = undefined;
  const currentDelay = ref(delay);

  function start() {
    stop();
    interval = setInterval(fn, currentDelay.value);
  }

  function stop() {
    clearInterval(interval);
    interval = undefined;
  }

  function resume() {
    stop();
    start();
  }

  watch(currentDelay, (newDelay) => {
    currentDelay.value = newDelay;
    if (interval) {
      resume();
    }
  });

  start();

  return {
    stop,
    resume,
  };
};
