# grpc-man

[中文简体](./README_zh-CN.md)

> A client to call gRPC server methods on the fly.
>
> The name is inspired by `post-man`.

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/Jeff-Tian/grpc-man.svg?branch=master)](https://travis-ci.com/Jeff-Tian/grpc-man)
[![NPM version](https://badge.fury.io/js/grpc-man.png)](http://badge.fury.io/js/grpc-man)
[![npm download][download-image]][download-url]
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Git commit with emojis!](https://img.shields.io/badge/gitmoji-git%20commit%20with%20emojis!-brightgreen.svg)](https://gitmoji.js.org)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FJeff-Tian%2Fgrpc-man.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FJeff-Tian%2Fgrpc-man?ref=badge_shield)

[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=Jeff-Tian_grpc-man)](https://sonarcloud.io/dashboard?id=Jeff-Tian_grpc-man)

[download-image]: https://img.shields.io/npm/dm/grpc-man.svg?style=flat-square
[download-url]: https://npmjs.org/package/grpc-man

# Usage

This package provides a lightweight gRPC client implementation, which can be used to verify your gRPC service is working as expected or not.

I am using it heavily for testing code, and recommend you to use it too.

# Installation

```bash
# Globally
npm install -g grpc-man

# Only in project and for testing purpose
npm install --save-dev grpc-man
```

# Use in `javascript` project

```javascript
import GrpcClient from 'grpc-man/lib/Client';

async function main() {
  const client = new GrpcClient('<yourhost>:<your port>', __dirname + 'your.proto');

  await client.grpc.youpackage.YourService.yourMethod(arg);
}
```

# Use in testing

If your project provides services through gRPC, then you can use `grpc-man` to do the automatic testing against your gRPC services.

### with mocha

The proto file used for testing is [here](./src/__tests__/proto/helloworld.proto)。

```typescript
import assert = require('assert');
import GrpcClient from 'grpc-man/lib/Client';

describe('grpc', () => {
  it('greets', async () => {
    const client = new Client('0.0.0.0:8890', __dirname + '/./proto/helloworld.proto');

    const res = await client.grpc.helloworld.Greeter.sayHello({ name: 'name' });
    assert.deepEqual(res, { message: 'Hello name' });
  });
});
```

If you are using `jest` testing framework, then you can refer to [the testing code for this package itself](./src/__tests__/Client.test.ts)。

# Use in command line

```bash
grpc-man <endpoint> <protoFilePath>

# for example:
grpc-man localhost:8080 /path/to/proto_file
```

# Run it locally

```bash
npm start <endpoint> <protoFilePath>

# for example:
npm start localhost:8080 /path/to/proto_file
```

## Run client in development mode

```bash
npm run client
```

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FJeff-Tian%2Fgrpc-man.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FJeff-Tian%2Fgrpc-man?ref=badge_large)
