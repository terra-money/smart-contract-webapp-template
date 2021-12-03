import { ROOT, PROJECT_NAME } from './env.mjs';
import { isWasm32Exists } from './helpers/isWasm32Exists.mjs';

const wasm32Exists = await isWasm32Exists();

if (!wasm32Exists) {
  await $`rustup target add wasm32-unknown-unknown`;
}

// create wasm files into /target
await $`cargo build --release --target wasm32-unknown-unknown`;

// create /artifacts
await $`docker run --rm -v "${ROOT}":/code \
  --mount type=volume,source="${PROJECT_NAME}_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.3;
`;
