import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';

function createClientService(endpoint: string, protoPath: string, packageName: string, service: string): any {

  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const p: any = grpc.loadPackageDefinition(packageDefinition);

  const parts = packageName.split('.');

  if (p[parts[0]]) {
    const pack = p[parts[0]][parts[1]];

    if (pack) {
      return new pack[service](endpoint, grpc.credentials.createInsecure());
    }
  }

  return null;
}

export default class Client {
  static connect(endpoint: string, protoPath: string, packageName: string, service: string) {
    return createClientService(endpoint, protoPath, packageName, service);
  }
}
