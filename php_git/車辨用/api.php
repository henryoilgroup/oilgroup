<?php
include('./SQL/MySQL_Mid.php');
    
$car_no = $_GET['car_no'];

class info{
    public $car_no;
    public $car_prod;
    public $vip_info;
    public $charge_data;

};

$vip = array();
$vip[0] = new info();

//撈car_list車號資料
$sql = "SELECT car_no, car_no_full, oil_type, mem_id as vip_no, payment, uid, sub_custname, sub_cextent, refuel_time, dcard_discount, remark, remark2 FROM fr_member.car_list where car_no = ?";
$statement = $pdo->prepare($sql);
$statement -> bindValue(1, $car_no);  
$statement->execute();
$data = $statement->fetchAll(PDO::FETCH_ASSOC);


if(count($data) > 0){
    $payment = $data[0]['payment'];
    $uid = $data[0]['uid'];

    if($payment == '4'){
        $sql3 = "SELECT a.uid, a.amt, b.type FROM finereport_data.charge_realquota a
        left join finereport_data.charge_canbuy b
        on a.uid = b.uid
        where a.uid = ?";
        $statement3 = $pdo->prepare($sql3);
        $statement3 -> bindValue(1, $uid);  
        $statement3->execute();
        $data3 = $statement3->fetchAll(PDO::FETCH_ASSOC);
        if(count($data3) > 0){
            
        }else{
            class charge_info{
                public $car_no;
                public $car_no_full;
                public $oil_type;        
            };
            $data3[0] = new charge_info();
            $data3[0]->uid = null;
            $data3[0]->amt = null;
            $data3[0]->type = null;
        }
        $vip[0]->charge_data = $data3;
    }
}else{
    class car_info{
        public $car_no;
        public $car_no_full;
        public $oil_type;
        public $vip_no;
        public $payment;
        public $uid;
        public $sub_custname;
        public $sub_cextent;
        public $refuel_time;
        public $dcard_discount;
        public $remark;
        public $remark2;
    
    };
    $data[0] = new car_info();
    $data[0]->car_no = null;
    $data[0]->car_no_full = null;
    $data[0]->oil_type = null;
    $data[0]->vip_no = null;
    $data[0]->payment = null;
    $data[0]->uid = null;
    $data[0]->sub_custname = null;
    $data[0]->sub_cextent = null;
    $data[0]->refuel_time = null;
    $data[0]->dcard_discount = null;
    $data[0]->remark = null;
    $data[0]->remark2 = null;
}



//撈推過商品資料(車號)
$sql2 = "SELECT t1.category_id, t2.category_name, t2.talk, t1.recommended_time, t3.days
from ProdRecommeded_carno t1 
join ProdCategory t2 on t1.category_id = t2.category_id 
join ProdPeriod t3 on t1.category_id = t3.category_id 
where is_show = 1  and car_no = ?
and type=0 
order by sort limit 6";
$statement2 = $pdo->prepare($sql2); 
$statement2 -> bindValue(1, $car_no); 
$statement2->execute();
$data2 = $statement2->fetchAll(PDO::FETCH_ASSOC);


if(count($data2) > 0){

}else{
    class car_prod_info{
        public $category_id;
        public $category_name;
        public $talk;
        public $recommended_time;
        public $days;    
    };
    $data2[0] = new car_prod_info();
    $data2[0]->category_id = null;
    $data2[0]->category_name = null;
    $data2[0]->talk = null;
    $data2[0]->recommended_time = null;
    $data2[0]->days = null;
}


$vip[0]->car_no = $car_no;
$vip[0]->vip_info = $data;
$vip[0]->car_prod = $data2;
//$vip[0]->prodrecommeded = $data3;

$result = json_encode($vip);


print_r($result);

?>