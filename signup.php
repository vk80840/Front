<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = 'localhost';
$db = 'dashboard_auth';  // your database name
$user = 'root';
$pass = '';  // default for XAMPP

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Database connection failed."]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$referralId = $data['referralId'];
$firstName  = $data['firstName'];
$lastName   = $data['lastName'];
$mobile     = $data['mobile'];
$email      = $data['email'];
$password   = password_hash($data['password'], PASSWORD_DEFAULT);
$side       = $data['side'];

$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
  http_response_code(409);
  echo json_encode(["error" => "Email already registered."]);
  exit;
}

$stmt = $conn->prepare("INSERT INTO users (referral_id, first_name, last_name, mobile, email, password, side) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $referralId, $firstName, $lastName, $mobile, $email, $password, $side);

if ($stmt->execute()) {
  echo json_encode(["success" => "User registered successfully"]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Signup failed."]);
}
?>
