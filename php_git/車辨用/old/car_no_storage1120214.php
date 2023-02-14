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

if($category =='finereport'){
    $islandface = $_GET['islandface'];
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
    $gun_no = $_GET['gun_no'];
    $tran_time = $_GET['tran_time'];
    include('./SQL/PostgreSQL_3S.php');
    //撈3SDB槍號對應面號資料
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