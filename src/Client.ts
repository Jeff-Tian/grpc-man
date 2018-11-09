import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';
import Constructable = jest.Constructable;

function getPackageDefinition(protoPath: string): any {
  const proto = protoLoader.loadSync(protoPath, {
    defaults: true,
    enums: String,
    keepCase: true,
    longs: String,
    oneofs: true,
  });

  return grpc.loadPackageDefinition(proto);
}

function createClientService(endpoint: string, protoPath: string, packageName: string, service: string): any {
  const packageDefinition = getPackageDefinition(protoPath);
  console.log(JSON.stringify(packageDefinition));

  const parts = packageName.split('.');

  if (packageDefinition[parts[0]]) {
    const pack = packageDefinition[parts[0]][parts[1]];

    if (pack) {
      const theCli = new pack[service](endpoint, grpc.credentials.createInsecure());

      return theCli;
    }
  }

  return null;
}

export default class Client {
  public static connect(endpoint: string, protoPath: string, packageName: string, service: string) {
    return createClientService(endpoint, protoPath, packageName, service);
  }

  private readonly endpoint: string;
  private readonly packDef: any;

  constructor(endpoint: string, protoPath: string) {
    this.endpoint = endpoint;

    this.packDef = getPackageDefinition(protoPath);
  }

  public getService(service: string) {
    const parts = service.split('.');
    let s = this.packDef[parts[0]];
    for (let i = 1; i < parts.length; i++) {
      s = s[parts[i]];
    }

    return new s(this.endpoint, grpc.credentials.createInsecure());
  }
}
