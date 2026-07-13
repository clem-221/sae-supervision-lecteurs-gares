
Projet : Supervision Audio
```text
Stack utilisée
Frontend : typescript/HTML/CSS/ANGULAR
Backend : PYTHON/PHP/VOLUMIO et SNAPCAST (SNAPSERVER et SNAP CLIENT)

```text
[ Front-End ]
      |
      |
      V
[ Appareil MASTER ]---------------------(snapclient)---------- [ Appareil Client 1 ] (Volumio )
  (Volumio-snapserver)                  |
                                        |
                                        |----(snapclient)------- [ Appareil Client 2 ] (Volumio )



configuration de snapcast : 
1-sur la machiner master : ssh@volumio.(add_ip_volumio_qu'ontrouve_sur_reseau)

sudo apt-get update
sudo apt-get install snapserver

sudo nano /volumio/app/plugins/music_service/mpd/mpd.conf.tmpl
audio_output {
    type            "fifo"
    name            "Snapcast Pipe"
    path            "/tmp/snapfifo"
    format          "48000:16:2"
    mixer_type      "software"
}

sudo nano /etc/snapserver.conf
source = pipe:///tmp/snapfifo?name=default
doc_root = /usr/share/snapserver/snapweb/

sudo systemctl restart mpd
sudo systemctl restart snapserver

2-toutes les machines clientes : 
sudo apt-get update
sudo apt-get install snapclient

désactivé le snapserver si il est installé : sudo systemctl disable --now snapserver
sudo nano /etc/default/snapclient
SNAPCLIENT_OPTS="-h IP_volumio_qu'on_trouve_sur_reseau"

sudo systemctl restart snapclient


# ApplicationGestionLecteursAudio

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.12.

```

Pour lancer le serveur de développement, faire :

```bash
ng serve
