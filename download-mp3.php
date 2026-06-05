<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

// Headers en premier (AVANT tout output)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Gérer les requêtes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

// Vérifier que c'est une requête POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$action = $_POST['action'] ?? '';
$url = $_POST['url'] ?? '';

if ($action !== 'download') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Action non valide']);
    exit;
}

if (empty($url)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'URL requise']);
    exit;
}

// Valider que c'est une URL YouTube valide
if (!preg_match('/^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/', $url)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'URL YouTube invalide']);
    exit;
}

try {
    // Créer le dossier de téléchargement s'il n'existe pas
    $downloadDir = __DIR__ . '/public/downloads';
    if (!is_dir($downloadDir)) {
        mkdir($downloadDir, 0777, true);
    }
    
    // Assurer les permissions
    @chmod($downloadDir, 0777);

    // Utiliser yt-dlp directement (via le virtualenv ou système)
    $venvPython = __DIR__ . '/venv_mp3/bin/python3';
    $pythonCmd = file_exists($venvPython) ? $venvPython : 'python3';
    
    // Construire la commande yt-dlp - Synthèse audio en MP3
    $escapedUrl = escapeshellarg($url);
    $outputTemplate = escapeshellarg($downloadDir . '/%(title)s.%(ext)s');
    
    // Utiliser yt-dlp avec postprocessor FFmpeg pour convertir en MP3
    $command = "{$pythonCmd} -m yt_dlp " .
        "-f 'ba/b' " .
        "-x --audio-format mp3 --audio-quality 128 " .
        "-o {$outputTemplate} " .
        "{$escapedUrl} 2>&1";
    
    $output = [];
    $returnCode = 0;
    exec($command, $output, $returnCode);
    
    if ($returnCode !== 0) {
        // Essayer d'installer yt-dlp s'il est absent
        if (strpos(implode("\n", $output), "No module named") !== false) {
            exec("{$pythonCmd} -m pip install -q yt-dlp 2>&1", $installOutput, $installCode);
            
            if ($installCode === 0) {
                // Réessayer le téléchargement
                exec($command, $output, $returnCode);
            }
        }
        
        if ($returnCode !== 0) {
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'message' => 'Erreur lors du téléchargement',
                'error' => implode("\n", $output),
                'command_debug' => $command
            ]);
            exit;
        }
    }

    // Trouver le fichier MP3 le plus récemment créé
    $files = array_diff(scandir($downloadDir), array('.', '..', '.gitkeep'));
    $latestFile = null;
    $latestTime = 0;

    foreach ($files as $file) {
        if (strpos($file, '.mp3') !== false) {
            $filePath = $downloadDir . '/' . $file;
            $fileTime = filemtime($filePath);
            if ($fileTime > $latestTime) {
                $latestTime = $fileTime;
                $latestFile = $file;
            }
        }
    }

    if ($latestFile) {
        $filePath = $downloadDir . '/' . $latestFile;
        @chmod($filePath, 0666);
        
        echo json_encode([
            'success' => true,
            'message' => 'MP3 téléchargé avec succès ✓',
            'filename' => $latestFile,
            'downloadUrl' => '/public/downloads/' . urlencode($latestFile),
            'filesize' => filesize($filePath)
        ]);
    } else {
        throw new Exception('Aucun fichier MP3 trouvé après téléchargement');
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
}
?>
