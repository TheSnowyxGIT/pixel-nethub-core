Commands of the binary:

alias of the binary: `pnh`

## Commands

### `pnh help`

Show this help message.

### `pnh version`

Show the version of the binary.

### `pnh run <AppPath>`

Run the an application.

> **Note:** The application must be a valid `pnh` application.
> AppPath must be a valid path to the application it must be decompress.

#### Options

- `-c <configPath>` (**required**): Path to the configuration file.

### `pnh validate <AppPath>`

Validate the an application. It will not check if the application will run correctly. But check if the application is a valid `pnh` application.

### `pnh login`

Login to the default pnh registry.

### `pnh register`

Register to the default pnh registry.

### `pnh logout`

Logout to the default pnh registry.

### `pnh deploy <AppPath>`

Deploy the an application. It will not check if the application will run correctly. But check if the application is a valid `pnh` application. And it will deploy to the default pnh registry.
