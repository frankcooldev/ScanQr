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