import { spawn } from 'child_process';
import { Readable } from 'stream';

export interface IPFSAddResult {
  cid: string;
  size: number;
}

/**
 * Upload data to IPFS using pipe (no file storage on server)
 * Uses `ipfs add -` to stream directly to IPFS daemon
 */
export function uploadToIPFS(inputStream: Readable): Promise<IPFSAddResult> {
  return new Promise((resolve, reject) => {
    const ipfs = spawn('ipfs', ['add', '-q', '--pin=true']);
    
    let stdout = '';
    let stderr = '';

    ipfs.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    ipfs.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    ipfs.on('error', (err) => {
      reject(new Error(`Failed to spawn IPFS process: ${err.message}`));
    });

    ipfs.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`IPFS add failed with code ${code}: ${stderr}`));
        return;
      }

      const cid = stdout.trim();
      if (!cid) {
        reject(new Error('No CID returned from IPFS'));
        return;
      }

      resolve({
        cid,
        size: 0, // Size will be tracked separately
      });
    });

    // Pipe the input stream directly to IPFS stdin
    inputStream.pipe(ipfs.stdin);

    inputStream.on('error', (err) => {
      ipfs.stdin.destroy();
      reject(new Error(`Input stream error: ${err.message}`));
    });
  });
}

/**
 * Get content from IPFS
 */
export function getFromIPFS(cid: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const ipfs = spawn('ipfs', ['cat', cid]);
    
    const chunks: Buffer[] = [];
    
    ipfs.stdout.on('data', (data: Buffer) => {
      chunks.push(data);
    });

    ipfs.stderr.on('data', (data: Buffer) => {
      // Log but don't fail on stderr
      console.error('IPFS stderr:', data.toString());
    });

    ipfs.on('error', (err) => {
      reject(new Error(`Failed to spawn IPFS process: ${err.message}`));
    });

    ipfs.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`IPFS cat failed with code ${code}`));
        return;
      }

      resolve(Buffer.concat(chunks));
    });
  });
}

/**
 * Stream content from IPFS (for large files)
 */
export function streamFromIPFS(cid: string): Readable {
  const ipfs = spawn('ipfs', ['cat', cid]);
  
  ipfs.stderr.on('data', (data: Buffer) => {
    console.error('IPFS stderr:', data.toString());
  });

  ipfs.on('error', (err) => {
    console.error('IPFS process error:', err);
  });

  return ipfs.stdout;
}

/**
 * Check if IPFS daemon is running
 */
export async function checkIPFSConnection(): Promise<boolean> {
  return new Promise((resolve) => {
    const ipfs = spawn('ipfs', ['id']);
    
    ipfs.on('close', (code) => {
      resolve(code === 0);
    });

    ipfs.on('error', () => {
      resolve(false);
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      ipfs.kill();
      resolve(false);
    }, 5000);
  });
}

/**
 * Pin content to ensure it persists
 */
export function pinContent(cid: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ipfs = spawn('ipfs', ['pin', 'add', cid]);
    
    ipfs.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Failed to pin CID: ${cid}`));
        return;
      }
      resolve();
    });

    ipfs.on('error', (err) => {
      reject(err);
    });
  });
}
