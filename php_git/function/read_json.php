<?php
//public $License_Plate;
function read_json($filename){
    $filename = "../island/json/";
    $data = file_get_contents($filename.'0301.json');
    $arr = json_decode( $data, true );
    print_r($arr);
    //print_r($data);
    echo ($arr['island']);
}

?>