export async function isWasm32Exists() {
  const { stdout } = await $`rustup target list`;
  return stdout
    .split('\n')
    .some((target) => target === 'wasm32-unknown-unknown');
}
