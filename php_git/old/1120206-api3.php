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
        PDO::ATTR_TIMEOUT => 5, // in seconds
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ));

    
class info{
    public $prod_cate;
    public $prod_detl;
};

$prod = array();
$prod[0] = new info();

//撈品項大項資料
$sql = "SELECT t1.category_id, t1.category_name, t1.talk FROM ProdCategory t1  where is_show=1 order by sort limit 6";
$statement = $pdo->prepare($sql);
$statement->execute();
$data = $statement->fetchAll(PDO::FETCH_ASSOC);

//撈品項細項
$sql2 = "SELECT t2.category_id, t2.prod_id, t2.prod_name FROM ProdCategory t1 
join ProdDetailInfo t2 on t1.category_id = t2.category_id 
where is_show = 1";
$statement2 = $pdo->prepare($sql2); 
$statement2->execute();
$data2 = $statement2->fetchAll(PDO::FETCH_ASSOC);


$prod[0]->prod_cate = $data;
$prod[0]->prod_detl = $data2;
//$vip[0]->prodrecommeded = $data3;

$result = json_encode($prod);


print_r($result);

?>