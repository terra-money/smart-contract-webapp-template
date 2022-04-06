# Terra development template

This is a basic template for developing a web app that interacts with smart contracts. This template is based on [cw-template of CosmWasm](https://github.com/InterWasm/cw-template).

> ⚠️ This template was tested only in macOS. We have yet conduct tests in a wider OS.

# Instructions

## Requirements

- Install Docker <https://docs.docker.com/get-docker/>
- Install Rust <https://www.rust-lang.org/tools/install>
- Install Node.js <https://nodejs.org/> (recommend node lts version (v16). and update to `npm@8` or higher for workspace feature)

This template requires Docker to run LocalTerra, Rust and Cargo to build Smart Contract, and Node.js.

Please refer to the above links and install them.

## Start development

First, [LocalTerra](https://github.com/terra-money/localterra) must be running. Please run LocalTerra using docker-compose.

```sh
git clone --depth=1 https://github.com/terra-money/localterra
cd localterra
docker-compose up
```

Then, start app development

```sh
npx terra-templates get smart-contract:basic myapp
cd myapp

npm install

npm run deploy # build contracts, build schema and build contract types 
npm run app:start # run web app

# After that, if you have modified the /contracts source code, run this again
npm run deploy
```

![screen shot](https://raw.githubusercontent.com/iamssen/terra-smart-contract-basic/main/readme-assets/screenshot.png)

## Commands

All commands are organized as npm script. Please refer to the commands below.

- `npm run contract:build` This command builds sources in the `~/contracts/*` directories to `~/target`.
- `npm run contract:schema` This command creates `~/schema/*/*.json` schema files. 
- `npm run contract:types` This command creates a `app/src/contract.ts` file using the `~/schema/*/*.json` schema files.
- `npm run app:start` This command runs the web app.
- `npm run build` This command runs `npm run contract:build`, `npm run contract:schema`, and `npm run contract:types` sequentially.
- `npm run deploy` This command runs `npm run build` and deploys `*.wasm` files built thereafter to LocalTerra.
- `npm run test` This command runs all the tests in the `~/contracts` and `~/app`.
- `npm run test:integration` This command runs the integration tests on the `~/test` directory.

## Configuration

#### [station.config.json](https://github.com/iamssen/terra-smart-contract-basic/blob/main/station.config.json)

If you run `run app:start`, you can see a new chrome browser with the Terra Station extension already installed.

You can run the chrome browser with the test conditions you want just by modifying this `station.config.json` file without having to set up the station extension separately for your test.

#### [scripts](https://github.com/iamssen/terra-smart-contract-basic/tree/main/scripts)

All scripts in this template were wrote using Google [zx](https://github.com/google/zx). You can modify these script files when you need to modify the build or deploy conditions.
