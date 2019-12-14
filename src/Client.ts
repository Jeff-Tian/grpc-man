import fs from 'fs';
import * as grpc from 'grpc';
import path from 'path';
import R from 'ramda';
import getPackageDefinition from './getPackageDefinition';
import deprecated from './helpers/deprecated';
import RpcErrorHinter from './helpers/rpc-error-hinter';
import { traverseServiceClients } from './helpers/terminal-node';

/**
 * @deprecated, will be deleted in the future
 * @param endpoint
 * @param protoPath
 * @param packageName
 * @param service
 */
function createClientService(endpoint: string, protoPath: string, packageName: string, service: string): any {
  const packageDefinition = getPackageDefinition(protoPath);

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

  constructor(
    endpoint: string,
    protoPath: string | undefined = R.head(
      R.filter(
        fs.existsSync,
        R.map(p => path.resolve(__dirname, p), [
          '../node_modules/grpc-health/src/health/health.proto',
          '../../grpc-health/src/health/health.proto',
        ]),
      ),
    ),
  ) {
    if (!protoPath) {
      throw new Error('Parameter protoPath must be provided!');
    }

    if (!fs.existsSync(protoPath)) {
      throw new Error(`File ${protoPath} does not exists!`);
    }

    this.endpoint = endpoint;

    // tslint:disable-next-line
    this.packDef = getPackageDefinition.call(this, protoPath);
    this.grpc = getPackageDefinition(protoPath);

    this.promisifyAllGrpcMethods();
  }

  private promisifyAllGrpcMethods() {
    traverseServiceClients(this.grpc, (ServiceClient, key, parent) => {
      parent[key] = new ServiceClient(this.endpoint, grpc.credentials.createInsecure());

      for (const method in parent[key]) {
        if (
          typeof parent[key][method] === 'function' &&
          [
            'makeUnaryRequest',
            'makeClientStreamRequest',
            'makeServerStreamRequest',
            'makeBidiStreamRequest',
            'close',
            'getChannel',
            'waitForReady',
            'resolveCallInterceptors',
          ].indexOf(method) < 0
        ) {
          const original = parent[key][method];

          this.promisifyMethod(parent, key, method, original);
        }
      }
    });
  }

  private promisifyMethod(parent: any, key: string, method: string, original: any) {
    parent[key][method] = (arg: any, metaData: any) => {
      return new Promise((resolve, reject) => {
        this.callOriginal(original, parent, key, arg, method, reject, resolve, metaData);
      });
    };
  }

  // tslint:disable-next-line: parameters-max-number
  private callOriginal(
    original: any,
    parent: any,
    key: string,
    arg: any,
    method: string,
    reject: (err: any) => void,
    resolve: (res: any) => void,
    metaData = {},
  ) {
    original.call(parent[key], arg, metaData, this.promiseCallback(method, reject, resolve));
  }

  private promiseCallback(method: string, reject: (err: any) => void, resolve: (res: any) => void) {
    return (err: any, res: any) => {
      if (err) {
        RpcErrorHinter.hint(method, err, this.endpoint);

        reject(err);
      } else {
        resolve(res);
      }
    };
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
