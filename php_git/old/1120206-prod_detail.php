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

$sql = "SELECT a.product_id, b.prod_name, b.category_id, a.date1, a.date2, a.date3 FROM fr_member.sale_history a
join fr_member.proddetailinfo b
on a.product_id = b.prod_id
where car_no = ?
order by product_id";

$statement = $pdo->prepare($sql);
$statement -> bindValue(1, $car_no);           
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
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["date1"].'</td>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["date2"].'</td>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["date3"].'</td>';
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
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["date1"].'</td>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["date2"].'</td>';
        echo '<td style="text-align: center; vertical-align:middle;">'.$row["date3"].'</td>';
        echo '</tr>';
    }
    
};
echo '</tbody></table>';

?>