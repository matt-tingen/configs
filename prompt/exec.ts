import { exec as _exec } from 'node:child_process';
import { promisify } from 'node:util';

const pExec = promisify(_exec);

const MAX_BUFFER = 512 * 1024; // 512kB

const exec = async (command: string, trim = true): Promise<string> => {
  const maybeTrim = (result: string): string => (trim ? result.trim() : result);

  try {
    const { stdout } = await pExec(command, { maxBuffer: MAX_BUFFER });

    return maybeTrim(stdout.toString());
  } catch (error) {
    const stderr = (error as { stderr?: string | Buffer }).stderr;
    const message = typeof stderr === 'string' ? stderr : (stderr?.toString() ?? '');
    throw maybeTrim(message);
  }
};

export default exec;
