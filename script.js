
// Funzionalità Bluetooth
const scanButton = document.getElementById('scan-button');
const unlockSection = document.getElementById('unlock-section');
const unlockButton = document.getElementById('unlock-button');
const connectedDeviceText = document.getElementById('connected-device');
const deviceList = document.getElementById('device-list');

let connectedDevice = null;
let server = null;

scanButton.addEventListener('click', async () => {
    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['generic_access'] // Usare il servizio appropriato per il monopattino
        });
        
        connectedDevice = device;
        const listItem = document.createElement('li');
        listItem.textContent = `Dispositivo trovato: ${device.name || 'Sconosciuto'}`;
        deviceList.appendChild(listItem);

        // Connessione al dispositivo
        server = await device.gatt.connect();
        listItem.textContent += ' - Connesso';

        connectedDeviceText.textContent = `Dispositivo connesso: ${device.name || 'Sconosciuto'}`;
        unlockSection.style.display = 'block';
    } catch (error) {
        console.error('Errore Bluetooth:', error);
    }
});

unlockButton.addEventListener('click', async () => {
    if (connectedDevice && server) {
        try {
            // Azione per "sbloccare" (invio comando generico al monopattino)
            const service = await server.getPrimaryService('generic_access');
            const characteristic = await service.getCharacteristic('write'); // Caratteristica di scrittura
            
            // Esempio di comando per sbloccare (byte array)
            const unlockCommand = new Uint8Array([0x01, 0x02, 0x03]); // Modifica secondo il protocollo
            await characteristic.writeValue(unlockCommand);

            alert('Monopattino sbloccato e pronto all'uso!');
        } catch (error) {
            console.error('Errore nello sblocco:', error);
            alert('Errore nello sblocco del monopattino!');
        }
    } else {
        alert('Nessun dispositivo connesso!');
    }
});
