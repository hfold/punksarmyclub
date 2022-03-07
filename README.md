### INIZIALIZZAZIONE E INSTALLAZIONE DIPENDENZE

- Fare il clone del progetto
- Lanciare il comando `yarn` dalla root del progetto

### DEPLOY PRODUZIONE

- Lanciare il comando `yarn build`
- Esporre la cartella build sul webserver
- Creare file env.js nella cartella build copiando il contenuto del file env.sample
- Editare il file build/env.js con i parametri del proprio ambiente


### DEVELOPMENT

- Creare file env.js nella cartella public copiando il contenuto del file public/env.sample
- Editare il file public/env.js con i parametri del proprio ambiente
- Lanciare il comando `yarn start`




### STACKING

Aggiungere in env.js

- window.STACKING = true
- window.TOKEN_CONTRACT = 'ST1HA10B13YSF47JXWGJCVNF94QPZ3GWWYSCZDDSS.romatoken'
- window.STACKING_CONTRACT = 'ST1HA10B13YSF47JXWGJCVNF94QPZ3GWWYSCZDDSS.stacker'
- window.RARITY_CONTRACT = 'ST1HA10B13YSF47JXWGJCVNF94QPZ3GWWYSCZDDSS.rarity'


#### Impostare le rarities
- Aprire a url #/rarity
- Aggiungere le rarities usando il json precendente, nel campo collection ci deve essere il contratto: {address}.{nome contratto}


#### Aggiungere il minter al token

- aprire la url #/token
- andare in minter contracts e inserire il contratto dello stacking tra i minter, nel formato {address}.{nome contratto}


#### Aggiungere le collection allo stacking

- aprire la url #/stacking
- andare in collections e inserire i dati della collezione che si vuole abilitare sempre col nome {address}.{nome contratto}




