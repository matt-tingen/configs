const exec = require('./exec');
const color = require('./color');

const vpnStatus = async () => {
  const ip = process.env.PROMPT_VPN_IP;

  if (!ip) return null;

  const netstat = await exec('netstat -rn');
  const connected = netstat.includes(ip);

  return connected ? null : color('red')('×VPN ');
};

module.exports = vpnStatus;
