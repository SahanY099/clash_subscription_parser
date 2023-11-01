module.exports.parse = async (
  raw,
  { axios, yaml, notify, console },
  { name, url, interval, selected }
) => {
  const config = yaml.parse(raw);
  const ssProxyNames = [];

  for (let i = config.proxies.length - 1; i >= 0; i--) {
    const proxy = config.proxies[i];

    if ((proxy.type == "ssr") | (proxy.type == "ss")) {
      ssProxyNames.push(proxy.name);
      config.proxies.splice(i, 1);
    }

    if (proxy.type == "trojan") {
      proxy.sni = "zoom.us";
      proxy.udp = true;
      proxy["skip-cert-verify"] = true;
      ssProxyNames.push(proxy.name);
      config.proxies.splice(i, 1);
      if (!proxy.name.includes("SG")) {
      }
    }

    if (proxy.type == "vmess") {
      proxy.servername = "zoom.us";
      // proxy.udp = true;
      proxy.tls = true;
      proxy["ws-opts"] = {
        ...proxy["ws-opts"],
        headers: {
          Host: "zoom.us",
        },
      };
      // if (!proxy.name.includes("SG")) {
      if (
        (!proxy.tls & !proxy["skip-cert-verify"]) |
        proxy.name.includes("RELAY")
      ) {
        ssProxyNames.push(proxy.name);
        config.proxies.splice(i, 1);
      }
    }
  }

  config["proxy-groups"] = [];
  config["rules"] = [];

  return yaml.stringify(config);
};
