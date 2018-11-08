import Client from '../Client';
import asyncCall from '../AsyncCall';

require('./helper/mock-server');

test('Client', async () => {
  expect(Client).toBeDefined();

  const client = Client.connect('0.0.0.0:8899', __dirname + '/./proto/hello.proto', 'helloworld.test', 'Greeter');

  expect(client).toBeDefined();

  const res = await asyncCall(client.sayHello, client)({ name: 'your name' });
  expect(res).toBeDefined();
  expect(res).toEqual({ 'message': 'Hello your name' });
});
