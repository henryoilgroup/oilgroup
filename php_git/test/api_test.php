<?php


    $url = "http://testgiftshopgw.systex.com/OilGroupAPI/api/Identify/";
    $data = array( 
            'api_type' => 'carinfo', 
            'seq_no' => '', 
            'plate' => 'ADR3139', 
            'plate_color' => 'wb_bf', 
            'brand' => 'Toyota', 
            'color' => 'blue', 
            'station' => '', 
            'island' => '', 
            'position' => '', 
            'time' => '', 
            'photo_link' => '/deeplook_media/engine/lpr_cpc/2-3_20230110-162119.jpg' 
        );
    $data = json_encode ($data);

    //$path = '儲存路徑/檔名', $type = '副檔名', $array = '要存的資訊'
    require '../function/api_post.php';
    api_post($url, $data);

?>