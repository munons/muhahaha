const output = document.getElementById('output');
const cmd = document.getElementById('cmd');
const history = [];
let idx = 0;
let visitorCache = null;

// Helper: Mencetak teks ke terminal
function print(text = '') {
    output.textContent += text + '\n';
    output.scrollTop = output.scrollHeight;
}

print('Hei Stalker, Welcome HaHaHa!');
print('Ketik "help" untuk memulai.');

// Mengambil data Visitor (IP & Geolokasi)
async function getVisitor() {
    if (visitorCache) return visitorCache;
    let ip = 'unknown';
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
    } catch {}

    const geo = await new Promise(res => {
        navigator.geolocation.getCurrentPosition(
            p => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
            () => res({ lat: 'denied', lon: 'denied' })
        );
    });

    visitorCache = { 
        ip, ...geo, 
        ua: navigator.userAgent, 
        platform: navigator.platform, 
        time: new Date().toISOString() 
    };
    return visitorCache;
}

// Logika Perintah (Commands)
const commands = {
    help: () => 'Available: help, about, projects, neofetch, geo, ip, device, clear',
    about: () => 'Stalker terminal by Muh',
    projects: () => '1. Web\n2. Linux\n3. Technical',
    neofetch: async () => {
        const i = await getVisitor();
        return `OS: Browser\nIP: ${i.ip}\nPlatform: ${i.platform}`;
    },
    geo: async () => {
        const i = await getVisitor();
        return `Lat: ${i.lat}\nLon: ${i.lon}`;
    },
    ip: async () => (await getVisitor()).ip,
    device: async () => (await getVisitor()).ua,
    clear: () => 'CLEAR'
};

// Event Handler untuk Input
cmd.addEventListener('keydown', async e => {
    if (e.key === 'ArrowUp') {
        if (history.length) {
            idx = Math.max(0, idx - 1);
            cmd.value = history[idx];
        }
        return;
    }

    if (e.key !== 'Enter') return;

    const val = cmd.value.trim().toLowerCase();
    if (!val) return;

    history.push(val);
    idx = history.length;
    print(`visitor@stalker:~$ ${val}`);
    cmd.value = '';

    const act = commands[val];
    let res = act ? await act() : 'Command not found. Type "help" for assistance.';

    if (res === 'CLEAR') {
        output.textContent = '';
    } else {
        print(res);
    }
});
