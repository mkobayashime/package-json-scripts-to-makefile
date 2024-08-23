#!/usr/bin/env -S deno run --allow-read --allow-write

import { dirname, join } from "https://deno.land/std@0.224.0/path/mod.ts";

const buildMakefileFromScripts = (scripts: Record<string, string>) =>
  Object.entries(scripts).map(([name, command]) => (`
${name}: PHONY
	${command}
`.trim())).join("\n\n") + "\n\nPHONY:";

void (async () => {
  const packageJSONPath = Deno.args[0];
  if (!packageJSONPath) return;

  const packageJSON = JSON.parse(await Deno.readTextFile(packageJSONPath));
  if (!packageJSON) return;
  if (!("scripts" in packageJSON)) return;

  const scripts = packageJSON.scripts as Record<string, string>;
  const makefile = buildMakefileFromScripts(scripts);
  await Deno.writeTextFile(
    join(dirname(packageJSONPath), "Makefile"),
    makefile,
  );
})();
