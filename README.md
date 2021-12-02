# How to use

## Requirements
- Run LocalTerra <https://github.com/terra-money/LocalTerra>
- Install Rust <https://www.rust-lang.org/tools/install>
- Install Node.js `brew install node`
- Install Yarn `npm install -g yarn`

## Start development

```sh
git clone https://github.com/terra-smart-contract-basic app
cd app

yarn install

yarn run deploy:contracts
yarn run start:app

# After that, if you updated contracts
yarn run deploy:contracts
```

# TODO

## Basic 
- [ ] Migration? `MsgMigrateCode` or `MsgMigrateContract`?

## After
- [ ] Make to a template <https://github.com/terra-money/my-terra-token>