import { sleep } from '@jeff-tian/sleep';
import { spawn, spawnSync } from 'child_process';
import { join } from 'path';
import Client from '../Client';

jest.setTimeout(10000);
const httpPort = 3003;

const testWithHealthCheckGrpcRunning = (asyncTesting: () => Promise<void>) => async () => {
  const childProcess = spawn('node', ['node_modules/grpc-health/dist/main.js'], {
    detached: true, // Trick: detached set to true to allow later kill -pid works
    env: { ...process.env, HTTP_PORT: httpPort.toString(), BIND_ADDRESS: '0.0.0.0:8888' },
    stdio: 'pipe',
  });

  childProcess.stderr.on('data', data => console.error(data.toString()));

  let { output }: { output: string[] | null } = { output: null };
  let count = 0;

  while (!output || output!.filter(o => o && o.trim().length > 0).length === 0) {
    console.log('waiting to start testing... ', count++);
    await sleep(1);
    output = spawnSync('lsof', [`-i:${8888}`], { encoding: 'utf8' }).output;
  }

  console.log('output = ', output.join('\n'));
  console.log('started testing with ', childProcess.pid);
  await sleep(2);

  await asyncTesting();

  // Trick: -pid is to kill all sub processes that created by nest
  // to prevent the error: Some handles are still open to prevent
  // Jest to quit
  // https://azimi.me/2014/12/31/kill-child_process-node-js.html
  try {
    process.kill(-childProcess.pid);
    await sleep(1);
  } catch (ex) {
    console.error(ex);
  }
};

describe.skip('Health Check with proto path', () => {
  test(
    'Health Check',
    testWithHealthCheckGrpcRunning(async () => {
      expect(Client).toBeDefined();

      const client = new Client(
        '127.0.0.1:8888',
        join(__dirname, '../../node_modules/grpc-health/src/health/health.proto'),
      );

      expect(await client.grpc.grpc.health.v1.Health.check({ service: 'whatever' })).toStrictEqual({
        status: 'SERVING',
      });
    }),
  );
});

describe.skip('Health Check without proto path', () => {
  test(
    'Health Check with only host and port specified',
    testWithHealthCheckGrpcRunning(async () => {
      expect(Client).toBeDefined();

      const client = new Client('127.0.0.1:8888');

      expect(await client.grpc.grpc.health.v1.Health.check({ service: 'omitProtoPath' })).toStrictEqual({
        status: 'SERVING',
      });
    }),
  );
});
