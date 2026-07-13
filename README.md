
Projet : Supervision Audio


Description de la SAÉ :
```
Le projet tutoré du module (par groupe de 3 personnes) porte sur la supervision de lecteurs audio multi-sites.

Contexte professionnel :
Dans certaines organisations (entreprises, collectivités, gares, campus…), des lecteurs audio diffusent en continu de
la musique, des messages publicitaires et des messages urgents.

Le système web devra permettre de :

-suivre l’état des lecteurs ;
-recevoir des remontées d’information ;
-consigner des événements de diffusion ;
-déclencher des alertes simples ;

Notre groupe a choisi de se basé sur le système de supervision de lecteurs audio dans les gares. Pour ce faire, nous
avons ciblé trois utilisateurs principaux de l'application:
-l'administrateur IT qui est chargé de faire la veille de l'application afin de s'assurer du bon fonctionnement de
toutes ses composantes
-le responsable retail qui s'occupe de la gestion des playlists qui passent dans les différentes gares selon un
calendrier précis
-le commercial qui fait passer les différentes alertes et annonces urgentes

Personnellement, j'étais en charge de la partie front de l'application, en m'assurant d'avoir un visuel accessible
 à tous les utilisateurs et ainsi de rendre beaucoup plus agréable l'expérience utilisateur.
Avec l'aide du framework Angular que j'ai appris en autonomie, j'ai utilisé les compétences de bases acquises afin
 de diviser toutes les parties en différentes composantes qui se complètent chacune gràaces aux importations
de classes. Les différentes pages sont relié à l'aide de routes que Angular nous permet de configurer plus facilement.
J'ai aussi mis en place le calendrier avec un système de glisser-déposer afin de pouvoir mettre les différentes
playlists dans le calendrier et aussi de pouvoir déterminer leurs durées en aggrandissant leurs blocs respectifs.
Grâce à l'utilisation de l'API de Volumio, nous avons pu récupérer les informations des morceaux en cours à savoir :
-la pochette des morceaux,
-le nom du morceaux, son auteur et le nom de la playlist en cours,
-les commandes play, pause, stop, volume
Cela m'a permis de configurer les boutons play et stop présents dans la colonne "Action" de la Supervision Technique
des Gares, et à mon collège Hani de pouvoir mettre en place le lecteur afin d'afficher la pochette du morceau ainsi que
le réglage du volume.

Ce projet a été une occasion pour moi d'apprendre l'utilisation du framework Angular, mais aussi à pouvoir exploiter les
informations reçues à travers un API 

```
Stack utilisée

```text
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

Ce projet a été réalisé avec [Angular CLI](https://github.com/angular/angular-cli) version 21.2.12.

```

Pour lancer le serveur de développement, faire :

```bash
ng serve
```
Projet tutoré réalisé par :

```
Fousseynou SIDIBÉ - Responsable base de données, login et distribution des rôles des utilisateurs
Hani ROULA - Responsable métier backend et du visuel du lecteur mp3
Clément SENE - Responsable frontend
