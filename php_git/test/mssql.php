<?php
// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// // 響應型別
// header('Access-Control-Allow-Methods:*');
// // 響應頭設定
// header('Access-Control-Allow-Headers:x-requested-with,content-type');

$db_host = "database.lafresh.com.tw";
$db_user = "oilgroup";
$db_pass = "P@ssW0rd";
$db_select = "oilgroup";

//建立資料庫連線物件
$dsn = "sqlsrv:Server=".$db_host.";Database=".$db_select;
//建立PDO物件，並放入指定的相關資料
$pdo = new PDO($dsn, $db_user, $db_pass,array(
    PDO::ATTR_TIMEOUT => 2, // in seconds
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::SQLSRV_ATTR_DIRECT_QUERY => true
));

    
$sql = "SELECT * FROM vip_pointlist
where input_date >= '2023-01-01'";

$statement = $pdo->prepare($sql); 
$statement->execute();
$data = $statement->fetchAll(PDO::FETCH_ASSOC);

print_r($data);


?>