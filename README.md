# grpc-man
A client to call gRPC server methods on the fly. 一个 gRPC 客户端，可以灵活地调用 gRPC 服务。

名字灵感来源于 `post-man`。

# Installation:
```bash
# 如果你想全局运行:
npm install -g grpc-man

# 如果你想在项目的测试代码里使用它:
npm install --save-dev grpc-man
```

# 用在测试里:
如果你的项目使用 gRPC 为客户提供服务，那么在你的项目的自动化测试中，你可以用它来帮助调用你的 gRPC 服务:

```typescript
import Client from "grpc-man/lib/Client";

describe('user grpc', () => {
    it('分页返回列表', async () => {
        const client = Client.connect('localhost:8081', path.join(__dirname, '../../proto/user.proto'), 'namespace.whatever', 'User')

        assert(client !== null);
        
        const userList = await asyncCall(client.User.getList, client)({page: 1, pageSize: 1});
    
        assert(userList.length === 1);
    })
})
```

# Call it from command line

```bash 
grpc-man <endpoint> <protoFilePath

# for example:
grpc-man localhost:8080 /path/to/proto_file
```

# Run locally
```bash
npm start <endpoint> <protoFilePath>

# for example:
npm start localhost:8080 /path/to/proto_file
```

### Guide:
https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c 
