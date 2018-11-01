import * as readline from 'readline';
import asyncCall, { asyncCallResultHandler } from './AsyncCall';
import Client from './Client';
import { Greeter } from './Greeter';

const [exe, exeFilePath, endpoint, protoFilePath, packageName, service] = process.argv;

Greeter(exe, exeFilePath, endpoint, protoFilePath);

const client = Client.connect(endpoint, protoFilePath, packageName, service);

if (client === null) {
  console.error(`Failed to connect to ${endpoint} or find service ${service}`);
  process.exit(1);
}

process.nextTick(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const input: string = await asyncCallResultHandler(rl.question, rl)('Input method name and parameters, for example: get {"arg1": "value1"} >>>: ');
  const parts = input.split(' ');
  const args = parts[1] ? JSON.parse(parts[1]) : {};
  console.log('will call method: ', service, '.', parts[0], ' with args: ', args);
  const res = await asyncCall(client[parts[0]], client)(args);
  console.log(res);
});
