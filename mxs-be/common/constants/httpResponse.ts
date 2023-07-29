export const ResponseStruct = {
  responseStruct(
    status: number,
    payload: any,
    message?: string | undefined | null,
    error?: string | undefined | null
  ) {
    return {
      status,
      payload,
      message,
      error,
    };
  },
};
