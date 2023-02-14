<?php
// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// // 響應型別
// header('Access-Control-Allow-Methods:*');
// // 響應頭設定
// header('Access-Control-Allow-Headers:x-requested-with,content-type');
date_default_timezone_set('Asia/Taipei');
$now = date("Y-m-d H:i:s"); 
// data strored in array
$category = $_GET['category'];
$island = $_GET['island'];
$islandface = $_GET['islandface'];

if($category =='finereport'){
    $car_no = $_GET['car_no'];
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
    $array = Array (
            "island" => $island,
            "islandface" => $islandface,
            "License_Plate" => '',
            "last_oil_classification" => '',
            "create_time" => $now
    );

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