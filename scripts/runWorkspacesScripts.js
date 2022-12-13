import fs from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import concurrently from 'concurrently';
import pc from 'picocolors';

/**
 * @typedef {Object} ScriptConfig
 * @property {string} script
 * @property {number} concurrency
 * @property {string} folder
 * @property {Array<string>} filteredPackages
 */

/**
 * @param {ScriptConfig} config
 */
export function runWorkspacesScripts({
  script,
  concurrency,
  folder = 'packages',
  filteredPackages = []
}) {
  const moduleDir = dirname(fileURLToPath(import.meta.url));

  function findPackagesWithScript(directory) {
    const packages = [];

    for (const name of fs.readdirSync(directory)) {
      if (!filteredPackages.includes(name)) {
        const pkgPath = join(directory, name);
        const pkgJsonPath = join(pkgPath, 'package.json');

        if (fs.existsSync(pkgJsonPath)) {
          /** @type {{ scripts: object | undefined }} */
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));

          if (pkgJson.scripts && pkgJson.scripts[script]) {
            packages.push(pkgPath);
          }
        }
      }
    }

    return packages;
  }

  const packagesDir = join(moduleDir, '..', folder);
  const packagesWithScript = findPackagesWithScript(packagesDir);

  const commands = packagesWithScript.map((pkgPath) => ({
    name: basename(pkgPath),
    command: `cd ${pkgPath} && yarn ${script}`
  }));

  const { result } = concurrently(commands, { maxProcesses: concurrency });
  result
    .then(() => {
      console.log(
        pc.green(
          `Successfully executed command ${pc.yellow(
            script
          )} for packages: ${pc.yellow(commands.map((c) => c.name).join(', '))}`
        )
      );
      console.log();
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.error(error);
      } else if (Array.isArray(error)) {
        const count = error.filter((err) => err !== 0).length;
        console.log('');
        console.log(
          pc.red(
            `Failed to execute command ${pc.yellow(
              script
            )} for ${count} packages. But we don't know which ones, because concurrently doesn't say.`
          )
        );
        console.log();
      }
      process.exit(1);
    });
}
