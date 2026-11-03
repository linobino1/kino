/** The workflow persists this file between runs using its cache. */

const path = ".state.json";

export async function getState(): Promise<boolean> {
  try {
    const text = await Deno.readTextFile(path);
    return !!JSON.parse(text);
  } catch {
    return false;
  }
}

export async function saveState(state: boolean) {
  await Deno.writeTextFile(path, JSON.stringify(state));
}
