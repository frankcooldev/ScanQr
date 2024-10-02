<?php
$dbFile = 'db.txt';

// send response JSON
function sendJsonResponse($message, $status = 'success') {
    header('Content-Type: application/json');
    echo json_encode(['status' => $status, 'message' => $message]);
}

// get ajax post
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['qr_id'])) {
    $qr_id = $_POST['qr_id'];

    // get db
    $dbContent = file_get_contents($dbFile);

    // array to string
    $lines = explode("\n", trim($dbContent));

    $found = false;
    $newContent = "";

    foreach ($lines as $line) {
        if (empty($line)) continue; // bug line vuote

        list($id, $scanned) = explode('|', $line);

        if ($id === $qr_id) {
            $found = true;

            if ($scanned == '1') {
                $message = "Questo QR code è già stato scansionato.";
                $status = 'error';

            } else {
                $line = $id . '|1';
                $message = "QR code trovato e registrato con successo!";
                $status = 'success';
            }
        }

        $newContent .= $line . "\n";
    }

    if ($found) {
        // scrivi db
        file_put_contents($dbFile, $newContent, LOCK_EX);

        // call json response
        sendJsonResponse($message, $status);
        exit();
    } else {
        // not found
        sendJsonResponse("QR code non valido.", 'error');
        exit();
    }
} else if (isset($_GET['qr_id'])) {
    // se il QR code viene scansionato con lo smartphone

    $qr_id = $_GET['qr_id'];

    // get db
    $dbContent = file_get_contents($dbFile);

    //array to string
    $lines = explode("\n", trim($dbContent));

    $found = false;
    $newContent = "";

    foreach ($lines as $line) {
        if (empty($line)) continue; 

        list($id, $scanned) = explode('|', $line);

        if ($id === $qr_id) {
            $found = true;

            if ($scanned == '1') {
                echo "Questo QR code è già stato scansionato.";
                exit();
            } else {
                $line = $id . '|1';
            }
        }

        $newContent .= $line . "\n";
    }

    if ($found) {
        // Scrivi db
        file_put_contents($dbFile, $newContent, LOCK_EX);

        // show page
        echo "Benvenuto! Hai scansionato il QR code correttamente.";
        // todo write html
    } else {
        echo "QR code non valido.";
    }
} else {
    echo "Nessun QR code specificato.";
}
?>
