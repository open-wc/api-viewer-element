import { runWorkspacesScripts } from './runWorkspacesScripts.js';

const [script, folder] = process.argv.slice(2);

runWorkspacesScripts({ script, concurrency: 5, folder });
