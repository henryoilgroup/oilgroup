<?php
// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// 響應型別
header('Access-Control-Allow-Methods:*');
// 響應頭設定
header('Access-Control-Allow-Headers:x-requested-with,content-type');


include('./SQL/MySQL_Mid.php');

    
$car_no = $_POST['car_no'];
$station_no = $_POST['station_no'];
$island = $_POST['island'];
$seq = $_POST['seq'];
$keyin_time = $_POST['keyin_time'];


echo $car_no;
echo $station_no;
echo $island;
echo $seq;
echo $keyin_time;


$sql = "INSERT INTO `fr_member`.`carno_keyin` (`car_no`, `station_no`, `island`, `seq`, `keyin_time`) VALUES (?,?,?,?,?);";


$statement = $pdo->prepare($sql);
$statement -> bindValue(1, $car_no);  
$statement -> bindValue(2, $station_no);  
$statement -> bindValue(3, $island);  
$statement -> bindValue(4, $seq);  
$statement -> bindValue(5, $keyin_time);  
$stmt = $statement ->execute();

if(!$stmt){
    /*SQL語句執行失敗，顯示原因*/
         $error = $statement->errorInfo();
         print_r($error[2]);
         //執行失敗回傳2
         echo '2';
}else{
    //執行成功回傳1
    echo '1';
    
};

?>