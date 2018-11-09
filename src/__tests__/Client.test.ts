import Client from '../Client';
import asyncCall from '../AsyncCall';

require('./helper/mock-server');

test('Client version 1 (tobe deleted in the future)', async () => {
  expect(Client).toBeDefined();

  const client = Client.connect(
    '0.0.0.0:8899',
    __dirname + '/./proto/helloworld.test.proto',
    'helloworld.test',
    'Greeter',
  );

  expect(client).toBeDefined();

  const res = await asyncCall(client.sayHello, client)({ name: 'your name' });
  expect(res).toBeDefined();
  expect(res).toEqual({ message: 'Hello your name' });
});

test('Client version 2', async () => {
  const client2 = new Client('0.0.0.0:8899', __dirname + '/./proto/helloworld.test.proto');
  let service = client2.getService('helloworld.test.Greeter');
  expect(service).toBeDefined();
  expect(service.sayHello).toBeDefined();
  expect(await asyncCall(service.sayHello, service)({ name: 'name' })).toEqual({ message: 'Hello name' });

  const client = new Client('0.0.0.0:8899', __dirname + '/./proto/helloworld.proto');
  service = client.getService('helloworld.Greeter');
  expect(await asyncCall(service.sayHello, service)({ name: 'name' })).toEqual({ message: 'Hello name' });
});
