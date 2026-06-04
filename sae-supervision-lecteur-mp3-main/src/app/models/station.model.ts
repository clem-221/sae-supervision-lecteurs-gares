export class Station{
    id !: number;
    nom !: string;
    adresseIp !: string;
    etat !: 'online' | 'offline';
    status ?:  "play" | "pause" | "stop" | 'loading';
    version ?: string;
    lastPing ?: Date;
    currentSource?: 'server' | 'local';
    currentPlaylist ?: string;
    trackType?: string;
}