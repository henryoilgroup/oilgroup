<?php
// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// // 響應型別
//header('Access-Control-Allow-Methods:*');
// // 響應頭設定
//header('Access-Control-Allow-Headers:x-requested-with,content-type');

    // //MySQL相關資訊 雲端中繼
    $db_host = "192.168.5.204";
    $db_user = "sa";
    $db_pass = "24436074";
    $db_select = "oilgroup";

    //建立資料庫連線物件
    $dsn = "sqlsrv:Server=".$db_host.";Database=".$db_select;
    //建立PDO物件，並放入指定的相關資料
    $pdo = new PDO($dsn, $db_user, $db_pass,array(
        PDO::ATTR_TIMEOUT => 2, // in seconds
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::SQLSRV_ATTR_DIRECT_QUERY => true
    ));

$car_no = $_GET['car_no'];
$island = $_GET['island'];
$seq = $_GET['seq'];
$oil_type = $_GET['oil_type'];
$modify_time = $_GET['modify_time'];


//撈推過商品資料(會員)
$sql = "UPDATE cam_car SET license_plate = ?, last_oil_classification =?, modify_time=? WHERE island = ? and islandface = ? ";
$statement = $pdo->prepare($sql); 
$statement -> bindValue(1, $car_no); 
$statement -> bindValue(2, $oil_type); 
$statement -> bindValue(3, $modify_time); 
$statement -> bindValue(4, $island); 
$statement -> bindValue(5, $seq); 
$statement->execute();


?>