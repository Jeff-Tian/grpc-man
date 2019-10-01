import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = __dirname + '/../proto/helloworld.test.proto';
const PROTO_PATH2 = __dirname + '/../proto/helloworld.proto';
let options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { ...options });
const packageDefinition2 = protoLoader.loadSync(PROTO_PATH2, { ...options });

let helloProto: any = grpc.loadPackageDefinition(packageDefinition).helloworld;
helloProto = helloProto.test;

let helloProto2: any = grpc.loadPackageDefinition(packageDefinition2).helloworld;

function sayHello(call: any, callback: any) {
  callback(null, { message: 'Hello ' + call.request.name });
}

function echoTime(call: any, callback: any) {
  callback(null, { timestamp: call.request.timestamp });
}

function timeOut(call: any, callback: any) {
  setTimeout(() => {
    callback(null, { message: 'Hello ' + call.request.name });
  }, 3000);
}

function main() {
  const server = new grpc.Server();
  server.addService(helloProto.Greeter.service, { sayHello: sayHello, echoTime: echoTime, timeout: timeOut });
  server.addService(helloProto2.Greeter.service, { sayHello: sayHello });
  server.bind('0.0.0.0:8899', grpc.ServerCredentials.createInsecure());

  server.start();
}

main();
