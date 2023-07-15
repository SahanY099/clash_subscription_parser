module.exports.parse = async (
  raw,
  { axios, yaml, notify, console },
  { name, url, interval, selected }
) => {
  const config = yaml.parse(raw);

  let headersList = {
    Accept: "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  let bodyContent =
    "api_dev_key=<api-dev-key>&api_option=paste&api_user_key=<api-user-key>&api_paste_code=" +
    config;

  let reqOptions = {
    url: "https://pastebin.com/api/api_post.php",
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };
  await axios.request(reqOptions);

  return yaml.stringify(config);
};
