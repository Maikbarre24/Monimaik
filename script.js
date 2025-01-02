document.getElementById('unlock-btn').addEventListener('click', async () => {
    const status = document.getElementById('status');
    status.textContent = "Ricerca dispositivo Bluetooth...";

    try {
        // Richiede la connessione a un dispositivo Bluetooth con un servizio specifico
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true, // Puoi limitare i dispositivi con filters
            optionalServices: ['battery_service'] // ID del servizio richiesto
        });

        status.textContent = `Connesso a: ${device.name}`;
        
        // Connessione GATT (Generic Attribute Profile)
        const server = await device.gatt.connect();

        // Esempio: leggere il livello della batteria
        const service = await server.getPrimaryService('battery_service');
        const characteristic = await service.getCharacteristic('battery_level');
        const value = await characteristic.readValue();
        const batteryLevel = value.getUint8(0);
        status.textContent = `Batteria: ${batteryLevel}% - Monopattino Sbloccato!`;

        // Disconnessione
        device.gatt.disconnect();
    } catch (error) {
        status.textContent = `Errore: ${error.message}`;
    }
});
