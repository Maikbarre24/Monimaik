
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


// Funzione per connettersi a un dispositivo Bluetooth
async function connectBluetooth() {
    try {
        console.log("Ricerca di dispositivi Bluetooth...");
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service']
        });
        console.log("Dispositivo selezionato:", device.name);
        const server = await device.gatt.connect();
        console.log("Connesso al dispositivo:", device.name);
        
        // Lettura del livello della batteria (esempio)
        const service = await server.getPrimaryService('battery_service');
        const characteristic = await service.getCharacteristic('battery_level');
        const value = await characteristic.readValue();
        const batteryLevel = value.getUint8(0);
        console.log("Livello della batteria:", batteryLevel + "%");
        
        return device;
    } catch (error) {
        console.error("Errore durante la connessione Bluetooth:", error);
    }
}

// Aggiunge un pulsante per attivare il Bluetooth
document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.textContent = "Connetti via Bluetooth";
    button.onclick = connectBluetooth;
    document.body.appendChild(button);
});
