## Pre-setup

### Install `pnpm`

https://pnpm.io/installation

```sh
brew install pnpm
```

### Install `go`

https://go.dev/doc/install

ensure `$GOPATH/bin` is in `$PATH` by adding to `~/.zshrc` or `~/.bashrc`

```sh
PATH=$PATH:$GOPATH/bin
```

#### Install `just`

https://github.com/casey/just?tab=readme-ov-file#installation

## Setup

```sh
just setup
just setup-server-db
```

## Start App

### Run containers

```sh
just start-infra
```

### Start backend

```sh
just start-server
```

### Start frontend

```sh
just start-client
```
