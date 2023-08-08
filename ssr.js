module.exports.parse = async (
  raw,
  { axios, yaml, notify, console },
  { name, url, interval, selected }
) => {
  const config = yaml.parse(raw);
  const ssProxyNames = [];

  function replaceChineseWithEnglish(name) {
    const replacements = {
      全球拦截: "Global interception",
      全球直连: "Global direct connection",
      节点选择: "Node selection",
      广告拦截: "Ad blocking",
      运营劫持: "Operational hijacking",
      自动选择: "Automatically choose",
      广告拦截: "Foreign media",
      微软服务: "Microsoft services",
      电报信息: "Telegram message",
      苹果服务: "Apple services",
      漏网之鱼: "Slip through the net",
      国外媒体: "Foreign media",
      国内媒体: "Domestic media",
    };

    for (const keyword in replacements) {
      if (name.includes(keyword)) {
        name = name.replace(keyword, replacements[keyword]);
        break;
      }
    }

    return name;
  }

  for (let i = config.proxies.length - 1; i >= 0; i--) {
    const proxy = config.proxies[i];

    if (proxy.type == "ssr") {
      // proxy["obfs"] = "tls1.2_ticket_auth";
      proxy["obfs-param"] = "zoom.us";
    } else {
      ssProxyNames.push(proxy.name);
      config.proxies.splice(i, 1);
    }

    /* if (
      (proxy.type == "ss") |
      (proxy.type == "vmess") |
      (proxy.type == "trojan")
    ) {
      // removes ss proxies
      ssProxyNames.push(proxy.name);
      config.proxies.splice(i, 1);
    } else {
      if (proxy.type == "ssr") {
        proxy["obfs"] = "tls1.2_ticket_auth";
        proxy["obfs-param"] = "zoom.us";
      }
    } */
  }

  config["proxy-groups"] = [];
  config["rules"] = [];

  return yaml.stringify(config);
};
