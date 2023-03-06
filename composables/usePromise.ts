export default <ResultType, ErrorType = Error>(fn: () => Promise<ResultType>) => {
  let promise: Promise<ResultType> | undefined = undefined;
  const error = ref<ErrorType | undefined>();
  const result = ref<ResultType | undefined>();
  const inProgress = ref(false);

  const defaultOptions: {
    force?: boolean;
  } = {
    force: false,
  };
  const execute = async (options = defaultOptions) => {
    const { force } = Object.assign({}, defaultOptions, options);
    if (!promise || force) {
      error.value = undefined;
      inProgress.value = true;
      promise = fn();
    }

    try {
      result.value = await promise;
    } catch (e) {
      error.value = e as unknown as ErrorType;
    } finally {
      inProgress.value = false;
    }
  };

  return {
    error,
    result,
    inProgress,
    execute,
  };
};