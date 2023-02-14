<?php
// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// // 響應型別
// header('Access-Control-Allow-Methods:*');
// // 響應頭設定
// header('Access-Control-Allow-Headers:x-requested-with,content-type');

    // //MySQL相關資訊 雲端中繼
    $db_host = "52.193.185.207:9006";
    $db_user = "oil";
    $db_pass = "3mJ2pxjDzLIsU8ki";
    $db_select = "fr_member";

    //建立資料庫連線物件
    $dsn = "mysql:host=".$db_host.";dbname=".$db_select;

    //建立PDO物件，並放入指定的相關資料
    $pdo = new PDO($dsn, $db_user, $db_pass,array(
        PDO::ATTR_TIMEOUT => 2, // in seconds
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ));

    
$car_no = $_GET['car_no'];
$station_no = $_GET['station_no'];
$island = $_GET['island'];
$seq = $_GET['seq'];
$keyin_type = $_GET['keyin_type'];
$today = $_GET['today'];
$keyin_time = $_GET['keyin_time'];



//撈推過商品資料(會員)
$sql = "SELECT car_no FROM carno_keyin where station_no = ? and keyin_date = ? and car_no = ?";
$statement = $pdo->prepare($sql); 
$statement -> bindValue(1, $station_no); 
$statement -> bindValue(2, $today); 
$statement -> bindValue(3, $car_no); 
$statement->execute();
$data = $statement->fetchAll(PDO::FETCH_ASSOC);

if(count($data) > 0){
    $sql2 = "UPDATE carno_keyin SET keyin_time = ?, island =?, seq = ? WHERE car_no = ? and station_no = ? and  keyin_date = ?";
    $statement2 = $pdo->prepare($sql2); 
    $statement2 -> bindValue(1, $keyin_time); 
    $statement2 -> bindValue(2, $island); 
    $statement2 -> bindValue(3, $seq); 
    $statement2 -> bindValue(4, $car_no); 
    $statement2 -> bindValue(5, $station_no); 
    $statement2 -> bindValue(6, $today); 
    $statement2->execute();
    if(!$statement2){
        /*SQL語句執行失敗，顯示原因*/
             $error = $statement2->errorInfo();
             print_r($error[2]);
             //執行失敗回傳2
             echo "更新失敗";
    }else{
        //執行成功回傳1
        echo "更新成功";
        
    };
}else{
    $sql3 = "INSERT INTO carno_keyin (car_no, station_no, island, seq, keyin_time, keyin_date, keyin_type) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $statement3 = $pdo->prepare($sql3); 
    $statement3 -> bindValue(1, $car_no); 
    $statement3 -> bindValue(2, $station_no); 
    $statement3 -> bindValue(3, $island); 
    $statement3 -> bindValue(4, $seq); 
    $statement3 -> bindValue(5, $keyin_time); 
    $statement3 -> bindValue(6, $today); 
    $statement3 -> bindValue(7, $keyin_type); 
    $statement3->execute();
   
    if(!$statement3){
        /*SQL語句執行失敗，顯示原因*/
             $error = $statement3->errorInfo();
             print_r($error[2]);
             //執行失敗回傳2
             echo "新增失敗";
    }else{
        //執行成功回傳1
        echo "新增成功";
        
    };

}

?>