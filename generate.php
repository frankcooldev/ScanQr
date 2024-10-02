<?php
// gen id
$qr_id = bin2hex(random_bytes(4)); // 8char univoco

// link
$baseURL = "https://whatsappcredo.it";

// crea link univoco
$uniqueURL = $baseURL . "?qr_id=" . $qr_id;

// save id into db
$dbFile = 'db.txt';

// 0 non scansionato  ||  1 si
$entry = $qr_id . "|0\n";

// scrivi db
file_put_contents($dbFile, $entry, FILE_APPEND | LOCK_EX);

// return link
echo $uniqueURL;
?>
