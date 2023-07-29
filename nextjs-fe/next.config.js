module.exports = {
  // distDir: "build",
  reactStrictMode: true,
  serverRuntimeConfig: {
    secret: "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING",
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  // output: "standalone",
};
