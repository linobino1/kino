function isBrowser() {
  return typeof window !== "undefined";
}

function environment(): NodeJS.ProcessEnv | WindowENV {
  return isBrowser() ? window.env : process.env;
}

export default environment;
