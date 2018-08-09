# Contributing

Thank you for contributing to this project!

## Environment setup

You'll probably need several repositories cloned before this setup is over, but the one you definitely need is the Wasp core.

### Pre-requisites

- [Node.JS v10](https://nodejs.org)
- [NPM v6](https://npmjs.com) (ships with Node.JS v10)
- [Yarn](https://yarnpkg.com/en/)
- [Typescript 3.0](https://typescriptlang.org)

### Core

```sh-session
$ mkdir wasp && cd wasp; # this is good to organize the many Wasp modules you'll be developing with
$ git clone https://github.com/waspjs/core ./core; # you can change the URL to your fork's URL if you have one
$ cd core;
$ yarn install;
$ tsc; # compile Typescript
$ yarn link; # https://yarnpkg.com/lang/en/docs/cli/link/
```

Now, you'll probably want to set up a module to test any changes with.

### Example

```sh-session
$ git clone https://github.com/waspjs/example ./example;
$ cd example;
$ yarn install;
$ yarn link @waspjs/core; # this ensures that changes you make in your local copy of `core` are propograted to `example`'s usage
$ tsc; # compile Typescript
```
