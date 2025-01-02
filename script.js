let connectedDevice = null;

document.getElementById('connect-btn').addEventListener('click', async () => {
    const status = document.getElementById('status');
    status.textContent = "Ricerca dispositivo Bluetooth...";

    try {
        // Connessione al dispositivo Bluetooth
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service'] // Servizio che simula il monopattino
        });

        connectedDevice = device;
        status.textContent = `Connesso a: ${device.name}`;
        
        // Abilita il pulsante di sblocco
        document.getElementById('unlock-btn').disabled = false;

    } catch (error) {
        status.textContent = `Errore nella connessione: ${error.message}`;
    }
});

document.getElementById('unlock-btn').addEventListener('click', async () => {
    if (!connectedDevice) {
        alert('Nessun dispositivo connesso!');
        return;
    }

    const status = document.getElementById('status');
    status.textContent = "Invio comando di sblocco...";

    try {
        // Connessione GATT al dispositivo Bluetooth
        const server = await connectedDevice.gatt.connect();

        // Esegui l'operazione di sblocco (questa parte dipende dal dispositivo Bluetooth)
        // Simuliamo una "lettura" della batteria per confermare l'interazione
        const service = await server.getPrimaryService('battery_service');
        const characteristic = await service.getCharacteristic('battery_level');
        const value = await characteristic.readValue();
        const batteryLevel = value.getUint8(0);

        status.textContent = `Monopattino sbloccato! Batteria: ${batteryLevel}%`;

        // Disconnessione
        connectedDevice.gatt.disconnect();

    } catch (error) {
        status.textContent = `Errore: ${error.message}`;
    }
});
