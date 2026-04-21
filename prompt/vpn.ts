import color from './color.ts';
import exec from './exec.ts';

const vpnStatus = async (): Promise<string | null> => {
  const ip = process.env.PROMPT_VPN_IP;

  if (!ip) return null;

  const netstat = await exec('netstat -rn');
  const connected = netstat.includes(ip);

  return connected ? null : color('red')('×VPN ');
};

export default vpnStatus;
