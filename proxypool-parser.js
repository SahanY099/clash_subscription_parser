module.exports.parse = async (
  raw,
  { axios, yaml, notify, console },
  { name, url, interval, selected }
) => {
  let config = yaml.parse(raw);
  const host = "zoom.us";

  for (let i = config.proxies.length - 1; i >= 0; i--) {
    const proxy = config.proxies[i];

    if (proxy.name.includes("198.244.252.93")) {
      proxy.name = "H " + proxy.name;
    }

    if (!proxy.name) {
      proxy.name = `${proxy.server} - ${i}`;
    }

    // remove proxies with invalid ports
    if (isNaN(proxy.port)) {
      config.proxies.splice(i, 1);
    }

    if (proxy.type == "ss") config.proxies.splice(i, 1);
    if (proxy.type == "hysteria") config.proxies.splice(i, 1);
    if (proxy.type == "hysteria2") config.proxies.splice(i, 1);
    if (proxy.type == "ssr") config.proxies.splice(i, 1);

    // add sni's to proxies
    if (proxy.type == "trojan") {
      proxy.sni = host;
    }

    if (proxy.type == "vmess") {
      proxy.servername = host;

      if (!proxy.tls) config.proxies.splice(i, 1);
    }

    if (proxy["ws-opts"]) {
      proxy["ws-opts"]["headers"] = {
        Host: host,
      };
    }
  }

  config["proxy-groups"] = [];
  config.rules = [];

  return yaml.stringify(config);
};
