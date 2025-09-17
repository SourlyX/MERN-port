module.exports = function override(config, env) {
  if (config.devServer) {
    config.devServer.allowedHosts = 'all'; // acepta cualquier host
  }
  return config;
}
