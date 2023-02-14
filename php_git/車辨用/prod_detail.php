<?php
include('./SQL/MySQL_Mid.php');

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