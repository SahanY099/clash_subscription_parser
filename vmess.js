module.exports.parse = async (
  raw,
  { axios, yaml, notify, console },
  { name, url, interval, selected }
) => {
  let config = yaml.parse(raw);
  const ssProxyNames = [];

  for (let i = config.proxies.length - 1; i >= 0; i--) {
    const proxy = config.proxies[i];

    if (proxy.name.includes("198.244.252.93")) {
      proxy.name = "H " + proxy.name;
    }

    if (proxy.type == "ss") {
      // removes ss proxies
      ssProxyNames.push(proxy.name);
      config.proxies.splice(i, 1);
    } else {
      // add sni's to proxies
      if (proxy.type == "trojan") {
        proxy.sni = "zoom.us";
      }

      if (proxy.type == "vmess") {
        proxy.servername = "zoom.us";
        proxy.tls = true;
      }

      if (proxy["ws-opts"]) {
        proxy["ws-opts"]["headers"] = {
          Host: "zoom.us",
        };
      }
    }
  }

  config["proxy-groups"] = [];
  config.rules = [];

  return yaml.stringify(config);
};
