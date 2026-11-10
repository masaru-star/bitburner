/** @param {NS} ns */
export async function main(ns) {
  const scriptFarm = "xp-farm.js";
  const scriptHack = "money.js";
  const costFarm = 2.1;
  const costHack = 1.7;
  const visited = new Set();
  const queue = ["home"];
  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);

    const neighbors = ns.scan(current);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
  const servers = Array.from(visited);
  for (const server of servers) {
    ns.killall(server);
    if (!ns.hasRootAccess(server)) continue;
    if (server !== "home") {
      const copiedFarm = await ns.scp(scriptFarm, server, "home");
      const copiedHack = await ns.scp(scriptHack, server, "home");
      if (!copiedFarm || !copiedHack) {
        ns.tprint(`[WARN] ${server} へのファイルコピーに失敗しました（ファイルが存在しない等の可能性）。`);
        continue;
      }
    }
    const freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    if (freeRam < costHack) continue;
    let bestT21 = 0;
    let bestT17 = 0;
    let maxUsedRam = 0;
    const maxT21 = Math.floor(freeRam / costFarm);
    for (let t21 = maxT21; t21 >= 0; t21--) {
      const remRam = freeRam - (t21 * costFarm);
      const t17 = Math.floor(remRam / costHack);
      const usedRam = (t21 * costFarm) + (t17 * costHack);
      if (usedRam > maxUsedRam + 0.0001) {
        maxUsedRam = usedRam;
        bestT21 = t21;
        bestT17 = t17;
      }
    }
    if (bestT21 > 0) {
      ns.exec(scriptFarm, server, bestT21);
    }
    if (bestT17 > 0) {
      ns.exec(scriptHack, server, bestT17);
    }
    ns.tprint(`[OK] ${server}: 2.1GB x${bestT21}, 1.7GB x${bestT17} (使用RAM: ${maxUsedRam.toFixed(1)} / ${freeRam.toFixed(1)} GB)`);
  }
}
