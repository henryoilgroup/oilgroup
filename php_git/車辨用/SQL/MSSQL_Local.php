<?php
// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// // 響應型別
// header('Access-Control-Allow-Methods:*');
// // 響應頭設定
// header('Access-Control-Allow-Headers:x-requested-with,content-type');

// //MSSQL相關資訊 雲端中繼
$db_host = "192.168.5.204";
$db_user = "sa";
$db_pass = "24436074";
$db_select = "oilgroup";

//建立資料庫連線物件
$dsn = "sqlsrv:Server=".$db_host.";Database=".$db_select;
//建立PDO物件，並放入指定的相關資料
try{
    $pdo = new PDO($dsn, $db_user, $db_pass,array(
        PDO::ATTR_TIMEOUT => 2, // in seconds
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::SQLSRV_ATTR_DIRECT_QUERY => true
    ));
} catch(PDOException $e){
    echo 'Database connection fails: ' . $e->getMessage() . '<br />';
    exit;
}

?>