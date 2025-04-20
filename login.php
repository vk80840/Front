<?php
$host = 'localhost';
$db = 'dashboard_auth';
$user = 'root';
$pass = ''; // update if you have a MySQL password

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  http_response_code(500);
  echo "Connection failed.";
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$password = $data['password'];

$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
  $user = $result->fetch_assoc();
  if (password_verify($password, $user['password'])) {
    // Optional: You could start session here
    echo "success";
  } else {
    http_response_code(401);
    echo "Incorrect password.";
  }
} else {
  http_response_code(404);
  echo "User not found.";
}
