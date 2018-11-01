import { Greeter } from './Greeter';
import Client from './Client';
import asyncCall from './AsyncCall';

const [exe, exeFilePath, endpoint, protoFilePath, packageName, service] = process.argv;

Greeter(exe, exeFilePath, endpoint, protoFilePath);

const client = Client.connect(endpoint, protoFilePath, packageName, service);

if (client === null) {
  console.error(`Failed to connect to ${endpoint} or find service ${service}`);
  process.exit(1);
}

process.nextTick(async () => {
  const res = await asyncCall(client.get, client)({});
  console.log(res);
});
