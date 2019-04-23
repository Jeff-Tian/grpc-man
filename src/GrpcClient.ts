import getPackageDefinition from './getPackageDefinition';

export default class GrpcClient {
  constructor(endpoint: string, protoPath: string) {
    const packDef: any = getPackageDefinition(protoPath);

    return packDef;
  }
}
