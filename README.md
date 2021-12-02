# How to use

## Requirements

- Install Docker <https://docs.docker.com/get-docker/>
- Run LocalTerra <https://github.com/terra-money/LocalTerra>
- Install Rust <https://www.rust-lang.org/tools/install>
- Install Node.js `brew install node` (Need `npm@8` or higher)

## Start development

```sh
git clone https://github.com/terra-smart-contract-basic app
cd app

npm install

npm run deploy:contracts
npm run start:app

# After that, if you updated contracts
npm run deploy:contracts
```

## Configuration

- [app/scripts/start.config.json](app/scripts/start.config.json) : Developers may immediately execute a browser in which the wallet and localterra network are already set.
- [scripts](scripts) : It just runs in [zx](https://github.com/google/zx) script without any CLI tool. 

# TODO

## Basic

- [ ] Migration? `MsgMigrateCode` or `MsgMigrateContract`?

## After

- [ ] Make to a template <https://github.com/terra-money/my-terra-token>
