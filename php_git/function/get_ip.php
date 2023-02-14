<?php
    function get_ip(){
        // 指定允許其他域名訪問
        header('Access-Control-Allow-Origin:*');
        if (!empty($_SERVER["HTTP_CLIENT_IP"])){
            $ip = $_SERVER["HTTP_CLIENT_IP"];
        }elseif(!empty($_SERVER["HTTP_X_FORWARDED_FOR"])){
            $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
        }else{
            $ip = $_SERVER["REMOTE_ADDR"];
        }   
        return $ip;
    }
?>