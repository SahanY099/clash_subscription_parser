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
        proxy["tls"] = true;
        proxy.servername = "zoom.us";
        proxy["ws-opts"] = {
          headers: {
            Host: "zoom.us",
          },
        };
      }
    }
  }

  for (let i = 0; i < config["proxy-groups"].length; i++) {
    const proxyGroup = config["proxy-groups"][i];
    const proxyNames = proxyGroup.proxies;

    // convert proxy group name into english
    proxyGroup.name = replaceChineseWithEnglish(proxyGroup.name);

    if (proxyNames.length > 5) {
      // remove ss proxies references from groups
      for (let j = 0; j < ssProxyNames.length; j++) {
        const ssProxyName = ssProxyNames[j];
        const indexOfProxyName = proxyNames.indexOf(ssProxyName);

        proxyNames.splice(indexOfProxyName, 1);
      }
    }

    // convert proxy names into english
    for (let k = 0; k < proxyNames.length; k++) {
      proxyNames[k] = replaceChineseWithEnglish(proxyNames[k]);
    }
  }

  // convert rules names into english
  for (let i = 0; i < config.rules.length; i++) {
    config.rules[i] = replaceChineseWithEnglish(config.rules[i]);
  }

  return yaml.stringify(config);
};
