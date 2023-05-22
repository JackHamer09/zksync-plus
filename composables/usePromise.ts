const defaultOptions: {
  cache?: number | boolean;
} = {
  cache: true,
};
type UsePromiseOptions = typeof defaultOptions;

const defaultExecuteOptions: {
  force?: boolean;
} = {
  force: false,
};
type UsePromiseExecuteOptions = typeof defaultExecuteOptions;

export default <ResultType, ErrorType = Error>(fn: () => Promise<ResultType>, options?: UsePromiseOptions) => {
  const opts = Object.assign({}, defaultExecuteOptions, options);

  let promise: Promise<ResultType> | undefined = undefined;
  const result = ref<ResultType | undefined>();
  const inProgress = ref(false);
  const error = ref<ErrorType | undefined>();
  let removeCacheTimeout: ReturnType<typeof setTimeout> | undefined;
  const removeCacheTimeoutClear = () => {
    clearTimeout(removeCacheTimeout);
    removeCacheTimeout = undefined;
  };

  const execute = async (options?: UsePromiseExecuteOptions): Promise<ResultType | undefined> => {
    const { force } = Object.assign({}, defaultExecuteOptions, options);
    if (!promise || force) {
      promise = fn();
      removeCacheTimeoutClear();
      inProgress.value = true;
      error.value = undefined;
    }

    let rawResult: ResultType | undefined;
    try {
      rawResult = await promise;
      result.value = rawResult;
    } catch (e) {
      error.value = e as unknown as ErrorType;
      promise = undefined;
      throw e;
    } finally {
      inProgress.value = false;
      if (opts.cache === false) {
        promise = undefined;
      } else if (typeof opts.cache === "number") {
        if (!removeCacheTimeout) {
          removeCacheTimeout = setTimeout(() => {
            promise = undefined;
            removeCacheTimeoutClear();
          }, opts.cache);
        }
      }
    }
    return rawResult;
  };

  const reset = () => {
    promise = undefined;
    error.value = undefined;
    result.value = undefined;
    inProgress.value = false;
    removeCacheTimeoutClear();
  };

  // Reloads the promise if it is already in progress or has already been executed
  const reload = async () => {
    if (promise || inProgress.value || error.value || result.value) {
      reset();
      await execute({ force: true });
    }
  };

  return {
    error,
    result,
    inProgress,
    execute,
    reset,
    reload,
  };
};
