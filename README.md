# NODE rpi-led-rgb-matrix

La pagina del server principale è -> [/](http://10.201.0.11/) <- nella quale ci sono 2 bottoni che portano a due pagine:

* Una da all'utente la possibilità di inserire il proprio testo, scegliere il colore, scegliere la luminosità e impostare la velocità con cui il testo verrà fatto scorrere per le 4 matrici di led collegate al Raspberry.

* Invece l'altra pagina permette di inserire un quante immagini si vuole le quali saranno unite tra loro per formare un unica immagine che verrà fatta scorrere. Le immagini possono essere lunghe quanto si vuole ma se la loro altezza sarà maggiore di 32 pixel le immagini saranno tagliate in modo tale da rendere le immagini alte 32 pixel.

## Installazione

* Eseguire il comando:
   ```bash
   git clone https://github.com/ArcaneDiver/NODE_rpi-led-rgb-matrix
   cd NODE_rpi-led-rgb-matrix
    ```

## Avvio

L'utilizzo è il seguente:

* Per far partire il server:
  ```bash
  sudo nodejs index.js
  ```


#
Michele Della Mea
