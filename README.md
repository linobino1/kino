# Remix-PayloadCMS Starter

Powered by [Remix](https://remix.run) and [PayloadCMS](https://payloadcms.com).

## Development

install the dependencies and generate the types:
```sh
yarn
yarn generate:types
```

Start the app in the dev environment:
```sh
yarn dev
```

OR:

```sh
docker compose up -d
```

## Production

First, build your app for production:

```sh
yarn build
```

Then run the app in production mode:

```sh
yarn start
```

## Migration

### Seed

To seed the database, run the following command in the docker container of the app:

```sh
yarn seed
# in development use yarn seed:dev
```

It will exexute the script `cms/seed/index.ts` which does:
- fill the countries collection with data from the restcountries.com api

### Database Export

On the machine where docker is running, run the following command to export the database to the `dump` folder.
The database connection string can be found in the docker compose file that is in use (maybe you are trying to migrate
from local dev to production, then see `docker-compose.dev.yaml`)

```sh
# get the container id of the db service with docker ps
docker exec -i <container> /usr/bin/mongodump --uri mongodb://db:27017/app --out /dump

# navigate to the dump folder, it should be a docker volume defined in the docker-compose file you are using
# if jenkins started the docker container, the dump folder should be in the jenkins workspace,
# e.g. /var/jenkins_home/workspace/<project_name>/dump
# you can find the path to the dump dir by running `docker inspect <container>` and looking for the volumes
cd path/to/dump

# zip the dump folder (it will be named like the database you are using)
zip -r dump.zip app

# dump.zip is your export
```

### Database Import

Copy the `dump.zip` file to the `dump` folder of the target machine where docker is running.
This could be done with iTerm or scp.

#### Example

If you want to migrate a local dev database to production, copy the `dump.zip` file to the production machine.
The location of the `dump` folder is defined in the docker-compose file you are using. If the volume is defined with a
relative path, it will be relative to the jenkins workspace.

```
# docker-compose.production.yaml
services:
    db:
        volumes:
            - ./dump:/dump
            
# docker-compose.deploy.yaml
services:
    jenkins:
        volumes:
            - /var/jenkins_home:/var/jenkins_home

# resulting path on the production machine:
/var/jenkins_home/workspace/<project_name>/dump
```

Upload the `dump.zip` file via scp to the production machine and unzip it into the `dump` folder:
```sh
# scp dump.zip to the production machine
# we could try to scp it to the jenkins workspace, but that would probably fail because of permissions
scp dump.zip myserver:dump.zip

# ssh into the production machine
ssh myserver

# unzip the dump.zip file
# you might need to install unzip first with sudo apt-get install unzip
unzip dump.zip

# move the dump folder to the dump folder of the docker volume
sudo mv app /var/jenkins_home/workspace/<project-name>/dump/

```

Import the dump:
```sh
# get the container id of the db service with docker ps
docker exec -i <container> /usr/bin/mongorestore -d app /dump/app

# `/dump/app` is the path to the exported database (the path should work inside the docker container)
# `-d app` is the database where the dump should be imported to
```

If you need to clear the database before importing the dump, you can do that with the following command:
```sh
docker exec -it <container> mongo
> use app
> db.dropDatabase()
```

### Media Import / Export

Zip the `media` folder and copy it to the target machine.

```sh
# navigate to the media folder
zip -r media.zip media

# copy the zip file to the target machine with scp / iTerm / ...
scp media.zip myserver:media.zip

# ssh into the target machine
ssh myserver

# unzip the media.zip file
unzip media.zip

# move all files from the media folder to the media folder of the docker volume
# check above example to see where the media folder is located if you are using jenkins
sudo mv media/* /var/jenkins_home/workspace/<project-name>/media/
```

Rebuild the project.

#### Regenerate Image Sizes

If you need to generate the image sizes again, you can do that with the following command:

```sh
yarn generate:images
```

Make sure you have an `.env` file with `PAYLOAD_SECRET` and `MONGODB_URI` defined.  
If you are using docker, just call the command inside the apps docker container.

## Deployment


### Requirements

A debian based linux server with a docker installation

### Setup

1. spin up jenkins and traefik

```bash
docker compose -f docker-compose.deploy.yaml up -d
```

1. open jenkins in browser `http://myserver:8080`

1. install suggested plugins

1. create admin user

1. generate ssh key without passphrase

```bash
ssh-keygen -t rsa -b 4096
```

1. add ssh key to github

    1. Dashboard > Settings > Deploy keys
    
    1. select `Add deploy key`
    
    1. enter some title

    1. enter public ssh key
    
    ```bash
    # show public key
    cat ~/.ssh/id_rsa.pub
    ```

1. add github.com host key to jenkins

    1. Dashboard > Manage Jenkins > Configure Global Security > Git Host Key Verification Configuration

    1. select `Manually provided keys`
    
    1. add github.com public keys from https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints
    
    ```
    github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl
    github.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=
    github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk=
    ```
    
    1. save

1. install jenkins plugin `Environment Injector Plugin`

1. create new pipeline job in jenkins by selecting `New Item` > `Pipeline`

1. configure some kind of strategy to discard old builds

1. select `Prepare an environment for the run`

    1. uncheck `Keep Jenkins Environment Variables`

    1. uncheck `Keep Jenkins Build Variables`

    1. paste your environment variables into `Properties Content` as if it was an `.env` file. Use `.env.example` as a template.
    
    1. create a username/password hash for the traefik dashboard and save the credentials somwhere
    ```sh
    # create a password
    openssl rand -hex 24

    # create a username/password hash
    htpasswd -nb <username> <password>
    
    # paste the output into TRAEFIK_DASHBOARD_AUTH env var
    ```

1. select `Pipeline script from SCM`

1. select `Git`

1. enter repository url

1. add ssh key to jenkins credentials by selecting `Add` and then `Jenkins` (if this is a public repo you can skip this step)

    1. select `SSH Username with private key`
    
    1. select scope `Global`
    
    1. leave `ID` empty

    1. enter filename or whatever as `Description`

    1. enter jenkins user name as `Username`

    1. enter private ssh key as `Private key` > `Enter directly`

    ```bash
    # show private key
    cat ~/.ssh/id_rsa
    ```
    
    1. enter passphrase for ssh key as `Passphrase`
    
    1. save

1. select `main` branch

1. save

### Webhook

The GitHub Plugin for Jenkins provides a webhook that can be used to trigger builds when a push event is received from GitHub.

1. in the jenkins job activate `Configure` > `Build Triggers` > `GitHub hook trigger for GITScm polling`

1. in the git repo add a webhook to `https://jenkins.example.com/github-webhook/` and select `Just the push event`

1. done.