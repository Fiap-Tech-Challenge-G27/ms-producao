function toBeJSONStringifiable(content) {
  try {
    JSON.stringify(content);
  } catch (exception) {
    return {
      message: () => `Is not Stringifiable:\n${exception}`,
      pass: false,
    };
  }

  return {
    message: () => `Is Stringifiable`,
    pass: true,
  };
}

expect.extend({ toBeJSONStringifiable });

declare namespace jest {
  interface Matchers<R> {
    toBeJSONStringifiable(): R;
  }
}
