# Terra development template

This is a template that can develop both smart contract and web app.

> ⚠️ I tested this template only in macOS

# How to use

## Requirements

- Install Docker <https://docs.docker.com/get-docker/>
- Install Rust <https://www.rust-lang.org/tools/install>
- Install Node.js `brew install node` (required `npm@8` or higher)

## Start development

Start LocalTerra

```sh
git clone --depth=1 https://github.com/terra-money/localterra
cd localterra
docker-compose up
```

Start app development

```sh
git clone https://github.com/iamssen/terra-smart-contract-basic myapp
cd myapp

npm install

npm run deploy # build contracts -> build schema -> build contract types 
npm run app:start # run web app

# After that, if you have modified the /contracts source codes, run it again.
npm run deploy
```

## Configuration

- [station.config.json](station.config.json) : Developers may immediately execute a browser in which the wallet and localterra network are already set.
- [scripts](scripts) : It just runs in [zx](https://github.com/google/zx) script without any CLI tool. 

# TODO

## After

- [ ] Make to a template <https://github.com/terra-money/my-terra-token>
