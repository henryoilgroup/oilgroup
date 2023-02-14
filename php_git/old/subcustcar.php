<?php
// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// // 響應型別
// header('Access-Control-Allow-Methods:*');
// // 響應頭設定
// header('Access-Control-Allow-Headers:x-requested-with,content-type');

    $mysql_ip = $_POST['mysql_ip'];
    $ip = $mysql_ip."3306";
    // //MySQL相關資訊 雲端中繼
    $db_host = $ip;
    $db_user = "oil";
    $db_pass = "nzpdSPQWWbeRVxys";
    $db_select = "oil";
    //建立資料庫連線物件
    $dsn = "mysql:host=".$db_host.";dbname=".$db_select;

    //建立PDO物件，並放入指定的相關資料
    $pdo = new PDO($dsn, $db_user, $db_pass,array(
        PDO::ATTR_TIMEOUT => 5, // in seconds
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "set names utf8"
    ));

    
$car_no_replace = $_POST['car_no_replace'];
// $car_no_replace = 'adr3139';


//禮遇卡

$sql = "SELECT c.Carno, p.CustId, p.shortname,c.OilType, l.cextent FROM st_oil_credit_car c join st_oil_credit_parent p on c.ParentId = p.id join st_oil_credit_list l on c.ParentId = l.id where c.status = 1 and REPLACE( c.carNo, '-' , '' ) = ?";

$statement = $pdo->prepare($sql);
$statement -> bindValue(1, $car_no_replace);  
$statement->execute();

//抓出全部且依照順序封裝成一個二維陣列
$data = $statement->fetchAll(PDO::FETCH_ASSOC);
$result = json_encode($data,JSON_UNESCAPED_UNICODE);

if(count($data)==0){
    echo '';
}else{
    print_r($result);
}



?>