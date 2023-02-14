<?php

    //$url = api網址
    //$data = 參數
    function api_post($url, $data){
        // API 網址
        //$url  =  'http://testgiftshopgw.systex.com/OilGroupAPI/api/Identify/' ; 
        // 創建一個新的 cURL 資源
        $ch  =  curl_init ( $url ); 

        // // 設置請求通過 POST 發送 json 
        // $data  = array( 
        //     'api_type' => '', 
        //     'seq_no' => '', 
        //     'plate' => '', 
        //     'plate_color' => 'wb_bf', 
        //     'brand' => 'Toyota', 
        //     'color' => 'blue', 
        //     'station' => '', 
        //     'island' => '', 
        //     'position' => '', 
        //     'time' => '', 
        //     'photo_link' => '/deeplook_media/engine/lpr_cpc/2-3_20230110-162119.jpg' 
        // );
        // // $payload  =  json_encode (array( "user"  =>  $data )); 
        // $payload  =  json_encode ( $data ); 


        // 將編碼的 JSON 字符串附加到 POST 字段
        curl_setopt ( $ch ,  CURLOPT_POSTFIELDS ,  $data); 
        // 將內容類型設置為 application/json 
        curl_setopt ( $ch ,  CURLOPT_HTTPHEADER , array( 'Content-Type:application/json' )); 
        // 返迴響應而不是輸出
        curl_setopt ( $ch ,  CURLOPT_RETURNTRANSFER ,  true ); 
        // 執行 POST 請求
        $result  =  curl_exec ( $ch ); 
        echo $result; //輸出傳回值
        // 關閉 cURL 資源
        curl_close ( $ch );
    }
    
    
?>