    <?php
    session_start();
    require_once("database.php");
    require_once("vendor/autoload.php");
    require_once "config/cors.php";

    use Firebase\JWT\JWT;

    error_reporting(E_ALL);
    ini_set("display_errors", 1);

    define('JWT_SECRET', 'supervision_sae_secret_key_2026_05');

    $message = "";

    // CRÉATION DE COMPTE
    
    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action']) && $_POST['action'] === 'register') {
        $nom      = $_POST['nom'] ?? '';
        $email    = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
        $password = $_POST['password'] ?? '';
        $role     = $_POST['role'] ?? 'retail';

        if (empty($nom) || empty($email) || empty($password)) {
            $message = "Tous les champs sont obligatoires.";
        } else {
        $check = $connexion->prepare("SELECT id FROM users WHERE email = :email");
        $check->bindParam(':email', $email);
        $check->execute();
        if ($check->fetch()) {
            $message = "Cet email est déjà utilisé.";
        } else {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $connexion->prepare("INSERT INTO users (nom, email, mot_de_passe, role) VALUES (:nom, :email, :mot_de_passe, :role)");
            $stmt->bindParam(':nom', $nom);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':mot_de_passe', $hash);
            $stmt->bindParam(':role', $role);
            if ($stmt->execute()) {
                $message = "Compte créé avec succès !";
            } else {
                $message = "Erreur lors de la création du compte.";
            }
        }
    }
    }

    // LOGIN
    
    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action']) && $_POST['action'] === 'login') {
        $email    = filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL);
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            $message = "Email ou mot de passe manquant.";
        } else {
            $stmt = $connexion->prepare("SELECT * FROM users WHERE email = :email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['mot_de_passe'])) {
                $payload = [
                    "id"   => $user['id'],
                    "nom"  => $user['nom'],
                    "role" => $user['role'],
                    "exp"  => time() + (60 * 60)
                ];
                $token = JWT::encode($payload, JWT_SECRET, 'HS256');
                $_SESSION['jwt_token'] = $token;
            $_SESSION['role'] = $user['role'];
            $_SESSION['nom']  = $user['nom'];
    // Redirige vers Angular selon le rôle
        if ($user['role'] === 'it') {
            header("Location: http://localhost:4200/admin?token=" . $token);
        } elseif ($user['role'] === 'commercial') {
            header("Location: http://localhost:4200/commercial?token=" . $token);
        } elseif ($user['role'] === 'retail') {
            header("Location: http://localhost:4200/retail?token=" . $token);
        }
        exit;

            } else {
                $message = "Email ou mot de passe incorrect.";
            }
        }
    }


    // DÉCONNEXION

    if (isset($_GET['action']) && $_GET['action'] === 'logout') {
        session_destroy();
        header("location: auth.php");
        exit();
    }

    ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Authentification</title>
    <link rel="stylesheet" type="text/css" href="style/header.css?v=1.0">
    <link rel="stylesheet" type="text/css" href="style/style.css?v=1.0">
</head>
<body>

<header class="main-header">
    <div class="logo"><strong>Application SAÉ Web</strong> - Page d'authentification</div>

</header>

<div class="register" id="register-box">
    <h2>Créer un compte</h2>
    <form method="POST">
        <input type="hidden" name="action" value="register">
        <div class="formulaire">Nom : <input type="text" name="nom"></div>
        <div class="formulaire">Email : <input type="email" name="email"></div>
        <div class="formulaire">Mot de passe : <input type="password" name="password"></div>    
        <div class="formulaire">
            Rôle :
            <select name="role">
                <option value="it">IT</option>
                <option value="commercial">Commercial</option>
                <option value="retail">Retail</option>
            </select>
        </div>
        <button type="submit">Créer le compte</button>
    </form>
    <span class="toggle-link" onclick="toggleAuth()">Déjà un compte ? Se connecter</span>
</div>

<div class="login hidden" id="login-box">
    <h2>Se connecter</h2>
    <form method="POST">
        <input type="hidden" name="action" value="login">
        <div class="formulaire">Email : <input type="email" name="email"></div>
        <div class="formulaire">Mot de passe : <input type="password" name="password"></div>
        <button type="submit">Se connecter</button>
    </form>
    <span class="toggle-link" onclick="toggleAuth()">Pas encore de compte ? S'inscrire</span>
</div>

<?php if (!empty($message)): ?>
    <p style="text-align: center; font-weight: bold; color: #2c3e50;"><?= htmlspecialchars($message) ?></p>
<?php endif; ?>

<script>
function toggleAuth() {
    const registerBox = document.getElementById('register-box');
    const loginBox = document.getElementById('login-box');
    registerBox.classList.toggle('hidden');
    loginBox.classList.toggle('hidden');
}
</script>

</body>
</html>