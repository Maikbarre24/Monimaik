let connectedDevice = null;
const unlockCodes = [
    "IB12A03447", "CE127BE0A43B", "6b55f8efb85037d4748da079e7efca55",
    "IE12G00444", "C1D3E5B65298", "4543b7b5635391df323d233698ac42bf",
    "IE12H12508", "E6D03CAEB73F", "6e036ccfddea27384e939283b9fc405c",
    "34E1200197", "E4BC1C630FD6", "a8ad7202300fd1c8e4cf2b0a429315fa",
    "IE12F00685", "F5BE46F33A40", "bc5cacf01096935972af2563c8a6a526",
    "39E1200957", "F24A8C31DB08", "9ec087a247cbd9350453b0064babcb0b",
    "39E1200814", "EC418F180C9A", "6ed0509b878b2f0cb8e788c27ef79ecc",
    "IE12H02028", "C00C74C29563", "c0e17b4f6aa921ac97a3d49d0cd70bf1"
];

// Funzione per tentare lo sblocco tramite Bluetooth
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
        tryUnlockBluetooth(device);
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

// Funzione per sbloccare tramite Bluetooth, prova i codici
async function tryUnlockBluetooth(device) {
    const status = document.getElementById('status');
    for (let code of unlockCodes) {
        status.textContent = `Tentativo di sblocco con il codice: ${code}`;
        // Simula il comando di sblocco con il codice
        await simulateUnlockCode(code);
        break;  // Una volta trovato un codice valido, fermati
    }
}

// Funzione per simulare lo sblocco con un codice QR
function handleQRCode(scannedCode) {
    const status = document.getElementById('status');
    status.textContent = `QR Code scansionato: ${scannedCode}. Tentando lo sblocco...`;

    // Prova il codice QR
    for (let code of unlockCodes) {
        if (scannedCode === code) {
            status.textContent = `Monopattino sbloccato con il QR Code! Codice: ${scannedCode}`;
            break;
        }
    }
}

// Configura la scansione del QR Code
document.getElementById('start-qr-btn').addEventListener('click', function() {
    document.getElementById('qr-reader').style.display = 'block';
    
    const html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start(
        { facingMode: "environment" },  // Fotocamera posteriore
        { fps: 10, qrbox: 250 },
        function(decodedText, decodedResult) {
            handleQRCode(decodedText);  // Codice QR scansionato
            html5QrCode.stop();
        },
        function(errorMessage) {
            console.error(errorMessage);  // Log degli errori
        }
    ).catch(err => {
        console.error("Errore durante la scansione del QR:", err);
    });
});
