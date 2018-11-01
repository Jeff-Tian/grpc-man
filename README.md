# grpc-man
A client to call gRPC server methods on the fly. 一个 gRPC 客户端，可以灵活地调用 gRPC 服务。

名字灵感来源于 `post-man`。

# Installation:
```bash
npm install -g grpc-man
```

# Call it from command line
```bash 
grpc-man <endpoint> <protoFilePath

# for example:
grpc-man localhost:8080 /path/to/proto_file
```

# Run locally
```baseh
npm start <endpoint> <protoFilePath>

# for example:
npm start localhost:8080 /path/to/proto_file
```

### Guide:
https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c 
