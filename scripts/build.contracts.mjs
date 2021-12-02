import { ROOT, PROJECT_NAME } from './env.mjs';

// create wasm files into /target
await $`cargo build --release --target wasm32-unknown-unknown`;

// create /artifacts
await $`docker run --rm -v "${ROOT}":/code \
  --mount type=volume,source="${PROJECT_NAME}_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.3;
`;
