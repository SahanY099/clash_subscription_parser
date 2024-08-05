// Define main function (script entry)

function main(config, profileName) {
  const host = "zoom.us";
  const proxyNames = [];

  for (let i = config.proxies.length - 1; i >= 0; i--) {
    const proxy = config.proxies[i];

    proxyNames.push(proxy.name);

    if (!proxy.name) {
      proxy.name = `${proxy.server} - ${i}`;
    }

    // remove proxies with invalid ports
    if (isNaN(proxy.port)) {
      config.proxies.splice(i, 1);
    }

    if (proxy.type == "ss") config.proxies.splice(i, 1);
    if (proxy.type == "ssr") config.proxies.splice(i, 1);

    if (proxy.uuid && proxy.uuid.length != 36) {
      config.proxies.splice(i, 1);
    }

    // add sni's to proxies
    if (proxy.type == "trojan") {
      proxy.sni = host;

      if (proxy["ws-opts"]) {
        proxy["ws-opts"]["headers"] = {
          Host: host,
        };
      }
    }

    if (proxy.type == "vmess") {
      proxy.servername = host;

      if (!proxy.tls) config.proxies.splice(i, 1);

      proxy["alpn"] = ["http/1.1"];

      if (proxy["ws-opts"]) {
        proxy["ws-opts"]["headers"] = {
          Host: host,
        };
      }
    }

    if (proxy.type == "vless") {
      proxy.servername = host;

      if (!proxy.tls) config.proxies.splice(i, 1);

      if (proxy["ws-opts"]) {
        proxy["ws-opts"]["headers"] = {
          Host: host,
        };
      }
    }

    if (proxy.type == "hysteria2") {
      proxy.sni = host;
    }

    if (proxy.type == "hysteria") {
      proxy.sni = host;
    }

    proxy["skip-cert-verify"] = true;
  }


  config["proxy-groups"] = [];
  config.rules = [];

  return config;
}
