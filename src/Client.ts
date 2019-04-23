import deprecated from './helpers/deprecated';
import getPackageDefinition from './getPackageDefinition';
import * as grpc from 'grpc';
import { traverseTerminalNodes } from './helpers/terminal-node';

/**
 * @deprecated, will be deleted in the future
 * @param endpoint
 * @param protoPath
 * @param packageName
 * @param service
 */
function createClientService(endpoint: string, protoPath: string, packageName: string, service: string): any {
  const packageDefinition = getPackageDefinition(protoPath);
  console.log(JSON.stringify(packageDefinition));

  const parts = packageName.split('.');

  if (packageDefinition[parts[0]]) {
    const pack = packageDefinition[parts[0]][parts[1]];

    if (pack) {
      return new pack[service](endpoint, grpc.credentials.createInsecure());
    }
  }

  return null;
}

export default class Client {
  /**
   * @deprecated, use new(endpoint, protoPath) instead
   * @param endpoint
   * @param protoPath
   * @param packageName
   * @param service
   */
  @deprecated('use new() instead')
  public static connect(endpoint: string, protoPath: string, packageName: string, service: string) {
    return createClientService(endpoint, protoPath, packageName, service);
  }

  private readonly endpoint: string;

  /**
   * @deprecated, will be deleted in the future
   */
  private readonly packDef: any;
  public readonly grpc: any;

  constructor(endpoint: string, protoPath: string) {
    this.endpoint = endpoint;

    this.packDef = getPackageDefinition.call(this, protoPath);
    console.log('packdef = before = ', this.packDef, this);
    this.grpc = getPackageDefinition(protoPath);

    traverseTerminalNodes(this.grpc, (ServiceClient, key, parent) => {
      parent[key] = new ServiceClient(this.endpoint, grpc.credentials.createInsecure());

      for (const method in parent[key]) {
        let protoMethod = parent[key][method];

        if (
          typeof protoMethod === 'function' &&
          (protoMethod.toString().startsWith('function (path, serialize, deserialize,') &&
            method !== 'makeUnaryRequest')
        ) {
          const original = protoMethod;

          parent[key][method] = (arg: any) => {
            return new Promise((resolve, reject) => {
              original.call(parent[key], arg, (err: any, res: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(res);
                }
              });
            });
          };
        }
      }
    });
  }

  /**
   * @deprecated, use grpc's instead
   * @param service
   */
  @deprecated("use grpc's method instead")
  public getService(service: string) {
    const parts = service.split('.');
    let s = this.packDef[parts[0]];
    for (let i = 1; i < parts.length; i++) {
      s = s[parts[i]];
    }

    return new s(this.endpoint, grpc.credentials.createInsecure());
  }
}
