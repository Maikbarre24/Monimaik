document.getElementById('scan-btn').addEventListener('click', function () {
    const qrReader = document.getElementById('qr-reader');
    qrReader.style.display = 'block';
    
    const html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
            alert(`Monopattino sbloccato: ${decodedText}`);
            html5QrCode.stop();
        },
        (errorMessage) => {
            console.error(errorMessage);
        }
    ).catch(err => console.error(err));
});
