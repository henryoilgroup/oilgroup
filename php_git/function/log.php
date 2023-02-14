<?php


// require './A.php';
// //呼叫A.php中的方法
// func_a();


//$path = '儲存路徑/檔名'
//$type = '副檔名'
//$array = '要存的資訊'

function log_write($path, $array, $type){
    //$path = "./island/api/tran_car/".$now.".json";
        $path = $path.'.'.$type;
        // //取出目錄路徑中目錄(不包括後面的檔案)
        $dir_name = dirname($path);
        //如果目錄不存在就建立
        if(!file_exists($dir_name)) {
            mkdir(iconv("UTF-8", "GBK", $path), 0777, true);
        }
        $array = json_encode($array);
        if($type =='json'){
            $array = $array.',';
        }
        // 寫入資訊
        $msg = $array;
        //開啟檔案資源通道，不存在則自動建立
        $fp = fopen($path,"a");
        //寫入檔案
        fwrite($fp,var_export($msg,true)."\r\n");
        //關閉資源通道
        fclose($fp);
}


?>