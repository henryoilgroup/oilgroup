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

    
$vip_no = $_GET['vip_no'];

class info{
    public $vip_no;
    public $vip_prod;
    public $vip_info;
};
$vip = array();
$vip[0] = new info();


//撈推過商品資料(會員)
$sql = "SELECT t1.category_id, t2.category_name, t2.talk, t1.recommended_time, t3.days
from ProdRecommeded t1 
join ProdCategory t2 on t1.category_id = t2.category_id 
join ProdPeriod t3 on t1.category_id = t3.category_id 
where is_show = 1  and vip_id = ?
and type=0 
order by sort limit 6";
$statement = $pdo->prepare($sql); 
$statement -> bindValue(1, $vip_no); 
$statement->execute();
$data = $statement->fetchAll(PDO::FETCH_ASSOC);


//撈會員彈窗(會員) vip_memo = 2 彈窗 ; 1 會員習性 
$sql2 = "SELECT used_flag, detail from VipMemo where vip_id = ? and used_flag in (1,2) and type = 'habit' order by used_flag,memo_id DESC";
$statement2 = $pdo->prepare($sql2); 
$statement2 -> bindValue(1, $vip_no); 
$statement2->execute();
$data2 = $statement2->fetchAll(PDO::FETCH_ASSOC);

// //撈會員彈窗(會員)
// $sql2 = "SELECT detail from VipMemo where vip_id = ? and used_flag = 1 and type = 'habit' order by used_flag,memo_id DESC";
// $statement2 = $pdo->prepare($sql2); 
// $statement2 -> bindValue(1, $vip_no); 
// $statement2->execute();
// $data2 = $statement2->fetchAll(PDO::FETCH_ASSOC);




$vip[0]->vip_no = $vip_no;
$vip[0]->vip_prod = $data;
$vip[0]->vip_info = $data2;

//$vip[0]->prodrecommeded = $data3;

$result = json_encode($vip);


print_r($result);


?>