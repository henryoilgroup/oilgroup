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
    $db_select = "pos_data";

    //建立資料庫連線物件
    $dsn = "mysql:host=".$db_host.";dbname=".$db_select;

    //建立PDO物件，並放入指定的相關資料
    $pdo = new PDO($dsn, $db_user, $db_pass,array(
        PDO::ATTR_TIMEOUT => 2, // in seconds
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ));

//撈品項大項資料
$car_no = $_GET['car_no'];
//$car_no = 'ADR3139';

$sql = "SELECT rank2, product_id, prod_name, category_id, GROUP_CONCAT( if(rank2='1',tran_date ,null)) as tran_date1 ,GROUP_CONCAT(if(rank2='2',tran_date ,null)) as tran_date2, GROUP_CONCAT(if(rank2='3',tran_date ,null)) as tran_date3
from(
with d0 as (
 select island, gun_no, tran_time, station_no, car_no, car_no_3S
 from tran_car where (car_no = ? or car_no_3S = ?)
),
d1 as (
 select RANK() OVER (
  PARTITION BY product_id 
        ORDER BY tran_time desc
    ) rank2, t.station_no, t.island, t.gun_no, t.tran_time, d.product_id
 from d0 a, pos_data.tran t, pos_data.tran_detl d
 where a.station_no = t.station_no and a.island = t.island
    and a.tran_time = t.tran_time and a.gun_no = t.gun_no
    AND t.island = d.island and t.gun_no = d.gun_no
    and t.tran_time = d.tran_time and t.Station_No = d.Station_No
 and  t.an_mark < '200' and t.an_ref1 = ''
)

select rank2, product_id, p.prod_name,category_id,station_no, island, gun_no, left(tran_time,10) as tran_date
from d1, (SELECT b.* FROM fr_member.prodcategory a
join fr_member.proddetailinfo b
on a.category_id = b.category_id
where a.is_show != '0') as p
where d1.product_id = p.prod_id and rank2 <= 3
-- group by product_id
order by product_id, tran_date desc
)as b
group by product_id ";

$statement = $pdo->prepare($sql);
$statement -> bindValue(1, $car_no);       
$statement -> bindValue(2, $car_no);       
$statement->execute();  




//抓出全部且依照順序封裝成一個二維陣列
$data = $statement->fetchAll();
echo "<table class='table table-striped'>
            <thead class='thead-dark'>
                <tr style='text-align: center;'>
                    <th scope='col' style='text-align: center;'>#</th>
                    <th scope='col' style='text-align: center;'>商品</th>
                    <th scope='col' style='text-align: center; width:40px;'>1</th>
                    <th scope='col' style='text-align: center; width:40px;'>2</th>
                    <th scope='col' style='text-align: center; width:40px;'>3</th>
                </tr>
            </thead>
        <tbody>";
$prod_count = 0;
foreach($data as $index => $row){
    if($row["category_id"] != '9999'){
        $prod_count ++;
        echo '<tr>';
        echo '<th scope="row" style="text-align: center; vertical-align:middle;">'.$prod_count.'</th>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["prod_name"].'</td>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["tran_date1"].'</td>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["tran_date2"].'</td>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["tran_date3"].'</td>';
        echo '</tr>';
    }
    
};
    echo '</tbody>';
    echo '<thead class="table-secondary" style="text-align: center;">
    <tr>
        <th scope="col" style="text-align: center;">#</th>
        <th scope="col" style="text-align: center;">油品</th>
        <th scope="col" style="text-align: center;">1</th>
        <th scope="col" style="text-align: center;">2</th>
        <th scope="col" style="text-align: center;">3</th>
    </tr>
</thead><tbody>';



$oil_count = 0;
foreach($data as $index => $row){
    if($row["category_id"] == '9999'){
        $oil_count ++;
        echo '<tr>';
        echo '<th scope="row" style="text-align: center; vertical-align:middle;">'.$oil_count.'</th>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["prod_name"].'</td>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["tran_date1"].'</td>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["tran_date2"].'</td>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["tran_date3"].'</td>';
        echo '</tr>';
    }
    
};
echo '</tbody></table>';

?>