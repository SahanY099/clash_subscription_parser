module.exports.parse = async (
  raw,
  { axios, yaml, notify, console },
  { name, url, interval, selected }
) => {
  let config = JSON.parse(raw);
  const newConfig = {
    proxies: [],
    other: [],
    names: [],
  };

  for (let i = config.length - 1; i >= 0; i--) {
    const proxy = config[i];

    let isProxyAlreadyExists = false;
    for (let existingProxy of newConfig.proxies) {
      if (existingProxy.name == proxy["remarks"]) {
        isProxyAlreadyExists = true;
        break;
      }
    }

    const newProxy = {
      name: proxy["remarks"],
      server: proxy["server"],
      port: proxy["server_port"],
      password: proxy["password"],
      type: "ss",
      "skip-cert-verity": true,
      cipher: proxy["method"],
      plugin: "obfs",
      "plugin-opts": {
        mode: "tls",
        host: "zoom.us",
      },
    };

    if (!isProxyAlreadyExists) {
      newConfig.proxies.push(newProxy);
    }
  }
  config.rules = [];

  return yaml.stringify(newConfig);
};
