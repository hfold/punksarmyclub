# DEPLOYMENT

# INIZIALIZZAZIONE E INSTALLAZIONE DIPENDENZE

- Fare il clone del progetto
- Lanciare il comando `yarn` dalla root del progetto

# DEPLOY PRODUZIONE

- Lanciare il comando `yarn build`
- Esporre la cartella build sul webserver
- Creare file env.js nella cartella build copiando il contenuto del file env.sample
- Editare il file build/env.js con i parametri del proprio ambiente


# DEVELOPMENT

- Creare file env.js nella cartella public copiando il contenuto del file public/env.sample
- Editare il file public/env.js con i parametri del proprio ambiente
- Lanciare il comando `yarn start`