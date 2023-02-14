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

if (!empty($_SERVER["HTTP_CLIENT_IP"])){
    $ip = $_SERVER["HTTP_CLIENT_IP"];
}elseif(!empty($_SERVER["HTTP_X_FORWARDED_FOR"])){
    $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
}else{
    $ip = $_SERVER["REMOTE_ADDR"];
}
     


//1.
// 这样php就接收到postman发送过来的json值了
$tran_car = json_decode(file_get_contents('php://input'), true);




//2.
// 使用$HTTP_RAW_POST_DATA，需要设置php.ini中的always_populate_raw_post_data值为On。
// 它包含了POST的原始数据。但这不是一个超全局变量，要在函数中使用它，必须声明为global，或使用$GLOBALS['HTTP_RAW_POST_DATA']代替。
// php://input 允许读取 POST 的原始数据，但和 $GLOBALS['HTTP_RAW_POST_DATA'] 比起来，它给内存带来的压力较小，并且不需要任何特殊的 php.ini 设置。
// 这两种方法都 不能用于 enctype="multipart/form-data"。
// -----------------------------------
// ©著作权归作者所有：来自51CTO博客作者OnlyDawn的原创作品，请联系作者获取转载授权，否则将追究法律责任
// php接收json数据
// https://blog.51cto.com/niuben/3028700

//$res = $GLOBALS['HTTP_RAW_POST_DATA'];

    $api_type = $tran_car['api_type'];       // 未知變數
    $seq_no = $tran_car['seq_no'];             // 序號
    $plate = $tran_car['plate'];               // 車號
    $plate_color = $tran_car['plate_color'];   // 車牌顏色
    $brand = $tran_car['brand'];               // 車牌
    $color = $tran_car['color'];              // 車體顏色
    $station = $tran_car['station'];           // 站點
    $island = $tran_car['island'];            // 島
    $position = $tran_car['position'];         // 面
    $time = $tran_car['time'];             // 辨識時間
    $photo_link = $tran_car['photo_link'];     // 照片路徑


    if( strlen($plate) != 0 && strlen($island) != 0 && strlen($position) != 0 && strlen($station) != 0){
        $array = Array (
            "api_type" => $api_type,
            "seq_no" => $seq_no,
            "plate" => $plate,
            "plate_color" => $plate_color,
            "brand" => $brand,
            "color" => $color,
            "station" => $station,
            "island" => $island,
            "position" => $position,
            "brand" => $brand,
            "time" => $time, 
            "ip" => $ip,
        );

        $path = "./island/api/oil/".$now.".json";
        
        // //取出目錄路徑中目錄(不包括後面的檔案)
        $dir_name = dirname($path);
        //如果目錄不存在就建立
        if(!file_exists($dir_name)) {
            mkdir(iconv("UTF-8", "GBK", $path), 0777, true);
        }
        $array = json_encode($array).',';
        // 寫入資訊
        $msg = $array;
        //開啟檔案資源通道，不存在則自動建立
        $fp = fopen($path,"a");
        //寫入檔案
        fwrite($fp,var_export($msg,true)."\r\n");
        //關閉資源通道
        fclose($fp);

        //file_put_contents($path.$island.$position.$time.$plate.".json", $array); 

        $status = '00';
        $message = '車輛車牌['.$plate.']辨識資料成功更新';

    }else{
        $status = '99';
        $message = '島、面、車號、站點不得為空';
    }


    $response = Array (
        "status" => $status,
        "message" => $message,
    );


    $json = json_encode($response);
    print_r($json);




?>


