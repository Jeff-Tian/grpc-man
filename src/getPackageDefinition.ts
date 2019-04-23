import * as protoLoader from '@grpc/proto-loader';
import * as grpc from 'grpc';

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

export default getPackageDefinition;
