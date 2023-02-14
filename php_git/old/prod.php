<?php
// 指定允許其他域名訪問
header('Access-Control-Allow-Origin:*');
// // 響應型別
// header('Access-Control-Allow-Methods:*');
// // // 響應頭設定
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
        PDO::ATTR_TIMEOUT => 5, // in seconds
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ));

    
// $car_no_replace = $_POST['car_no_replace'];



//車隊卡

$sql = "SELECT t2.prod_id FROM ProdCategory t1 join ProdDetailInfo t2 on t1.category_id = t2.category_id where is_show = 1";


$statement = $pdo->prepare($sql);
// $statement -> bindValue(1, $car_no_replace);  
$statement->execute();

//抓出全部且依照順序封裝成一個二維陣列
$data = $statement->fetchAll(PDO::FETCH_ASSOC);
// print_r($data);
$result = json_encode($data);
print_r($result);

// foreach($data as $index => $row){
//     if($index == 0){
//         echo $row["prod_id"];
//     }else{
//         echo ",".$row["prod_id"];
//     }
    
// };

?>