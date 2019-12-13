import Client from '../Client';
import asyncCall from '../AsyncCall';
import * as grpc from 'grpc';

let server: grpc.Server;
beforeAll(() => {
  server = require('./helper/mock-server');
  return server;
});

afterAll(() => {
  server.forceShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  process.stdout.write(`createClientService: ${reason.toString()}`);
});

test('Client version 1.0.0 (to be deleted in the future)', async () => {
  expect(Client).toBeDefined();

  let protoPath = __dirname + '/./proto/helloworld.test.proto';
  console.log('protoPath = ', protoPath);

  const client = Client.connect(
    '127.0.0.1:8899',
    protoPath,
    'helloworld.test',
    'Greeter',
  );

  expect(client).toBeDefined();

  const res = await asyncCall(client.sayHello, client)({ name: 'your name' });
  expect(res).toBeDefined();
  expect(res).toEqual({ message: 'Hello your name' });

  console.log('test 1 done.');
});

test('Client version 1.1.0 (to be deleted in the future)', async () => {
  try {
    const client2 = new Client('127.0.0.1:8899', __dirname + '/./proto/helloworld.test.proto');
    let service = client2.getService('helloworld.test.Greeter');
    expect(service).toBeDefined();
    expect(service.sayHello).toBeDefined();
    expect(await asyncCall(service.sayHello, service)({ name: 'name' })).toEqual({ message: 'Hello name' });

    const client = new Client('127.0.0.1:8899', __dirname + '/./proto/helloworld.proto');
    service = client.getService('helloworld.Greeter');
    expect(await asyncCall(service.sayHello, service)({ name: 'name' })).toEqual({ message: 'Hello name' });
  } catch (ex) {
    process.exit(1);
  } finally {
    console.log('test 2 done.');
  }
});

test('Client version 1.2.0, embed the async Call', async () => {
  try {
    const client3 = new Client('127.0.0.1:8899', __dirname + '/./proto/helloworld.test.proto');
    expect(client3).toBeDefined();
    expect(client3.grpc.helloworld).toBeDefined();
    expect(typeof client3.grpc).toEqual('object');
    expect(typeof client3.grpc.helloworld).toEqual('object');
    expect(typeof client3.grpc.helloworld.test).toEqual('object');
    expect(client3.grpc.helloworld.test.Greeter).toBeDefined();
    expect(client3.grpc.helloworld.test.Greeter.sayHello).toBeDefined();
    expect(await client3.grpc.helloworld.test.Greeter.sayHello({ name: 'fff' })).toEqual({
      message: 'Hello fff',
    });
    expect(
      await client3.grpc.helloworld.test.Greeter.echoTime({
        timestamp: {
          seconds: 1557992462,
          nanos: 5678,
        },
      }),
    ).toEqual({
      timestamp: { seconds: '1557992462', nanos: 5678 },
    });

    try {
      client3.grpc.helloworld.test.Greeter.timeout(
        {
          name: 'timeout',
        },
        {
          deadline: new Date().getTime() + 500,
        },
      );
    } catch (ex) {
      expect(ex).toMatch(/Deadline Exceeded/);
    }
  } catch (ex) {
    console.error(ex);
  } finally {
    console.log('test 3 done.');
  }
});
