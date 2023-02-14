<?php
// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// // 響應型別
// header('Access-Control-Allow-Methods:*');
// // 響應頭設定
// header('Access-Control-Allow-Headers:x-requested-with,content-type');

// //MySQL相關資訊 雲端中繼
$db_host = "st203:3306";
$db_user = "oil";
$db_pass = "nzpdSPQWWbeRVxys";
$db_select = "oil";
//建立資料庫連線物件
$dsn = "mysql:host=".$db_host.";dbname=".$db_select;
//建立PDO物件，並放入指定的相關資料
try{
    $pdo = new PDO($dsn, $db_user, $db_pass,array(
        PDO::ATTR_TIMEOUT => 2, // in seconds
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "set names utf8",
    ));
} catch(PDOException $e){
    echo 'Database connection fails: ' . $e->getMessage() . '<br />';
    exit;
}

?>