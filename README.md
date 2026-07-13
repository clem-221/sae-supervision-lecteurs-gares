```text

Projet : Supervision Audio

Stack utilisée


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

Notre groupe a choisi de se baser sur un système de supervision de lecteurs audio dans les gares. Pour ce faire, nous
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
Stacks utilisés

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

désactiver le snapserver si il est installé : sudo systemctl disable --now snapserver
sudo nano /etc/default/snapclient
SNAPCLIENT_OPTS="-h IP_volumio_qu'on_trouve_sur_reseau"

sudo systemctl restart snapclient

# ApplicationGestionLecteursAudio

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.12.

## Development server

To start a local development server, run:

```

Pour lancer le serveur de développement, faire :

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# SAE Supervision Lecteur mp3



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.sorbonne-paris-nord.fr/devteampasserelle/sae-supervision-lecteur-mp3.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.sorbonne-paris-nord.fr/devteampasserelle/sae-supervision-lecteur-mp3/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
=======
Projet tutoré réalisé par :

```
Fousseynou SIDIBÉ - Responsable base de données, login et distribution des rôles des utilisateurs
Hani ROULA - Responsable métier backend et du visuel du lecteur mp3
Clément SENE - Chef de projet et responsable frontend
>>>>>>> 9a00b79ff73de63f1b4e224cf0857554c75f0229
