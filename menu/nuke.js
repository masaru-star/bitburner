/** @param {NS} ns */
export async function main(ns) {
    const visited = new Set();
    async function networkScan(server) {
        visited.add(server);
        if (server !== "home") {
            await breakAndNuke(ns, server);
        }
        const neighbors = ns.scan(server);
        for (const nextServer of neighbors) {
            if (!visited.has(nextServer)) {
                await networkScan(nextServer);
            }
        }
    }
    ns.tprint("--- 全自動ハックシステムを起動します ---");
    await networkScan("home");
    ns.tprint("--- すべてのサーバーのハック処理が完了しました ---");
}
async function breakAndNuke(ns, server) {
    if (ns.hasRootAccess(server)) {
        return;
    }
    let openPorts = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(server);
        openPorts++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(server);
        openPorts++;
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
        ns.relaysmtp(server);
        openPorts++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        ns.httpworm(server);
        openPorts++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        ns.sqlinject(server);
        openPorts++;
    }
    const portsRequired = ns.getServerNumPortsRequired(server);
  
    if (openPorts >= portsRequired) {
        ns.nuke(server);
        ns.tprint(`[SUCCESS] ${server} のroot権限を取得しました。`);
    } else {
        ns.print(`[SKIP] ${server} はポート開放ツールが足りません (必要: ${portsRequired}, 所持: ${openPorts})`);
    }
}
