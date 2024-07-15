<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $service = $data['service'];
    $password = $data['password'];

    // Sanitize inputs
    $service = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
    $password = htmlspecialchars($password, ENT_QUOTES, 'UTF-8');

    // Save to the database
    $conn = new mysqli('localhost', 'root', '', 'password_manager');
    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    $stmt = $conn->prepare('INSERT INTO passwords (service, password) VALUES (?, ?)');
    $stmt->bind_param('ss', $service, $password);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo 'Password saved successfully';
} else {
    echo 'Invalid request';
}
?>
