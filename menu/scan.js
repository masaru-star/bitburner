export function autocomplete(data, args) {
  return data.servers;
}
export async function main(ns) {
  const target = ns.args[0];

  if (target) {
    if (!ns.serverExists(target)) {
      ns.tprint(`ERROR: Server '${target}' does not exist.`);
      return;
    }
    let path = [target];
    while (path[0] !== "home") {
      let parent = ns.scan(path[0])[0];
      path.unshift(parent);
    }
    const connectCommand = path.map(server => `connect ${server}`).join("; ");
    await ns.alert(`\nRoute to ${target}:\n\n` + connectCommand);

  } else {
    const visited = new Set();
    const serverList = [];

    function scanServer(hostname, depth) {
      visited.add(hostname);
      if (hostname !== "home") {
        const server = ns.getServer(hostname);
        serverList.push({
          name: hostname,
          depth: depth,
          reqLevel: server.requiredHackingSkill,
          ram: server.maxRam,
          hasRoot: server.hasAdminRights ? "YES" : "NO"
        });
      }
      const neighbors = ns.scan(hostname);
      for (const next of neighbors) {
        if (!visited.has(next)) {
          scanServer(next, depth + 1);
        }
      }
    }
    scanServer("home", 0);
    serverList.sort((a, b) => a.depth - b.depth || a.name.localeCompare(b.name));
    let output = `--- Network Scan Results ---\n\n`;
    output += `Depth | Hostname           | Req. Level | RAM    | Admin\n`;
    output += `------------------------------------------------------\n`;
    for (const s of serverList) {
      output += `[D:${s.depth}] ${s.name.padEnd(18)} | Lvl: ${String(s.reqLevel).padStart(4)} | ${s.ram.toString().padStart(4)}GB | Root: ${s.hasRoot}\n`;
    }
    await ns.alert(output);
  }
}
