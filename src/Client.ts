import * as grpc from 'grpc';
import getPackageDefinition from './getPackageDefinition';
import deprecated from './helpers/deprecated';
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
    // tslint:disable-next-line
    return createClientService(endpoint, protoPath, packageName, service);
  }
  public readonly grpc: any;

  private readonly endpoint: string;

  /**
   * @deprecated, will be deleted in the future
   */
  private readonly packDef: any;

  constructor(endpoint: string, protoPath: string) {
    this.endpoint = endpoint;

    // tslint:disable-next-line
    this.packDef = getPackageDefinition.call(this, protoPath);
    this.grpc = getPackageDefinition(protoPath);

    traverseTerminalNodes(this.grpc, (ServiceClient, key, parent) => {
      parent[key] = new ServiceClient(this.endpoint, grpc.credentials.createInsecure());

      for (const method in parent[key]) {
        if (
          typeof parent[key][method] === 'function' &&
          (parent[key][method].toString().startsWith('function (path, serialize, deserialize,') &&
            method !== 'makeUnaryRequest')
        ) {
          const original = parent[key][method];

          parent[key][method] = (arg: any) => {
            console.log('calling ', method, ' ...');
            return new Promise((resolve, reject) => {
              original.call(parent[key], arg, (err: any, res: any) => {
                if (err) {
                  console.error(`error for calling ${method}: `, err);
                  if (err.message.startsWith('RPC method not implemented')) {
                    console.error(
                      `这通常是由于 proto 文件里定义的 service 与 rpc 方法并没有对应的源码实现。你也可以检查对应于 proto 文件里定义的 service 或者 rpc 方法的地方，有没有拼写错误。`,
                    );
                  }

                  reject(err);
                } else {
                  console.log(`success for calling ${method}:`, res);
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
    // tslint:disable-next-line
    let s = this.packDef[parts[0]];
    for (let i = 1; i < parts.length; i++) {
      s = s[parts[i]];
    }

    return new s(this.endpoint, grpc.credentials.createInsecure());
  }
}
