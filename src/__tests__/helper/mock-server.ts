import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = __dirname + '/../proto/hello.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

let helloProto: any = grpc.loadPackageDefinition(packageDefinition).helloworld;
helloProto = helloProto.test;

function sayHello(call: any, callback: any) {
  callback(null, { message: 'Hello ' + call.request.name });
}

function main() {
  const server = new grpc.Server();
  server.addService(helloProto.Greeter.service, { sayHello: sayHello });
  server.bind('0.0.0.0:8899', grpc.ServerCredentials.createInsecure());

  server.start();
}

main();
