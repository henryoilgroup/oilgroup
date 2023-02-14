<?php
include('./SQL/MySQL_Mid.php');

    
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