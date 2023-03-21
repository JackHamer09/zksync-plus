const defaultOptions: {
  force?: boolean;
} = {
  force: false,
};
type UsePromiseOptions = typeof defaultOptions;

export default <ResultType, ErrorType = Error>(fn: () => Promise<ResultType>) => {
  let promise: Promise<ResultType> | undefined = undefined;
  const result = ref<ResultType | undefined>();
  const inProgress = ref(false);
  const error = ref<ErrorType | undefined>();

  const defaultOptions: {
    force?: boolean;
  } = {
    force: false,
  };
  const execute = async (options?: UsePromiseOptions): Promise<ResultType | undefined> => {
    const { force } = Object.assign({}, defaultOptions, options);
    if (!promise || force) {
      inProgress.value = true;
      error.value = undefined;
      promise = fn();
    }

    try {
      result.value = await promise;
    } catch (e) {
      error.value = e as unknown as ErrorType;
      promise = undefined;
      throw e;
    } finally {
      inProgress.value = false;
    }
    return result.value;
  };

  const clear = () => {
    promise = undefined;
    error.value = undefined;
    result.value = undefined;
    inProgress.value = false;
  };

  return {
    error,
    result,
    inProgress,
    execute,
    clear,
  };
};
