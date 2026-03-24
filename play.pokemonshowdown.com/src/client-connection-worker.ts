declare const SockJS: any;
import type { ServerInfo } from "./client-main";

let socket: WebSocket | null = null;
let serverInfo: ServerInfo;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let keepAliveInterval: ReturnType<typeof setInterval> | null = null;
let queue: string[] = [];

// Render fecha conexões WebSocket ociosas em ~90s; enviamos ping a cada 50s
const KEEP_ALIVE_MS = 50 * 1000;

function clearKeepAlive() {
	if (keepAliveInterval) {
		clearInterval(keepAliveInterval);
		keepAliveInterval = null;
	}
}

self.onmessage = (event: MessageEvent) => {
	const { type, server, data } = event.data;
	if (type === 'connect') {
		serverInfo = server;
		connectToServer();
	} else if (type === 'send') {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(data);
		} else {
			queue.push(data);
		}
	} else if (type === 'disconnect') {
		clearKeepAlive();
		if (socket) socket.close();
		if (reconnectTimeout) clearTimeout(reconnectTimeout);
		socket = null;
	}
};

function connectToServer() {
	if (!serverInfo) return;

	const port = serverInfo.protocol === 'https' ? '' : `:${serverInfo.port}`;
	const url = `${serverInfo.protocol}://${serverInfo.host}${port}${serverInfo.prefix}`;

	try {
		socket = new SockJS(url, [], { timeout: 5 * 60 * 1000 });
	} catch {
		socket = new WebSocket(url.replace('http', 'ws') + '/websocket');
	}
	if (socket) {
		socket.onopen = () => {
			postMessage({ type: 'connected' });
			for (const msg of queue) socket?.send(msg);
			queue = [];

			// mantém o WebSocket vivo contra o timeout de inatividade do Render
			clearKeepAlive();
			keepAliveInterval = setInterval(() => {
				if (socket && socket.readyState === WebSocket.OPEN) {
					socket.send('|/ping');
				}
			}, KEEP_ALIVE_MS);
		};

		socket.onmessage = (e: MessageEvent) => {
			postMessage({ type: 'message', data: e.data });
		};

		socket.onclose = () => {
			clearKeepAlive();
			postMessage({ type: 'disconnected' });
		};

		socket.onerror = (err: Event) => {
			clearKeepAlive();
			postMessage({ type: 'error', data: (err as any).message || '' });
			socket?.close();
		};
		return;
	}
	return postMessage({ type: 'error' });
}
