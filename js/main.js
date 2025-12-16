// main.js - includes DPR-aware matrix & word rain, cursor trail, toggles, sound, nav, terminal modal, parallax

/* -------------------- UTILS -------------------- */
const isInternalLink = (url) => {
  try { const u = new URL(url, location.href); return u.origin === location.origin; }
  catch(e){ return false; }
};

/* -------------------- YEAR -------------------- */
(function fillYears(){
  const y = new Date().getFullYear();
  document.querySelectorAll('#year, #year2, #year3, #year4').forEach(el => { if(el) el.textContent = y; });
})();

/* -------------------- MATRIX RAIN (DPR aware, draws on top) -------------------- */
(function matrixRain(){
  const canvas = document.getElementById('matrixCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let w=0, h=0, cols=0, yPos = [];
  const DPR = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cols = Math.floor(w / 16) + 1;
    yPos = Array(cols).fill(0).map(() => Math.random() * h);
  }
  window.addEventListener('resize', resize);
  resize();

  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+-/<>?';

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0, 0, w, h);

    ctx.font = '14px monospace';
    for (let i = 0; i < cols; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      const x = i * 16;
      const y = yPos[i];

      ctx.fillStyle = 'rgba(57,255,20,1)';
      ctx.fillText(text, x, y);

      ctx.fillStyle = 'rgba(57,255,20,0.28)';
      ctx.fillText(text, x, y - 16);
      ctx.fillStyle = 'rgba(57,255,20,0.08)';
      ctx.fillText(text, x, y - 32);

      yPos[i] = (y > h + Math.random() * 10000) ? 0 : y + 16 + Math.random() * 6;
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

/* -------------------- WORD RAIN (DPR aware, drawn under matrix) -------------------- */
(function wordRain(){
  const canvas = document.getElementById('wordCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let w=0, h=0;
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  let words = [];
  const wordList = [
    "HACK","KALI","PARROT","UBUNTU","LINUX","ROOT","SUDO","ACCESS",
    "CYBER","BYTE","SHELL","ADMIN","TERMINAL","NEON","SECURE"
  ];

  function resize() {
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function spawnWord() {
    words.push({
      text: wordList[Math.floor(Math.random()*wordList.length)],
      x: Math.random() * w,
      y: -20 - Math.random()*200,
      speed: 0.4 + Math.random() * 1.8,
      size: 12 + Math.random() * 18,
      alpha: 0.65 + Math.random() * 0.35
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = words.length - 1; i >= 0; i--) {
      const wr = words[i];
      ctx.font = `${wr.size}px monospace`;
      ctx.fillStyle = `rgba(57,255,20,${wr.alpha})`;
      ctx.fillText(wr.text, wr.x, wr.y);
      wr.y += wr.speed;
      if (wr.y > h + 80) words.splice(i, 1);
    }

    if (Math.random() > 0.925 && words.length < 60) spawnWord();

    requestAnimationFrame(draw);
  }

  draw();
})();

/* -------------------- DYNAMIC PARTICLE GENERATION -------------------- */
(function generateParticles(){
  const container = document.querySelector('.bg-anim .particles-container');
  if(!container) return;
  
  // Create additional dynamic particles
  for(let i = 0; i < 15; i++){
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = (2 + Math.random() * 3) + 'px';
    particle.style.height = particle.style.width;
    particle.style.borderRadius = '50%';
    particle.style.background = Math.random() > 0.5 
      ? `radial-gradient(circle, rgba(57,255,20,${0.6 + Math.random() * 0.4}), transparent)`
      : `radial-gradient(circle, rgba(102,153,255,${0.5 + Math.random() * 0.3}), transparent)`;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.boxShadow = `0 0 ${4 + Math.random() * 6}px ${Math.random() > 0.5 ? 'rgba(57,255,20,0.8)' : 'rgba(102,153,255,0.6)'}`;
    particle.style.animation = `particleDrift ${15 + Math.random() * 20}s ease-in-out infinite`;
    particle.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(particle);
  }
})();

/* -------------------- BACKGROUND TOGGLE -------------------- */
(function backgroundToggle(){
  const btns = document.querySelectorAll('#bgToggle');
  const matrix = document.getElementById('matrixCanvas');
  const words = document.getElementById('wordCanvas');
  const bg = document.querySelector('.bg-anim');
  let enabled = localStorage.getItem('bgEnabled') || 'on';
  function apply(){ const mode = enabled==='on' ? 'block' : 'none'; if(matrix) matrix.style.display=mode; if(words) words.style.display=mode; if(bg) bg.style.display=mode; btns.forEach(b=>{ if(b) b.textContent = enabled==='on' ? 'Disable Background' : 'Enable Background'; }); }
  apply();
  btns.forEach(btn => { if(!btn) return; btn.addEventListener('click', ()=>{ enabled = enabled==='on' ? 'off' : 'on'; localStorage.setItem('bgEnabled', enabled); apply(); Sound.playClick(); }); });
})();

/* -------------------- SOUND -------------------- */
const Sound = (function(){
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let enabled = localStorage.getItem('soundEnabled'); if(enabled===null) enabled='on';
  function play(freq=880, type='sine', dur=0.06, g=0.06){ if(enabled!=='on') return; const o=ctx.createOscillator(), gg=ctx.createGain(); o.type=type; o.frequency.value=freq; gg.gain.value=g; o.connect(gg); gg.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur); }
  return { playClick: ()=> play(900,'triangle',0.05,0.05), playNav: ()=> play(600,'sine',0.08,0.08), toggle: ()=> { enabled = enabled==='on' ? 'off' : 'on'; localStorage.setItem('soundEnabled', enabled); return enabled; }, enabled: ()=> enabled };
})();
(function soundToggleInit(){ const btns=document.querySelectorAll('#soundToggle'); const state=Sound.enabled(); btns.forEach(b=>{ if(b) b.textContent = state==='on' ? 'Sound: On' : 'Sound: Off'; }); btns.forEach(b=>{ if(!b) return; b.addEventListener('click', ()=>{ const ns = Sound.toggle(); document.querySelectorAll('#soundToggle').forEach(bb=>bb.textContent = ns==='on' ? 'Sound: On' : 'Sound: Off'); if(ns==='on') Sound.playClick(); }); }); })();

/* -------------------- TERMINAL MODAL -------------------- */
const Terminal = (function(){
  const modal = document.getElementById('terminalModal');
  const output = document.getElementById('termOutput');
  const input = document.getElementById('termInput');
  const promptEl = document.getElementById('termPrompt');
  const tabs = document.querySelectorAll('.term-tab');
  const closeBtn = document.getElementById('termClose');
  const clearBtn = document.getElementById('termClear');

  const envs = {
    kali: {
      prompt: 'root@kali:~$',
      uname: "Linux kali 5.10.0-kali9-amd64 #1 SMP Debian 5.10.46-4kali1 (2021-08-09) x86_64 GNU/Linux",
      whoami: 'root',
      hostname: 'kali',
      pwd: '/root',
      ls: ['Desktop', 'Documents', 'Downloads', 'tools', 'exploits', 'scripts', 'README.txt', '.bashrc'],
      motd: 'Welcome to Kali Linux (Simulated Terminal)\nKali Linux is a Debian-derived Linux distribution designed for digital forensics and penetration testing.\nType "help" for available commands.'
    },
    parrot: {
      prompt: 'user@parrot:~$',
      uname: "Linux parrot 5.18.0-parrot1-amd64 #1 SMP Parrot 5.18.6-1parrot1 (2022-06-15) x86_64 GNU/Linux",
      whoami: 'user',
      hostname: 'parrot',
      pwd: '/home/user',
      ls: ['Desktop', 'Documents', 'Downloads', 'privacy-tools', 'sandbox', 'notes.txt', '.bashrc'],
      motd: 'Welcome to Parrot OS (Simulated Terminal)\nParrot OS is a security-oriented operating system based on Debian.\nType "help" for available commands.'
    },
    ubuntu: {
      prompt: 'user@ubuntu:~$',
      uname: "Linux ubuntu 5.15.0-52-generic #58-Ubuntu SMP Thu Oct 13 08:03:55 UTC 2022 x86_64 x86_64 x86_64 GNU/Linux",
      whoami: 'user',
      hostname: 'ubuntu',
      pwd: '/home/user',
      ls: ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Videos', 'music', 'projects', '.bashrc'],
      motd: 'Welcome to Ubuntu (Simulated Terminal)\nUbuntu is a Debian-based Linux distribution for desktops, servers, and clouds.\nType "help" for available commands.'
    }
  };

  let current = 'kali';
  let history = {kali:[], parrot:[], ubuntu:[]};
  let histIndex = null;
  let currentDir = {kali: '/root', parrot: '/home/user', ubuntu: '/home/user'};

  function open(os){
    current = os || 'kali';
    if(!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    tabs.forEach(t => t.classList.toggle('active', t.dataset.os === current));
    updatePrompt();
    writeLine(envs[current].motd + '\n');
    input && input.focus();
  }
  function close(){ if(!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); if(input) input.value = ''; }

  function updatePrompt(){ if(promptEl) promptEl.textContent = envs[current].prompt; }

  function writeLine(text){
    if(!output) return;
    const escaped = text.replace(/</g,'&lt;').replace(/>/g,'&gt;');
    output.insertAdjacentHTML('beforeend', `<div class="out-line">${escaped}</div>`);
    const body = document.querySelector('.terminal-body');
    if(body) body.scrollTop = body.scrollHeight;
  }

  function clear(){ if(output) output.innerHTML = ''; }

  function runCommand(cmdRaw){
    const cmd = (cmdRaw||'').trim();
    if(!cmd) return;
    writeLine(`${envs[current].prompt} ${cmd}`);
    history[current].push(cmd);
    histIndex = null;
    const parts = cmd.split(/\s+/);
    const base = parts[0].toLowerCase();
    const args = parts.slice(1);

    // HELP command
    if(base === 'help'){
      const common = 'Common commands: ls, cd, pwd, cat, echo, grep, whoami, uname -a, clear, exit';
      const osSpecific = current === 'kali' || current === 'parrot' 
        ? '\nSecurity tools: nmap, aircrack-ng, metasploit, sqlmap, burpsuite, wireshark'
        : '\nSystem: apt update, apt install, systemctl, sudo';
      writeLine(common + osSpecific + '\n\nNote: This is a simulated terminal. Commands are safe and educational.');
      return;
    }

    // UNAME command
    if(base === 'uname'){
      if(args.includes('-a') || args.includes('--all')){
        writeLine(envs[current].uname);
      } else if(args.includes('-r')){
        writeLine(envs[current].uname.split(' ')[2]);
      } else if(args.includes('-m')){
        writeLine('x86_64');
      } else {
        writeLine('Linux');
      }
      return;
    }

    // WHOAMI command
    if(base === 'whoami'){
      writeLine(envs[current].whoami);
      return;
    }

    // HOSTNAME command
    if(base === 'hostname'){
      writeLine(envs[current].hostname);
      return;
    }

    // PWD command
    if(base === 'pwd'){
      writeLine(currentDir[current]);
      return;
    }

    // LS command
    if(base === 'ls'){
      if(args.includes('-l') || args.includes('--long')){
        const files = envs[current].ls;
        files.forEach(f => {
          const isDir = !f.includes('.');
          const perm = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
          const size = Math.floor(Math.random() * 10000) + 100;
          const date = new Date().toLocaleDateString('en-US', {month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'});
          writeLine(`${perm} 1 ${envs[current].whoami} ${envs[current].whoami} ${size} ${date} ${f}`);
        });
      } else if(args.includes('-a') || args.includes('--all')){
        writeLine(['.', '..', ...envs[current].ls].join('   '));
      } else {
        writeLine(envs[current].ls.join('   '));
      }
      return;
    }

    // CD command
    if(base === 'cd'){
      if(args.length === 0 || args[0] === '~' || args[0] === '~/') {
        currentDir[current] = current === 'kali' ? '/root' : '/home/user';
        envs[current].pwd = currentDir[current];
      } else if(args[0] === '..') {
        const parts = currentDir[current].split('/').filter(p => p);
        parts.pop();
        currentDir[current] = parts.length > 0 ? '/' + parts.join('/') : '/';
        envs[current].pwd = currentDir[current];
      } else if(args[0].startsWith('/')) {
        currentDir[current] = args[0];
        envs[current].pwd = currentDir[current];
      } else {
        const dir = args[0];
        if(envs[current].ls.includes(dir) && !dir.includes('.')){
          currentDir[current] = currentDir[current] + '/' + dir;
          envs[current].pwd = currentDir[current];
        } else {
          writeLine(`cd: ${dir}: No such file or directory`);
        }
      }
      return;
    }

    // CAT command
    if(base === 'cat'){
      if(args.length === 0){
        writeLine('cat: missing file operand');
        return;
      }
      const file = args[0];
      if(file === 'README.txt' || file.includes('README')){
        writeLine(`# ${current.toUpperCase()} OS Information\n\nThis is a simulated terminal environment.\nLearn Linux commands safely here.`);
      } else if(file === '.bashrc'){
        writeLine('# ~/.bashrc\n# User specific aliases and functions\nexport PATH=$PATH:/usr/local/bin');
      } else if(envs[current].ls.includes(file)){
        writeLine(`Contents of ${file}:\n[File content would appear here in a real terminal]`);
      } else {
        writeLine(`cat: ${file}: No such file or directory`);
      }
      return;
    }

    // ECHO command
    if(base === 'echo'){
      const text = args.join(' ').replace(/"/g, '').replace(/'/g, '');
      writeLine(text);
      return;
    }

    // GREP command
    if(base === 'grep'){
      if(args.length < 2){
        writeLine('grep: missing pattern or file');
        return;
      }
      const pattern = args[0];
      const file = args[1];
      writeLine(`[Simulated grep output for pattern "${pattern}" in ${file}]`);
      return;
    }

    // CLEAR command
    if(base === 'clear'){
      clear();
      return;
    }

    // APT commands (Debian/Ubuntu package manager)
    if(base === 'apt'){
      if(args[0] === 'update'){
        writeLine('Get:1 http://archive.ubuntu.com/ubuntu focal InRelease [265 kB]\n' +
                  'Get:2 http://security.ubuntu.com/ubuntu focal-security InRelease [114 kB]\n' +
                  'Fetched 379 kB in 2s (189 kB/s)\n' +
                  'Reading package lists... Done');
      } else if(args[0] === 'install' && args[1]){
        writeLine(`Reading package lists... Done\n` +
                  `Building dependency tree... Done\n` +
                  `The following NEW packages will be installed:\n  ${args[1]}\n` +
                  `0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.\n` +
                  `Need to get 0 B/1,234 kB of archives.\n` +
                  `After this operation, 1,234 kB of additional disk space will be used.\n` +
                  `(simulated installation)`);
      } else if(args[0] === 'list' || args[0] === 'search'){
        writeLine('[Simulated package list/search results]');
      } else {
        writeLine('apt: unknown command. Try "apt update" or "apt install <package>"');
      }
      return;
    }

    // NMAP command (Kali/Parrot security tool)
    if(base === 'nmap'){
      if(args.length === 0 || args.includes('--help')){
        writeLine('Nmap 7.92 ( https://nmap.org )\nUsage: nmap [Scan Type(s)] [Options] {target specification}');
      } else if(args[0] && !args[0].startsWith('-')){
        writeLine(`Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toLocaleString()}\n` +
                  `Nmap scan report for ${args[0]}\n` +
                  `Host is up (0.001s latency).\n` +
                  `Not shown: 998 closed ports\n` +
                  `PORT   STATE SERVICE\n` +
                  `22/tcp open  ssh\n` +
                  `80/tcp open  http\n` +
                  `\nNmap done: 1 IP address (1 host up) scanned in 0.05 seconds`);
      } else {
        writeLine('Nmap: invalid arguments');
      }
      return;
    }

    // AIRCRACK-NG command (Kali/Parrot wireless security)
    if(base === 'aircrack-ng' || base === 'aircrack'){
      writeLine('Aircrack-ng 1.7\n\nUsage: aircrack-ng [options] <capture file(s)>\n' +
                'Simulated: This tool is used for WiFi network security testing.');
      return;
    }

    // METASPLOIT command (Kali/Parrot penetration testing)
    if(base === 'msfconsole' || base === 'metasploit'){
      writeLine('[-] ***rting the Metasploit Framework console...\n' +
                '[*] Starting database...\n' +
                '[*] Database started\n' +
                'msf6 >\n' +
                '(Simulated Metasploit console. Type "help" for commands)');
      return;
    }

    // SQLMAP command (Kali/Parrot SQL injection tool)
    if(base === 'sqlmap'){
      writeLine('        ___\n       __H__\n ___ ___[)]_____ ___ ___  {1.7.2#stable}\n|_ -| . [(]     | .\'| | |\n|___|_  [\']_|_|_|__,|  _|\n      |_|V...       |_|   https://sqlmap.org\n\nUsage: sqlmap [options]\nSimulated SQL injection testing tool.');
      return;
    }

    // BURPSUITE command (Kali/Parrot web security)
    if(base === 'burpsuite' || base === 'burp'){
      writeLine('Burp Suite Community Edition\n[Simulated] Web application security testing tool.');
      return;
    }

    // WIRESHARK command (Network analyzer)
    if(base === 'wireshark' || base === 'tshark'){
      writeLine('Wireshark - Network Protocol Analyzer\n[Simulated] Packet capture and analysis tool.');
      return;
    }

    // SYSTEMCTL command (Ubuntu systemd)
    if(base === 'systemctl'){
      if(args[0] === 'status'){
        writeLine('systemd 245 (245.4-4ubuntu3.20)\n+PAM +AUDIT +SELINUX +IMA +APPARMOR +SMACK +SYSVINIT +UTMP +LIBCRYPTSETUP +GCRYPT +GNUTLS +ACL +XZ +LZ4 +SECCOMP +BLKID +ELFUTILS +KMOD +IDN2 -IDN +PCRE2 default-hierarchy=hybrid');
      } else if(args[0] === 'list'){
        writeLine('[Simulated systemd service list]');
      } else {
        writeLine('systemctl: invalid command');
      }
      return;
    }

    // SUDO command
    if(base === 'sudo'){
      if(args.length === 0){
        writeLine('sudo: a password is required');
      } else {
        writeLine(`[sudo] password for ${envs[current].whoami}: `);
        writeLine(`(Simulated: Command "${args.join(' ')}" would run with elevated privileges)`);
      }
      return;
    }

    // DATE command
    if(base === 'date'){
      writeLine(new Date().toString());
      return;
    }

    // PS command (process list)
    if(base === 'ps'){
      if(args.includes('aux') || args.includes('-ef')){
        writeLine('  PID TTY          TIME CMD\n' +
                  '    1 ?        00:00:01 systemd\n' +
                  '  456 ?        00:00:02 bash\n' +
                  '  789 ?        00:00:01 node');
      } else {
        writeLine('  PID TTY          TIME CMD\n' +
                  '  456 pts/0    00:00:02 bash');
      }
      return;
    }

    // TOP command
    if(base === 'top'){
      writeLine('top - ' + new Date().toLocaleTimeString() + ' up 1 day,  2:30,  1 user,  load average: 0.15, 0.12, 0.10\n' +
                'Tasks: 120 total,   1 running, 119 sleeping,   0 stopped,   0 zombie\n' +
                '%Cpu(s):  2.5 us,  1.2 sy,  0.0 ni, 96.3 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st\n' +
                'MiB Mem :   8192.0 total,   2048.0 free,   3072.0 used,   3072.0 buff/cache\n' +
                'MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5120.0 avail Mem\n\n' +
                '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n' +
                '  456 root      20   0   12345   2345   1234 S   2.5   0.1   0:02.15 bash');
      return;
    }

    // EXIT command
    if(base === 'exit'){
      writeLine('exit');
      close();
      return;
    }

    // Unknown command
    writeLine(`${base}: command not found\nTry "help" for a list of available commands.`);
  }

  if(tabs){
    tabs.forEach(t => t.addEventListener('click', e => {
      const os = t.dataset.os;
      current = os;
      tabs.forEach(x => x.classList.toggle('active', x.dataset.os === os));
      updatePrompt();
      input && input.focus();
    }));
  }
  if(closeBtn) closeBtn.addEventListener('click', ()=>{ close(); Sound.playClick(); });
  if(clearBtn) clearBtn.addEventListener('click', ()=>{ clear(); Sound.playClick(); });

  if(input){
    input.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){
        const v = input.value;
        runCommand(v);
        input.value = '';
        Sound.playClick();
        e.preventDefault();
      } else if(e.key === 'ArrowUp' || e.key === 'ArrowDown'){
        const h = history[current];
        if(!h || h.length === 0) return;
        if(histIndex === null) histIndex = h.length;
        if(e.key === 'ArrowUp'){ histIndex = Math.max(0, histIndex-1); input.value = h[histIndex] || ''; }
        else { histIndex = Math.min(h.length-1, histIndex+1); input.value = h[histIndex] || ''; }
        e.preventDefault();
      }
    });
  }

  if(modal){
    modal.addEventListener('click', (e) => {
      if(e.target === modal) close();
    });
  }

  return { open, close, runCommand, setOS: (os)=>{ current = os; updatePrompt(); } };
})();

/* -------------------- TERMINAL TOGGLE CONTROL -------------------- */
(function terminalToggleControl(){
  const tbtns = document.querySelectorAll('#terminalToggle');
  let enabled = localStorage.getItem('terminalMode') || 'off';
  function applyUI(pref){
    tbtns.forEach(b => { if(b) b.textContent = pref === 'on' ? 'Terminal: On' : 'Terminal: Off'; });
    if(pref === 'on') document.documentElement.classList.add('terminal');
    else document.documentElement.classList.remove('terminal');
  }
  applyUI(enabled);

  tbtns.forEach(btn => {
    if(!btn) return;
    btn.addEventListener('click', () => {
      let newPref = localStorage.getItem('terminalMode') === 'on' ? 'off' : 'on';
      localStorage.setItem('terminalMode', newPref);
      applyUI(newPref);
      Sound.playClick();
      const path = location.pathname.toLowerCase();
      let os = 'kali';
      if(path.includes('parrot')) os = 'parrot';
      else if(path.includes('ubuntu')) os = 'ubuntu';
      else if(path.includes('kali')) os = 'kali';
      if(newPref === 'on'){ Terminal.open(os); }
      else { Terminal.close(); }
    });
  });
})();

/* -------------------- NAV TRANSITIONS -------------------- */
(function navTransitions(){
  document.querySelectorAll('a.navlink, a.btn, a.download').forEach(a=>{
    if(!a || !a.href) return;
    a.addEventListener('click', function(evt){
      const href = this.getAttribute('href');
      if(!href || href.startsWith('#') || href.startsWith('mailto:') || this.target==='_' || !isInternalLink(href)) return;
      if (this.hasAttribute('download')) return;
      evt.preventDefault();
      Sound.playNav();
      document.documentElement.classList.add('page-exit');
      setTimeout(()=>{ location.href = href; }, 380);
    });
  });
  window.addEventListener('load', ()=> document.documentElement.classList.remove('page-enter'));
})();

/* -------------------- CURSOR TRAIL -------------------- */
(function cursorTrail(){
  const container = document.getElementById('cursorTrail') || document.createElement('div');
  if(!document.getElementById('cursorTrail')){ container.id='cursorTrail'; document.body.appendChild(container); }
  const dots=[]; const total=12;
  for(let i=0;i<total;i++){ const d=document.createElement('div'); d.className='trail-dot'; d.style.opacity = String(1 - i*(1/total)); d.style.width = d.style.height = `${6 + (i*0.6)}px`; container.appendChild(d); dots.push({el:d,x:innerWidth/2,y:innerHeight/2}); }
  let mx=innerWidth/2, my=innerHeight/2; document.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; });
  (function animate(){ let x=mx,y=my; dots.forEach((dot,i)=>{ const lerp = 0.15 + i*0.02; dot.x += (x-dot.x)*lerp; dot.y += (y-dot.y)*lerp; dot.el.style.transform = `translate(${dot.x}px, ${dot.y}px)`; dot.el.style.opacity = String(0.9 - i*0.06); x = dot.x; y = dot.y; }); requestAnimationFrame(animate); })();
})();

/* -------------------- HERO + CARD PARALLAX -------------------- */
(function parallax(){
  const hero = document.querySelector('.hero-3d-box');
  const cards = document.querySelectorAll('.card3d');
  document.addEventListener('mousemove', e=>{
    const cx = innerWidth/2, cy = innerHeight/2;
    const px = (e.clientX - cx)/cx, py = (e.clientY - cy)/cy;
    if(hero) hero.style.transform = `rotateY(${px*10}deg) rotateX(${py*-10}deg)`;
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width/2))/r.width;
      const dy = (e.clientY - (r.top + r.height/2))/r.height;
      card.style.transform = `translateY(-10px) rotateX(${dy*10}deg) rotateY(${dx*-10}deg)`;
    });
  });
})();

