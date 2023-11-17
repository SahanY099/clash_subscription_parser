module.exports.parse = async (raw, { yaml }) => {
  let config = yaml.parse(raw);

  for (let i = config.proxies.length - 1; i >= 0; i--) {
    const proxy = config.proxies[i];

    // remove proxies with invalid ports
    if (isNaN(proxy.port)) {
      config.proxies.splice(i, 1);
    }

    if (proxy.type == "ss") {
      // removes ss proxies
      config.proxies.splice(i, 1);
    }
    // add sni's to proxies
    if (proxy.type == "trojan") {
      proxy.sni = "zoom.us";
    }

    if (proxy.type == "ssr") {
      Object.defineProperty(
        proxy,
        "protocol-param",
        Object.getOwnPropertyDescriptor(proxy, "protoparam")
      );
      delete proxy["protoparam"];

      delete proxy["obfsparam"];
      delete proxy["group"];

      proxy["obfs-param"] = "zoom.us";
    }

    if (proxy.type == "vmess") {
      proxy.servername = "zoom.us";
      if (!proxy.tls) config.proxies.splice(i, 1);
    }

    if (proxy["ws-headers"]) {
      Object.defineProperty(
        proxy,
        "ws-opts",
        Object.getOwnPropertyDescriptor(proxy, "ws-headers")
      );
      delete proxy["ws-headers"];
    }

    if (proxy["ws-opts"]) {
      proxy["ws-opts"]["headers"] = {
        Host: "zoom.us",
      };
    }

    if (proxy["ws-path"]) {
      proxy["network"] = "ws";
      if (proxy["ws-opts"]) proxy["ws-opts"]["path"] = proxy["ws-path"];
      else {
        proxy["ws-opts"] = {};
        proxy["ws-opts"]["path"] = proxy["ws-path"];
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
