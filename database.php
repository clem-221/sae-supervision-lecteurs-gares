<?php
$host     = "localhost";
$dbname   = "supervision_musicale";
$username = "sae";
$password = "sae123";

try {
    $connexion = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $username,
        $password
    );
    $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(["erreur" => "Connexion BDD impossible"]);
    exit();
}
?>
