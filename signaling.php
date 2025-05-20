<?php
$address = '0.0.0.0';
$port = 8080;

$server = stream_socket_server("tcp://$address:$port", $errno, $errstr);
$clients = [];

while ($conn = @stream_socket_accept($server, -1)) {
    $clients[] = $conn;
    while ($data = fread($conn, 1024)) {
        foreach ($clients as $client) {
            if ($client !== $conn) fwrite($client, $data);
        }
    }
}
?>