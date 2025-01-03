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

// Connessione Bluetooth
document.getElementById('connect-btn').addEventListener('click', async () => {
    const status = document.getElementById('status');
    status.textContent = "Ricerca dispositivo Bluetooth...";

    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service']
        });

        connectedDevice = device;
        status.textContent = `Connesso a: ${device.name}`;
        document.getElementById('unlock-btn').disabled = false;

        tryUnlockBluetooth(); // Prova a sbloccare il monopattino tramite Bluetooth
    } catch (error) {
        status.textContent = `Errore nella connessione: ${error.message}`;
    }
});

// Sbloccare il monopattino tramite Bluetooth
document.getElementById('unlock-btn').addEventListener('click', async () => {
    if (!connectedDevice) {
        alert('Nessun dispositivo connesso!');
        return;
    }

    const status = document.getElementById('status');
    status.textContent = "Sblocco in corso...";

    try {
        await tryUnlockBluetooth();
        status.textContent = "Monopattino sbloccato! Puoi usarlo.";
        document.getElementById('unlock-btn').disabled = true; // Disabilita il pulsante dopo lo sblocco
    } catch (error) {
        status.textContent = `Errore: ${error.message}`;
    }
});

// Funzione per tentare lo sblocco tramite Bluetooth con i codici
async function tryUnlockBluetooth() {
    const status = document.getElementById('status');
    for (let code of unlockCodes) {
        status.textContent = `Tentativo di sblocco con il codice: ${code}`;
        const isUnlocked = await simulateUnlockCode(code);
        if (isUnlocked) {
            status.textContent = `Monopattino sbloccato con il codice: ${code}`;
            return;
        }
    }
    status.textContent = "Codici non validi. Riprova.";
}

// Simula l'invio del codice di sblocco
function simulateUnlockCode(code) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simula il successo di uno dei codici
            if (unlockCodes.includes(code)) {
                resolve(true);
            } else {
                resolve(false);
            }
        }, 1000); // Ritardo di 1 secondo per simulare il comando
    });
}

// Funzione per gestire la scansione del QR Code
function handleQRCode(scannedCode) {
    const status = document.getElementById('qr-status');
    status.textContent = `QR Code scansionato: ${scannedCode}. Tentando lo sblocco...`;

    // Prova tutti i codici QR scansionati
    for (let code of unlockCodes) {
        if (scannedCode === code) {
            status.textContent = "Monopattino sbloccato con il QR Code! Puoi usarlo.";
            return;
        }
    }
    status.textContent = "Codice QR non valido.";
}

// Avvia la scansione del QR Code
document.getElementById('start-qr-btn').addEventListener('click', function() {
    document.getElementById('qr-reader').style.display = 'block';
    const html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start(
        { facingMode: "environment" }, // Usa la fotocamera posteriore
        { fps: 10, qrbox: 250 },
        function(decodedText, decodedResult) {
            handleQRCode(decodedText); // Codice QR scansionato
            html5QrCode.stop(); // Ferma la scansione dopo la lettura
        },
        function(errorMessage) {
            console.error(errorMessage);
        }
    ).catch(err => {
        console.error("Errore durante la scansione del QR:", err);
    });
});
