let device; // Dispositivo Bluetooth connesso
let server; // Server GATT
let service; // Servizio Bluetooth
let characteristic; // Caratteristica per inviare comandi

// Elementi del DOM
const connectButton = document.getElementById('connectButton');
const coffeeOptions = document.getElementById('coffeeOptions');
const statusDiv = document.getElementById('status');
const notificationDiv = document.getElementById('notification');

// Funzione per connettersi alla macchina del caffè
connectButton.addEventListener('click', async () => {
    try {
        console.log('Cerco dispositivi Bluetooth...');
        device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['battery_service'] }], // Sostituisci con il servizio corretto
            optionalServices: ['generic_access'] // Aggiungi i servizi necessari
        });

        console.log('Connesso a:', device.name);
        statusDiv.textContent = `Stato: Connesso a ${device.name}`;
        connectButton.disabled = true;
        coffeeOptions.style.display = 'block';

        // Connetti al server GATT
        server = await device.gatt.connect();
        service = await server.getPrimaryService('battery_service'); // Sostituisci con il servizio corretto
        characteristic = await service.getCharacteristic('battery_level'); // Sostituisci con la caratteristica corretta

        // Ascolta la disconnessione
        device.addEventListener('gattserverdisconnected', onDisconnected);
    } catch (error) {
        console.error('Errore di connessione:', error);
        statusDiv.textContent = 'Errore di connessione. Riprova.';
    }
});

// Funzione per gestire la disconnessione
function onDisconnected() {
    console.log('Dispositivo disconnesso.');
    statusDiv.textContent = 'Stato: Disconnesso';
    connectButton.disabled = false;
    coffeeOptions.style.display = 'none';
    device = null;
}

// Funzione per inviare comandi alla macchina del caffè
coffeeOptions.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON') {
        const command = event.target.getAttribute('data-command');
        try {
            console.log(`Invio comando: ${command}`);
            await characteristic.writeValue(new TextEncoder().encode(command));
            showNotification(`☕ ${command} in arrivo!`);
        } catch (error) {
            console.error('Errore:', error);
            showNotification('Errore durante l\'invio del comando.');
        }
    }
});

// Funzione per mostrare notifiche
function showNotification(message) {
    notificationDiv.textContent = message;
    notificationDiv.classList.add('visible');
    setTimeout(() => {
        notificationDiv.classList.remove('visible');
    }, 3000);
}