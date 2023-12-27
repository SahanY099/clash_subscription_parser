// update config url list

module.exports.parse = async (
  raw,
  { axios, yaml, notify, console },
  { name, url, interval, selected }
) => {
  // https://raw.githubusercontent.com/soroushmirzaei/telegram-configs-collector/main/subscribe/security/tls
  const raw_config = atob(raw);
  const config = {};

  config["proxy-groups"] = [];
  config["rules"] = [];
  config["res"] = "err";
  await axios
    .get("https://jsonplaceholder.typicode.com/todos/1")
    .then((res) => {
      config["res"] = res.data;
      // print
    })
    .catch((err) => {
      config["res"] = err;
    });

  return yaml.stringify(config);
};
