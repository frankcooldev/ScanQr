// webcam set
Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 100,
    constraints: {
        facingMode: "environment" // fotocamera posteriore (di defautl prende quella frontale)
    }
});
Webcam.attach('#camera');

// scanqr
function scanQRCode() {
    Webcam.snap(function(dataUri) {
        // convert base64 foto in binario
        let image = new Image();
        image.src = dataUri;
        image.onload = function() {
            let canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            let context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            let code = jsQR(imageData.data, imageData.width, imageData.height);

            let resultDiv = document.getElementById('result');

            if (code) {
                // get qr_id
                const qrData = code.data;
                try {
                    const url = new URL(qrData);
                    const qr_id = url.searchParams.get('qr_id');

                    if (qr_id) {
                        // chiama page.php con id
                        axios.post('page.php', new URLSearchParams({
                            qr_id: qr_id
                        }))
                        .then(function (response) {
                            resultDiv.innerText = response.data.message;
                            resultDiv.classList.remove('alert-info');

                            if (response.data.status === 'success') {
                                resultDiv.classList.add('alert-success');
                            } else if (response.data.status === 'error') {
                                resultDiv.classList.add('alert-danger');
                            } else {
                                resultDiv.classList.add('alert-warning');
                            }
                        })
                        .catch(function (error) {
                            console.error(error);
                            resultDiv.innerText = 'Errore nella verifica del QR code.';
                            resultDiv.classList.remove('alert-info');
                            resultDiv.classList.add('alert-danger');
                        });
                    } else {
                        resultDiv.innerText = 'QR code non valido.';
                        resultDiv.classList.remove('alert-info');
                        resultDiv.classList.add('alert-danger');
                    }
                } catch (e) {
                    console.error(e);
                    resultDiv.innerText = 'Formato del QR code non valido.';
                    resultDiv.classList.remove('alert-info');
                    resultDiv.classList.add('alert-danger');
                }
            } else {
                // nessun QR code trovato, continua a scansionare
                resultDiv.innerText = 'Nessun QR code rilevato. Inquadra un QR code con la fotocamera.';
                resultDiv.classList.remove('alert-danger', 'alert-success');
                resultDiv.classList.add('alert-info');
            }
        };
    });
}

// bug dai il permesso prima
Webcam.on('live', function() {
    // scanQRCode 3 sec
    setInterval(scanQRCode, 3000);
});

// errore qualsiasi si webcamjs
Webcam.on('error', function(err) {
    console.error('Errore con la webcam: ', err);
    alert('Errore nell\'accesso alla webcam: ' + err);
});


// genrate qr function
document.getElementById('generateBtn').addEventListener('click', function() {
    const qrCodeDiv = document.getElementById('qrcode');

    fetch('generate.php')
        .then(response => response.text())
        .then(data => {
            // div vuoto
            qrCodeDiv.innerHTML = '';

            // gen qr 300x300 modificabile
            QRCode.toDataURL(data, { width: 300, margin: 1 }, function (err, url) {
                if (err) {
                    console.error(err);
                    return;
                }

                // data url in bloc func
                fetch(url)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "qr_code.jpg", { type: blob.type });
                        // apri menu condivisione su mobile
                        if (navigator.share) {
                            navigator.share({
                                files: [file],
                                title: 'QR Code',
                                text: 'Ecco il tuo QR Code'
                            })
                            .then(() => console.log('Condivisione avviata'))
                            .catch((error) => console.error('Errore nella condivisione:', error));
                        } else {
                            // se non funziona scarica 
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'nomecoupon-qr_code.jpg';
                            link.click();
                        }
                    });
            });
        })
        .catch(error => console.error('Errore:', error));
})