#! /usr/bin/env node

import readline from 'readline';
import { asyncCallResultHandler } from './AsyncCall';
import Client from './Client';
import { Greeter } from './Greeter';
import Composer from './helpers/composer';
import GrpcHealthCheckHelper from 'grpc-health/dist/health/health.helper';

const [exe, exeFilePath, endpoint, protoFilePath = GrpcHealthCheckHelper.getHealthCheckProtoPath()] = process.argv;

Greeter(exe, exeFilePath, endpoint, protoFilePath);

export const client = new Client(endpoint, protoFilePath);

if (client === null) {
  console.error(`Failed to connect to ${endpoint} or find proto ${protoFilePath}`);
  process.exit(1);
}

if (require.main === module) {
  process.nextTick(async () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const input: string = await asyncCallResultHandler(rl.question, rl)(
      `Input method name and parameters, for example: package.Service.get {"arg1": "value1"}
Enter with empty input will do health check: grpc.health.v1.Health.check {} 
>>>: `,
    );
    const parts = input.split(' ');
    const args = parts[1] ? JSON.parse(parts[1]) : {};

    const methodString = parts[0] || 'grpc.health.v1.Health.check';

    console.log('will call method: ', methodString, ' with args: ', args);
    const method = Composer.composeMethod(client.grpc, methodString);
    const res = await method(args);
    console.log(res);
  });
}

export default Client;
