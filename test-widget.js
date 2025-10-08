// Alec ChatBot Widget - External Test Logic

const WEBHOOK = 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a';

let widgetInstance = null;

function addDebug(message, type = 'info') {
	const c = document.getElementById('debug-console');
	if (!c) return;
	const div = document.createElement('div');
	div.className = `status ${type}`;
	div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
	c.appendChild(div);
	c.scrollTop = c.scrollHeight;
}

function clearConsole() {
	const c = document.getElementById('debug-console');
	if (c) c.innerHTML = '';
}

// ——————— Sanity test ———————
function testWidget() {
	try {
		widgetInstance = new (window.AlecChatBot.default || window.AlecChatBot)({
			webhookUrl: WEBHOOK,
			features: { resizable: true, typingAnimation: true, connectionStatus: true, autoOpen: false },
		});
		widgetInstance.init();
		window.chatbotInstance = widgetInstance;
		document.getElementById('status').innerHTML = '<div class="status success">✅ Widget initialized</div>';
		addDebug('Widget initialized');
		setTimeout(testWebSocket, 1500);
	} catch (err) {
		document.getElementById('status').innerHTML = '<div class="status error">❌ Init failed</div>';
		addDebug('Init failed: ' + err.message, 'error');
	}
}

function testWebSocket() {
	if (!widgetInstance) { addDebug('Init first', 'error'); return; }
	const ws = widgetInstance.ws;
	const connected = widgetInstance.wsConnected;
	if (ws && ws.url) {
		addDebug('WS URL: ' + ws.url);
		if (ws.url.includes('/ws/')) addDebug('✅ Correct WS path', 'success');
		if (ws.url.includes(':8080')) addDebug('❌ Wrong WS port in URL', 'error');
	}
	addDebug(connected ? '✅ WS connected' : '❌ WS not connected', connected ? 'success' : 'error');
}

// ——————— Code generators (escape </script> as <\/script> for inline safety) ———————
function genMethod1() {
	return (
`<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"><\/script>
<script>
  const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({
    webhookUrl: '${WEBHOOK}'
  });
  chatbot.init();
<\/script>`
	);
}
function genMethod2() {
	return (
`<script src="https://chat.alecasgari.com/widget.iife.js"><\/script>
<script>
  (new (window.AlecChatBot.default || window.AlecChatBot)({ webhookUrl: '${WEBHOOK}' })).init();
<\/script>`
	);
}
function genMethod3() {
	const color = document.getElementById('m3-color').value;
	const position = document.getElementById('m3-position').value;
	const title = document.getElementById('m3-title').value;
	const placeholder = document.getElementById('m3-placeholder').value;
	return (
`<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"><\/script>
<script>
  const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({
    webhookUrl: '${WEBHOOK}',
    theme: { primaryColor: '${color}', position: '${position}', title: '${title}', placeholder: '${placeholder}' },
    features: { resizable: true, typingAnimation: true, connectionStatus: true, autoOpen: false },
    callbacks: {
      onMessage: (m) => console.log('sent', m),
      onOpen: () => console.log('open'),
      onClose: () => console.log('close'),
      onError: (e) => console.error('error', e)
    }
  });
  chatbot.init();
<\/script>`
	);
}
function genMethod4() {
	const color = document.getElementById('m4-color').value;
	const position = document.getElementById('m4-position').value;
	const title = document.getElementById('m4-title').value;
	const placeholder = document.getElementById('m4-placeholder').value;
	return (
`<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"><\/script>
<script>
  const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({
    webhookUrl: '${WEBHOOK}',
    theme: { primaryColor: '${color}', position: '${position}', title: '${title}', placeholder: '${placeholder}' }
  });
  chatbot.init();
<\/script>`
	);
}
function genMethod5() {
	return (
`<script src="https://chat.alecasgari.com/widget.iife.js"><\/script>
<script>
  const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({
    webhookUrl: '${WEBHOOK}',
    features: { autoOpen: true }
  });
  chatbot.init();
<\/script>`
	);
}
function genMethod6() {
	return (
`<script src="https://chat.alecasgari.com/widget.iife.js"><\/script>
<script>
  const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({ webhookUrl: '${WEBHOOK}' });
  chatbot.init();
  // later: chatbot.open(); chatbot.close();
<\/script>`
	);
}

function renderMethod(n) {
	const el = document.getElementById('code-' + n);
	const map = {1:genMethod1,2:genMethod2,3:genMethod3,4:genMethod4,5:genMethod5,6:genMethod6};
	el.textContent = map[n]();
}

async function copyMethod(n) {
	const el = document.getElementById('code-' + n);
	// تبدیل <\/script> به </script> فقط هنگام کپی
	const text = el.textContent.replaceAll('<\\/script>', '</script>');
	await navigator.clipboard.writeText(text);
	setStatus(n, '✅ Copied', 'success');
	setTimeout(() => setStatus(n, ''), 1500);
}

function testMethod(n) {
	try {
		if (n === 1) {
			const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({ webhookUrl: WEBHOOK });
			chatbot.init();
			window.chatbotInstance = chatbot;
		}
		if (n === 2) {
			(new (window.AlecChatBot.default || window.AlecChatBot)({ webhookUrl: WEBHOOK })).init();
		}
		if (n === 3) {
			const color = document.getElementById('m3-color').value;
			const position = document.getElementById('m3-position').value;
			const title = document.getElementById('m3-title').value;
			const placeholder = document.getElementById('m3-placeholder').value;
			const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({
				webhookUrl: WEBHOOK,
				theme: { primaryColor: color, position, title, placeholder },
				features: { resizable: true, typingAnimation: true, connectionStatus: true, autoOpen: false },
			});
			chatbot.init();
			window.chatbotInstance = chatbot;
		}
		if (n === 4) {
			const color = document.getElementById('m4-color').value;
			const position = document.getElementById('m4-position').value;
			const title = document.getElementById('m4-title').value;
			const placeholder = document.getElementById('m4-placeholder').value;
			const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({
				webhookUrl: WEBHOOK,
				theme: { primaryColor: color, position, title, placeholder },
			});
			chatbot.init();
			window.chatbotInstance = chatbot;
		}
		if (n === 5) {
			const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({ webhookUrl: WEBHOOK, features: { autoOpen: true } });
			chatbot.init();
			window.chatbotInstance = chatbot;
		}
		if (n === 6) {
			const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({ webhookUrl: WEBHOOK });
			chatbot.init();
			window.chatbotInstance = chatbot;
		}
		setStatus(n, '✅ Loaded. Check bottom-right.', 'success');
	} catch (e) {
		setStatus(n, '❌ Error: ' + e.message, 'error');
	}
}

function openProgrammatically() {
	if (window.chatbotInstance && window.chatbotInstance.open) {
		window.chatbotInstance.open();
	}
}

function setStatus(n, text = '', cls = '') {
	const el = document.getElementById('status-' + n);
	if (!el) return;
	el.className = 'status ' + (cls || '');
	el.textContent = text;
}

window.addEventListener('load', () => {
	addDebug('Ready. Render Method 1 by default.');
	renderMethod(1);
});
