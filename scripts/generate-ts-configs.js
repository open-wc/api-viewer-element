import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import merge from 'deepmerge';
import { packages } from '../workspace-packages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TSCONFIG_COMMENT = `// Don't edit this file directly. It is generated by /scripts/update-package-configs.ts\n\n`;

const packagesRoot = path.join(__dirname, '..', 'packages');
const fixturesRoot = path.join(__dirname, '..', 'fixtures');

const packageJSONMap = new Map();

/** @type {Map<string,string>} */
const packageDirnameMap = new Map();

/** @type {Map<string,string>} */
const internalDependencyMap = new Map();

const isFixture = (/** @type {string} */ str) =>
  !str.includes('api') || str.includes('fixtures');

// collect package json for all packages
packages.forEach((pkg) => {
  const pkgRoot = isFixture(pkg.name) ? fixturesRoot : packagesRoot;
  const packageJSONPath = path.join(pkgRoot, pkg.name, 'package.json');
  if (!fs.existsSync(packageJSONPath)) {
    console.error();
    console.error(`Could not find package.json: ${packageJSONPath}`);
    console.error();
    process.exit(1);
  }

  /** @type {Record<string,string>} */
  const packageJSONData = JSON.parse(
    fs.readFileSync(packageJSONPath).toString()
  );
  const packageName = packageJSONData.name;
  packageDirnameMap.set(packageName, pkg.name);
  packageJSONMap.set(packageName, packageJSONData);
});

// collect initial cross package dependencies info
packageDirnameMap.forEach((_packageDirname, packageName) => {
  const { dependencies, devDependencies } = packageJSONMap.get(packageName);

  const internalDependencies = [
    ...(dependencies ? Object.keys(dependencies) : []),
    ...(devDependencies ? Object.keys(devDependencies) : [])
  ].filter((dep) => packageDirnameMap.has(dep));

  internalDependencyMap.set(packageName, internalDependencies);
});

function resolveInternalDependencies(dependencies) {
  const childDeps = [];

  for (const idep of dependencies) {
    const deps = internalDependencyMap.get(idep);
    const res = resolveInternalDependencies(deps);
    for (const jdep of res) {
      childDeps.push(jdep);
    }
  }

  /** @type {Array<string>} */
  const resolved = childDeps.concat(dependencies);
  // remove all duplicated after the first appearance
  return resolved.filter((item, idx) => resolved.indexOf(item) === idx);
}

packageDirnameMap.forEach((packageDirname, packageName) => {
  const pkg = packages.find((p) => p.name === packageDirname);
  const pkgRoot = isFixture(packageDirname) ? fixturesRoot : packagesRoot;

  const pkgDir = path.join(pkgRoot, packageDirname);

  const tsconfigPath = path.join(pkgDir, 'tsconfig.json');

  let tsConfigOverride = {};
  const tsConfigOverridePath = path.join(pkgDir, 'tsconfig.override.json');

  if (fs.existsSync(tsConfigOverridePath)) {
    tsConfigOverride = JSON.parse(fs.readFileSync(tsConfigOverridePath));
  }
  const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

  /** @type {Array<string>} */
  const internalDependencies = resolveInternalDependencies(
    internalDependencyMap.get(packageName)
  );
  const tsconfigData = merge(
    {
      extends: `../../tsconfig.base.json`,
      compilerOptions: {
        module: pkg.environment === 'browser' ? 'ESNext' : 'commonjs',
        outDir: './lib',
        rootDir: './src',
        composite: true,
        strict: pkg.strict,
        checkJs: pkg.type === 'js' ? true : undefined,
        emitDeclarationOnly: pkg.type === 'js' ? true : undefined
      },
      references: internalDependencies.map((dep) => {
        /** @type {string} */
        const name = packageDirnameMap.get(dep);
        return { path: `../${name}/tsconfig.json` };
      }),
      include: ['src'],
      exclude: ['lib']
    },
    tsConfigOverride,
    { arrayMerge: overwriteMerge }
  );
  fs.writeFileSync(
    tsconfigPath,
    TSCONFIG_COMMENT + JSON.stringify(tsconfigData, null, '  ')
  );
});

const projectLevelTsconfigPath = path.join(__dirname, '..', 'tsconfig.json');

const projectLevelTsconfigData = {
  extends: './tsconfig.base.json',
  files: [],
  references: resolveInternalDependencies(
    Array.from(packageDirnameMap.keys())
  ).map((packageName) => {
    const folder = isFixture(packageName) ? 'fixtures' : 'packages';
    /** @type {string} */
    const name = packageDirnameMap.get(packageName);
    return {
      path: `./${folder}/${name}/tsconfig.json`
    };
  })
};

fs.writeFileSync(
  projectLevelTsconfigPath,
  TSCONFIG_COMMENT + JSON.stringify(projectLevelTsconfigData, null, '  ')
);
