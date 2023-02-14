<?php
// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// // 響應型別
// header('Access-Control-Allow-Methods:*');
// // 響應頭設定
// header('Access-Control-Allow-Headers:x-requested-with,content-type');
date_default_timezone_set('Asia/Taipei');
$now = date("Y-m-d H:i:s"); 
$today = date("Y-m-d");
// data strored in array
$category = $_GET['category'];
$island = $_GET['island'];
$car_no = $_GET['car_no'];

if($category =='finereport'){
    $islandface = $_GET['islandface'];
    $oil_type = $_GET['oil_type'];
    //$modify_time = $_GET['modify_time'];
    $array = Array (
            "island" => $island,
            "islandface" => $islandface,
            "License_Plate" => $car_no,
            "last_oil_classification" => $oil_type,
            "create_time" => $now
    );

}else if($category =='3S'){
    $gun_no = $_GET['gun_no'];
    $tran_time = $_GET['tran_time'];

    require './function/log.php';
    $type = 'json';
    $path = './island/api/tran_car/'.$today.'.json';
    $tran_car_log = Array (
        "island" => $island,
        "gun_no" => $gun_no,
        "tran_time" => $tran_time,
        "car_no" => $car_no,
        "create_time" => $now
    );
    log_write($path, $tran_car_log, $type);


    //撈3SDB槍號對應面號資料
    include('./SQL/PostgreSQL_3S.php');
    $sql = "SELECT panel from set_island where island = ? and gun_no = ?";
    $statement = $pdo->prepare($sql);
    $statement -> bindValue(1, $island);  
    $statement -> bindValue(2, $gun_no);  
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);

    if(count($data) > 0){
        foreach($data as $index => $row){
            $islandface =  $row["panel"];
        };
        if ($islandface <= 9) {
            $islandface = "0".$islandface;
        }
        $array = Array (
            "island" => $island,
            "islandface" => $islandface,
            "License_Plate" => '',
            "last_oil_classification" => '',
            "create_time" => $now
        );
    };

}


$filename = "../island/json/".$island.$islandface;
// encode array to json
$json = json_encode($array);
if($island == '' || $islandface==''){
    echo "no island and islandface";
}else{
    $bytes = file_put_contents($filename.".json", $json); 
    if($category =='finereport'){
        echo $island."島".$islandface."面 ".$car_no."寫入成功";
    }else if($category =='3S'){
        echo $island."島".$islandface."面, 交易結束清除成功";
    }
    //echo "The number of bytes written are $bytes.";
}


?>