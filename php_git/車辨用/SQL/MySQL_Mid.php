<?php
// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// // 響應型別
// header('Access-Control-Allow-Methods:*');
// // 響應頭設定
// header('Access-Control-Allow-Headers:x-requested-with,content-type');

// //MySQL相關資訊 雲端中繼
$db_host = "52.193.185.207:9006";
$db_user = "oil";
$db_pass = "3mJ2pxjDzLIsU8ki";
$db_select = "fr_member";
//建立資料庫連線物件
$dsn = "mysql:host=".$db_host.";dbname=".$db_select;
//建立PDO物件，並放入指定的相關資料
$pdo = new PDO($dsn, $db_user, $db_pass,array(
    PDO::ATTR_TIMEOUT => 2, // in seconds
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::MYSQL_ATTR_INIT_COMMAND => "set names utf8",
));

?>