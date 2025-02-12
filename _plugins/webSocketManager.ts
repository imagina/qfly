import { useMapStore } from '../components/flightMap/store/useMapStore'
import { store } from 'src/plugins/utils'

class WebSocketManager {
    private socket: WebSocket | null = useMapStore().getWebsocketConnection();
    private isConnected: boolean = false;

    connect(routeWS: string) {
        const userToken = store.state.quserAuth.userToken;

        if (!userToken) {
            console.error('User token is undefined.');
            return null;
        }

        const token = userToken.slice(7);

        if (this.isConnected) {
            console.warn('Connection is already open.');
            return this.socket;
        }

        if (this.socket) return this.socket;

        this.socket = new WebSocket(`${routeWS}?token=${token}`);

        this.socket.addEventListener('open', () => {
            this.isConnected = true;
        });

        this.socket.addEventListener('error', (event: Event) => {
            console.error('error', event);
        });

        useMapStore().setWebsocketConnection(this.socket);

        return this.socket;
    }

    close() {
        setTimeout(() => {
            if (this.socket) {
                this.socket.close();
                this.socket.addEventListener('close', (event: CloseEvent) => {
                    console.log('close', event);
                    this.socket = null;
                    this.isConnected = false;
                    useMapStore().setWebsocketConnection(null);
                });
            }
        }, 700)
    }

    addEventListener(event: string, callback) {
        if (this.socket) {
            this.socket.addEventListener(event, callback);
        }
    }

    isConnect() {
        return this.isConnected;
    }
}

export { WebSocketManager };
