// Variabili globali
let device;
let server;
let service;
let characteristic;
let statusElement = document.getElementById('status');
let connectButton = document.getElementById('connectButton');
let unlockButton = document.getElementById('unlockButton');
let bikeList = document.getElementById('bikeList');

connectButton.addEventListener('click', async () => {
    try {
        // Scansione per dispositivi Bluetooth (Monopattino)
        statusElement.textContent = "Stato: In cerca del monopattino...";
        device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['battery_service'] }] // Aggiungi il servizio del monopattino qui
        });


// Dati dei monopattini (presumibilmente provenienti dal file TOT_BIKES.txt)
const bikes = [
    { id: "Monopattino 1", mac: "00:11:22:33:44:55", code: "12345" },
    { id: "Monopattino 2", mac: "66:77:88:99:AA:BB", code: "67890" },
    // Aggiungi altri monopattini qui
];

// Popolare la lista dei monopattini
bikes.forEach(bike => {
    let option = document.createElement("option");
    option.value = bike.mac;
    option.textContent = bike.id;
    bikeList.appendChild(option);
});

// Pulsante di connessione
connectButton.addEventListener('click', async () => {
    const selectedBikeMac = bikeList.value;
    if (!selectedBikeMac) {
        statusElement.textContent = "Seleziona un monopattino.";
        return;
    }

    try {
        // Scansione per dispositivi Bluetooth (Monopattino)
        statusElement.textContent = "Stato: In cerca del monopattino...";
        device = await navigator.bluetooth.requestDevice({
            filters: [{ devices: [{ name: selectedBikeMac }] }] // Filtro per il MAC address
        });

        // Connessione al dispositivo
        statusElement.textContent = "Stato: Connessione al monopattino...";
        server = await device.gatt.connect();
        service = await server.getPrimaryService('battery_service'); // Sostituisci con il servizio effettivo
        characteristic = await service.getCharacteristic('battery_level'); // Sostituisci con la caratteristica effettiva

        // Abilitare il pulsante di sblocco
        unlockButton.disabled = false;
        statusElement.textContent = "Stato: Connesso al monopattino";
    } catch (error) {
        console.log(error);
        statusElement.textContent = "Stato: Errore durante la connessione";
    }
});

// Pulsante di sblocco
unlockButton.addEventListener('click', async () => {
    const selectedBikeMac = bikeList.value;
    if (!selectedBikeMac) {
        statusElement.textContent = "Seleziona un monopattino.";
        return;
    }

    try {
        // Codice di sblocco (simulazione del comando)
        const selectedBike = bikes.find(bike => bike.mac === selectedBikeMac);
        const encoder = new TextEncoder();
        const command = encoder.encode(selectedBike.code);  // Usando il codice del monopattino
        await characteristic.writeValue(command);
        statusElement.textContent = "Stato: Monopattino Sbloccato!";
    } catch (error) {
        console.log(error);
        statusElement.textContent = "Stato: Errore durante il comando";
    }
});
