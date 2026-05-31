export class Station{
    id !: number;
    nom !: string;
    adresseIp !: string;
    etat !: 'online' | 'offline';
    version ?: string;
    lastPing ?: Date;
    currentSource?: 'server' | 'local';
    currentPlaylist ?: string;
}