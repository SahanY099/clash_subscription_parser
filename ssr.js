module.exports.parse = async (
  raw,
  { axios, yaml, notify, console },
  { name, url, interval, selected }
) => {
  const config = yaml.parse(raw);

  for (let i = config.proxies.length - 1; i >= 0; i--) {
    const proxy = config.proxies[i];

    if (proxy.type == "ssr") proxy["obfs-param"] = "zoom.us";
    else config.proxies.splice(i, 1);
  }

  config["proxy-groups"] = [];
  config["rules"] = [];

  return yaml.stringify(config);
};
