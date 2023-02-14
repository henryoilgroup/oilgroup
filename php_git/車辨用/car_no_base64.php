<?php

// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// // 響應型別
// header('Access-Control-Allow-Methods:*');
// // 響應頭設定
// header('Access-Control-Allow-Headers:x-requested-with,content-type');
date_default_timezone_set('Asia/Taipei');
$now = date("Y-m-d"); 
// data strored in array


$island = $_GET['island'];
$seq = $_GET['seq'];
$car_no = $_GET['car_no'];
$car_img = $_GET['car_img'];
$time = $_GET['time'];




// $island = "01";
// $seq = "02";
// $car_no = "ADR3139";
// $car_img = 'https://www.oilgroup.com.tw/dist/images/about/1.jpg';
// $time = date("Y-m-d H:i:s");


$time = str_replace(":","_",$time) ;



$base64_image = base64_encode(file_get_contents($car_img));

$image_data = sprintf('data:%s;base64,%s', mime_content_type($car_img), $base64_image);


$path = "../car_no_img/".$now."/".$island."/".$seq."/";

if (!is_dir($path)){ //判斷目錄是否存在 不存在就建立
    mkdir($path,0777,true);
}

file_put_contents($path.$time.'_'.$car_no.'.png', base64_decode($base64_image));//返回的是位元組數
?>