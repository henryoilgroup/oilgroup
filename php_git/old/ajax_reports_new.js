//-----------------------------------------------------------------設定基本資料
//var url = 'http://211.72.231.7:7010/VipappService/ServiceVipApp.asmx'
var sale_begindate = '20200818'
var sale_enddate = '20300818'
var dash_location = 2
car_no = car_no.replace("-", "")
//---------------------------------取得品項
var prod_list = FR.remoteEvaluate('=SQL("' + db_name + '","SELECT t2.prod_id FROM ProdCategory t1 join ProdDetailInfo t2 on t1.category_id = t2.category_id where is_show = 1",1)').toString().split(',')
if (prod_list[0].length == 0) {
    prod_list = (1).toString().split(',')
}


//-----------------------------------------------------------------取得今天日期
var today = new Date();
var mm = today.getMonth() + 1; // getMonth() is zero-based
var dd = today.getDate();
var yyyy = today.getFullYear()

if (mm <= 9) {
    mm = "0" + mm
}
if (dd <= 9) {
    dd = "0" + dd
}

today = yyyy + "-" + mm + "-" + dd


// setTimeout(( () => {
//     ping(cam_ip, function(status, e) {
//         if(status == "timeout"){

//             //alert(cam_ip+" 攝像頭異常！請檢查後重新整理！")
//         }else{
//             main()
//         }
//     })

// } ), 500);

//1110415註解，尚未使用，權重精準計算
//GetLPRWeight(cam_ip.split('.')[3] + "_" + island + "_" + seq);

main()

//-----------------------------------------------------------------換車





function main() {
    if (manual == 0) {
        ping(cam_ip, function (status, e) {
            if (status == "timeout") {
                _g().setCellValue("C2", null, cam_ip + "-鏡頭異常！")
                $('td[id^=C2-0-0]').css('color', '#FF0000');
                clearInterval(window.timeoutID)
                window.timeoutID = setTimeout((() => {
                    main()
                }), timeout_show);
                // 1110317修正為參數，參數部分要寫
            } else {
                clearInterval(window.timer)
                var get_cam_info = FR.remoteEvaluate('API_GET("http://' + cam_ip + '/get_search_info?select=log&limit=1","' + account + '","' + password + '")')

                if (get_cam_info == "ERROR") {
                    clearInterval(window.timeoutID)
                    window.timeoutID = setTimeout((() => {
                        main()
                    }), 10000);
                    return
                }
                //1110309修正, 顯示第X面
                // _g().setCellValue("C2", null, seq)
                _g().setCellValue("C2", null, "第 " + seq + " 面")
                $('td[id^=C2-0-0]').css('color', '#000000');

                //var get_cam_info = "{\"LPR_COUNT\": 1,\"INFORMATION\": [{\"INDEX\":1,\"TS\":\"1635131787041227\",\"MOD_TS\":\"2021-10-25 11:16:27 GMT\",\"CAR_ID\":\"97899\",\"LPR\":\"RCM3692\",\"RTIME\":\"363.0\",\"ACTION\":\"0\",\"ACT_PARAM\":\"Visitor\",\"THRESHOLD\":\"0.788941383361816\",\"ROI_X\":\"19\",\"ROI_Y\":\"10\",\"ROI_W\":\"1881\",\"ROI_H\":\"1059\",\"LP_X\":\"1395\",\"LP_Y\":\"464\",\"LP_W\":\"109\",\"LP_H\":\"68\",\"LP_BMP\":\"LPR_IMAGE/20211025111627_41243lp_RCM3692_1013144.png\",\"ROI_BMP\":\"\",\"COUNTRY\":\"TWN\",\"LPR_USER\":\"\",\"LPR_PHONE\":\"\",\"LPR_ADDRESS\":\"\",\"LPR_PAYSTATUS\":\"\",\"LPR_EXIST\":\"\",\"LPR_SCHEDULE_S\":\"\",\"LPR_SCHEDULE_E\":\"\",\"LPR_OTHER\":\"\",\"LPR_DETECT_ENDTIME\":\"\"}],\"LIST_TYPE\": \"log\"}"
                var send_msg = get_cam_info.substring(0, get_cam_info.length - 1);
                send_msg += ",\"island\":\"" + island + "\",\"island_face\":\"" + seq + "\"}";
                window.send_msg_record = send_msg

                get_cam_info = JSON.parse(get_cam_info)
                //1110426新增攝影機時監測試
                let time = get_cam_info.INFORMATION[0].MOD_TS;
                time = time.replace('time:','');
                time = time.replace(' GMT','');
                // console.log(time);
                
                if (parseFloat(get_cam_info.INFORMATION[0].THRESHOLD) >= 0.7) {

                    function car_weight_func(){
                        var car_no_weigth = ParseLPRWeight(cam_ip.split('.')[3] + "_" + island + "_" + seq, get_cam_info.INFORMATION[0].LPR);
                        if (seq == debugMedel) {
                            console.log(island + "島" + seq + "面" +
                                "\r\n寫入中：" + LPRWeightIsWrite +
                                "\r\n所有權重值本地：" + JSON.stringify(AllLPR_no) +
                                "\r\n偵測到的車牌：" + get_cam_info.INFORMATION[0].LPR +
                                "\r\n權重車牌：" + car_no_weigth +
                                "\r\n權重錯誤次數：" + ChangeCount +
                                "\r\n當前車牌：" + car_no);//ianTest
                        }
                        //LPRWeightIsWrite 防止重複寫入 //car_no_weigth 排除為空第一次多次寫入狀況
                        if (!LPRWeightIsWrite && car_no_weigth != "" && car_no != car_no_weigth) {
                            LPRWeightIsWrite = true;
                            if (seq == debugMedel) {
                                console.log(island + "島" + seq + "面" +
                                    "\r\n寫入中：" + LPRWeightIsWrite +
                                    "\r\n所有權重值本地：" + JSON.stringify(AllLPR_no) +
                                    "\r\n偵測到的車牌：" + get_cam_info.INFORMATION[0].LPR +
                                    "\r\n權重車牌：" + car_no_weigth +
                                    "\r\n權重錯誤次數：" + ChangeCount +
                                    "\r\n當前車牌：" + car_no);//ianTest
                            }
                            car_no = car_no_weigth;
                            //1110415註解，暫不使用，車號LOG寫入DB
                            //SendToDb2(cam_ip, seq, car_no, get_cam_info.INFORMATION[0].MOD_TS, JSON.stringify(AllLPR_no));
                            send_to_pos(island, send_msg)
                            if (seq == debugMedel) {
                                console.log(island + "島" + seq + "面" +
                                    "\r\n寫入中：" + LPRWeightIsWrite +
                                    "\r\n所有權重值本地：" + JSON.stringify(AllLPR_no) +
                                    "\r\n偵測到的車牌：" + get_cam_info.INFORMATION[0].LPR +
                                    "\r\n權重車牌：" + car_no_weigth +
                                    "\r\n權重錯誤次數：" + ChangeCount +
                                    "\r\n當前車牌：" + car_no);//ianTest
                            }
                            setTimeout((() => {
                                LPRWeightIsWrite = false
                            }), 10000);
                        }
                        //1110426新增攝影機時監測試
                        time_checkin(time, car_no);
                    };
                    if (debugMedel != 0){
                        //console.log(seq + "面," + seq_type);
                    }
                    if(seq_type == 'single_cam'){
                        if (parseInt(get_cam_info.INFORMATION[0].LP_Y, 10) >= (906 * y_percent / 100) && (seq == 1 || seq == 4 || seq == 5)) {
                            car_weight_func();
                        }else if (parseInt(get_cam_info.INFORMATION[0].LP_Y, 10) >= (906 * y_percent / 100) && (seq == 2 || seq == 3 || seq == 6)) {
                            car_weight_func();
                        }
                    }else if(seq_type == 'contrary_cam'){
                        if (parseInt(get_cam_info.INFORMATION[0].LP_X, 10) <= 940 && parseInt(get_cam_info.INFORMATION[0].LP_Y, 10) >= (906 * y_percent / 100) && (seq == 2 || seq == 3 || seq == 6)) {
                            car_weight_func();
                        }else if (parseInt(get_cam_info.INFORMATION[0].LP_X, 10) > 940 && parseInt(get_cam_info.INFORMATION[0].LP_Y, 10) >= (906 * y_percent / 100) && (seq == 1 || seq == 4 || seq == 5)) {
                            car_weight_func();
                        }
                    }else{
                        if (parseInt(get_cam_info.INFORMATION[0].LP_X, 10) <= 940 && parseInt(get_cam_info.INFORMATION[0].LP_Y, 10) >= (906 * y_percent / 100) && (seq == 1 || seq == 4 || seq == 5)) {
                            car_weight_func();
                        }else if (parseInt(get_cam_info.INFORMATION[0].LP_X, 10) > 940 && parseInt(get_cam_info.INFORMATION[0].LP_Y, 10) >= (906 * y_percent / 100) && (seq == 2 || seq == 3 || seq == 6)) {
                            car_weight_func();
                        }
                    };
                        
                    
                }
                clearInterval(window.timeoutID)
                window.timeoutID = setTimeout((() => {
                    main()
                }), 500);
            }
        })

    }
    else {
        var timer1 = window.setTimeout((() => {
            var url = window.location.href;
            if (url.indexOf('P_MANUAL') > -1) {
                url = url.substring(0, url.indexOf('P_MANUAL') - 1)

            }
            url += '&P_MANUAL=0'
            window.location.href = url;
            //alert(url)

        }), 1000 * 600);
        setTimeout(function () {
            //1100412暫時新增
            // let wsip = '10.72.130.205:8080';
            let ws = new WebSocket("ws://" + ip + ":" + port + "/webroot/msg_center")
            // let ws = new WebSocket("ws://" + wsip + "/webroot/msg_center")
            ws.onopen = () => {
                msg = {
                    type: "register",
                    topic: island + "_OK"
                }

                ws.send(JSON.stringify(msg))
                //ws.send("register-msg_center_emp")

            }
            ws.onmessage = event => {
                if (event.data == seq) {
                    var url = window.location.href;
                    if (url.indexOf('P_MANUAL') > -1) {
                        url = url.substring(0, url.indexOf('P_MANUAL') - 1)

                    }
                    url += '&P_MANUAL=0'
                    //alert(url)
                    window.location.href = url;
                }
            }

        }, 50)
    }
}

//1110415註解，暫不使用，車號LOG寫入DB
// function SendToDb2(cam_ip, seq, car_no, cam_time, weight_log) {
//     var ws = new WebSocket("ws://" + ip + ":8093/LPR")
//     ws.onopen = () => {
//         msg = {
//             state: "InsertLPR",
//             cam_ip: cam_ip,
//             seq: seq,
//             car_no: car_no,
//             cam_time: cam_time,
//             weight_log: weight_log
//         }
//         ws.send(JSON.stringify(msg))
//         setTimeout(() => {
//             ws.close();
//         }, 1500);
//     }
// }

//1110415註解，尚未使用，權重精準計算，與SendToDb2連動
// function GetLPRWeight(classifyName) {
//     var ws = new WebSocket("ws://" + ip + ":8093/LPR")
//     ws.onopen = () => {
//         msg = {
//             state: "GetLPRWeight",
//             classifyName: classifyName
//         }
//         ws.send(JSON.stringify(msg))
//         setTimeout(() => {
//             ws.close();
//         }, 10000);
//     }
//     ws.onmessage = event => {
//         let webSocketWeight = JSON.parse(JSON.parse(event.data).msg);
//         let webSocketWeight_IsNew = true;
//         for (let i = 0; i < webSocketWeight.length; i++) {
//             for (let j = 0; j < AllLPR_no.length; j++) {
//                 if (AllLPR_no[j][0] == webSocketWeight[i][0]) {
//                     if (AllLPR_no[j][1] == webSocketWeight[i][1]) {
//                         AllLPR_no[j][2] = AllLPR_no[j][2] + webSocketWeight[i][2];
//                         webSocketWeight_IsNew = false;
//                     }
//                 }
//             }
//             if (webSocketWeight_IsNew) {
//                 AllLPR_no.push([webSocketWeight[i][0], webSocketWeight[i][1], webSocketWeight[i][2]]);
//             }
//         }
//         if (seq == debugMedel)
//             console.log("回傳AllLPR_no：" + AllLPR_no);
//     }
// }

var AllLPR_no = new Array();
var LPRWeightIsWrite = false;
let ChangeErrorLPR_no = new Array();
let ChangeCount = 0;
function ParseLPRWeight(ClassifyName, LPR_no) {
    let LPRMain = "";
    let LPRMainWeight = -1;
    let IsNew = true;

    //權重計算
    for (let i = 0; i < AllLPR_no.length; i++) {
        let LRPClassifyName = AllLPR_no[i][0];//分類名稱
        let LRPNumber = AllLPR_no[i][1];//車號
        let Weight = AllLPR_no[i][2];//權重值

        if (LRPClassifyName == ClassifyName) {
            if (LRPNumber == LPR_no) {
                Weight++;
                AllLPR_no[i][2] = Weight;
                IsNew = false;
            }
            if (Weight > LPRMainWeight) {
                LPRMain = LRPNumber;
                LPRMainWeight = Weight;
            }
        }
    }

    //新車號加入陣列
    if (IsNew) {
        AllLPR_no.push([ClassifyName, LPR_no, 0]);
    }

    //若權重發生轉換次數超過，則權重歸0
    if (LPR_no != LPRMain) {
        ChangeCount++;

        //計算 錯誤車號
        let ChangeErrorLPR_no_IsNew = true;
        for (let i = 0; i < ChangeErrorLPR_no.length; i++) {
            if (ChangeErrorLPR_no[i][0] == ClassifyName) {
                if (ChangeErrorLPR_no[i][1] == LPR_no) {
                    ChangeErrorLPR_no_IsNew = false;
                    break;
                }
            }
        }
        if (ChangeErrorLPR_no_IsNew) {
            ChangeErrorLPR_no.push([ClassifyName, LPR_no]);
        }

        //錯誤次數大於設定值
        if (ChangeCount >= LPRWeightError) {
            //清除沒有在 錯誤次數範圍內的車號
            for (let i = 0; i < AllLPR_no.length; i++) {
                let ChangeErrorIsDel = true;
                if (AllLPR_no[i][0] == ClassifyName) {
                    for (let j = 0; j < ChangeErrorLPR_no.length; j++) {
                        if (ChangeErrorLPR_no[j][0] == ClassifyName) {
                            if (AllLPR_no[i][1] == ChangeErrorLPR_no[j][1]) {
                                ChangeErrorIsDel = false;
                                break;
                            }
                        }
                    }
                    if (ChangeErrorIsDel) {
                        AllLPR_no.splice(i, 1);
                        i--;
                    }
                }
            }
            ChangeCount = 0;
        }
    } else {
        ChangeCount = 0;
        ChangeErrorLPR_no = new Array();
    }
    return LPRMain;
}

//-----------------------------------------------------------------模擬換車
/*
var time = getRandomInt(20,40)
var timeoutID = window.setTimeout(( () => {
    var car_no_random = getRandomInt(0,5)
    //alert(car_no_random)
    if(car_no_random == 0){
        car_no = 'DEF9999'
    }
    else if(car_no_random == 1){
        car_no = 'ABC8888'
    }
    else if(car_no_random == 2){
        car_no = 'DEF8888'
    }
    else if(car_no_random == 3){
        car_no = 'GHI8888'
    }
    else if(car_no_random == 4){
        car_no = 'ABC1111'
    }
    var url = window.location.href;  
    if (url.indexOf('car_no') > -1){
        url = url.substring(0,url.indexOf('car_no')-1)

    }
    url += '&car_no=' + car_no
    
    

    window.location.href = url;
} ), time*1000);

*/

//alert(car_no.substring(0,dash_location)+"-"+car_no.substring(dash_location,car_no.length))
//-----------------------------------------------------------------呼叫ＡＰＩ並進行前端更新

API(url, car_no, sale_begindate, sale_enddate, prod_list)
function API(url, car_no, sale_begindate, sale_enddate, prod_list) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', url, true);
    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap:Envelope ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
        'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soap:Body>' +
        '<SearchVipCar xmlns="http://tempuri.org/">' +
        ' <car_no>' + car_no.substring(0, dash_location) + "-" + car_no.substring(dash_location, car_no.length) + '</car_no> ' +
        ' <sale_begindate>' + sale_begindate + '</sale_begindate>' +
        ' <sale_enddate>' + sale_enddate + '</sale_enddate>' +
        ' <prod_list>'

    for (var i = 0; i < prod_list.length; i++) {
        sr += '  <string>' + prod_list[i].toString() + '</string>'
    }

    sr += '</prod_list>' +
        '</SearchVipCar>' +
        '</soap:Body>' +
        '</soap:Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {

                var result = xmlhttp.responseText
                result = result.substring(288, result.length - 72)

                result = JSON.parse(result)
                //-----------------------------------------------------------------呼叫函示進行更新前端
                refresh(result)

            }
        }
    }

    xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');

    xmlhttp.send(sr);
}








function refresh(data) {

    //-----------------------------------------------------------------判斷是哪種會員，隱藏掉ＱＲ＿ＣＯＤＥ或隱藏掉普通文字匡
    let car_no_replace = filter(car_no);
    //禮遇卡折扣
    let courtesy_discount = courtesy_ajax(car_no_replace,ip);
    //簽帳資料
    let subcustcar = subcustcar_ajax(car_no_replace,ip);
     //車隊卡折扣
    let fleet_oiltype = fleet_ajax(car_no_replace,ip);
    //現消資料
    let cash_car_data = cash_car_ajax(car_no_replace,ip);
    
    //1110308更換簽帳油品顏色
    //1110408修正 0 || 00 都是柴油
    function car_oil_type(oil_category) {
        if (oil_category == '0' || oil_category == '00') {
            $('td[id^=C3-0-0]').css('background-color', '#2894FF');
        }
        else if (oil_category == '92') {
            $('td[id^=C3-0-0]').css('background-color', '#CA8EC2');
        }
        else if (oil_category == '95') {
            $('td[id^=C3-0-0]').css('background-color', '#FFA042');
        }
        else if (oil_category == '98') {
            $('td[id^=C3-0-0]').css('background-color', '#8CEA00');
        }
    };

    //C7顯示QRCODE控制在CPT上，C21 = 1顯示qrcode
    //1110303新增禮遇卡顏色為 綠色
    //1110407新增車隊卡，改變順序, 車隊卡最優先判斷
    if(fleet_oiltype != ''){
        _g().setCellValue("C8", null, "車隊卡")
        _g().setCellValue("C7", null, car_no)

        $('td[id^=C5-0-0]').css('color', '#BB3D00');
        $('td[id^=C6-0-0]').css('color', '#BB3D00');
        $('td[id^=C8-0-0]').css('color', '#BB3D00');

        //更換油品顏色
        car_oil_type(fleet_oiltype[0].oil_type);

        if (_g().getWidgetByName("delete_qr") != null) {
            _g().getWidgetByName("delete_qr").fireEvent("click")
            _g().getWidgetByName("delete_qr").setEnable(false)
            return
        }
    }else if (courtesy_discount != '') {
        if (debugMedel != 0) {
            console.log('禮遇卡折扣: ' + courtesy_discount);
        }
        _g().setCellValue("C8", null, "禮遇卡")
        _g().setCellValue("C7", null, iccardno + car_no)
        // $('td[id^=C3-0-0]').css('color', '#006030');
        $('td[id^=C5-0-0]').css('color', '#006030');
        $('td[id^=C6-0-0]').css('color', '#006030');
        // $('td[id^=C7-0-0]').css('color', '#006030');
        $('td[id^=C8-0-0]').css('color', '#006030');

        if (_g().getWidgetByName("delete_qr") != null) {
            _g().getWidgetByName("delete_qr").fireEvent("click")
            _g().getWidgetByName("delete_qr").setEnable(false)
            return
        }
    } else if (subcustcar != '') {
        //簽帳公司統編
        let subcustcar_uid = subcustcar[0].CustId;
        //簽帳公司簡稱
        let subcustcar_name = subcustcar[0].shortname;
        //簽帳車號油品
        let subcustcar_oiltype = subcustcar[0].OilType;
        //簽帳公司超加額度
        let cextent = subcustcar[0].cextent;
        //簽帳公司餘額
        let subcustcar_amt = subcustcar_amt_ajax(subcustcar_uid);


        if (debugMedel != 0) {
            console.log('簽帳客戶統編: ' + subcustcar_uid);
            console.log('簽帳客戶名稱: ' + subcustcar_name);
            console.log('簽帳客戶餘額: ' + subcustcar_amt);
            console.log('簽帳客戶油品: ' + subcustcar_oiltype);
            console.log('簽帳臨時超加: ' + cextent);
        }
        if (subcustcar_amt <= 0) {
            let td = document.getElementById('C5-0-0');
            td.innerHTML = subcustcar_name + "<br/><span style='color:red;'>即時餘額:$" + subcustcar_amt + "</span>" + ",  臨時超加:$" + cextent;
        } else {
            _g().setCellValue("C5", null, subcustcar_name + "\n即時餘額:$" + subcustcar_amt + ",  臨時超加:$" + cextent);
        };
        //1110303更改C5為公司名+餘額，C7為車號       
        _g().setCellValue("C4", null, subcustcar_uid);
        // _g().setCellValue("C5", null, subcustcar_name + "\n即時餘額:$" + subcustcar_amt + ", 臨時超加:$" + cextent);
        _g().setCellValue("C8", null, "簽帳客戶");
        _g().setCellValue("C7", null, car_no);

        // $('td[id^=C3-0-0]').css('color', '#FF0000');
        $('td[id^=C5-0-0]').css('color', '#616130');
        $('td[id^=C6-0-0]').css('color', '#616130');
        // $('td[id^=C7-0-0]').css('color', '#FF0000'); //C7改為qrcode後就不用變色 
        $('td[id^=C8-0-0]').css('color', '#616130');


        let charge_canbuy = _g().getCellValue("C19", null);
        // console.log(charge_canbuy);
        // console.log(charge_canbuy.includes("不可買"));

        if (charge_canbuy.includes("不可買")) {
            $('td[id^=C19-0-0]').css('font-weight', 'bold');
            $('td[id^=C19-0-0]').css('color', '#FF0000');
        } else {
            $('td[id^=C19-0-0]').css('color', '#004B97');
        }
        //var timeoutID = window.setTimeout(( () => {
        //_g().setCellValue("E1",null,1)
        //} ), 1000);

        //更換油品顏色
        car_oil_type(subcustcar_oiltype);

        if (_g().getWidgetByName("delete_qr") != null) {
            _g().getWidgetByName("delete_qr").fireEvent("click")
            _g().getWidgetByName("delete_qr").setEnable(false)
            return
        }
    } else if (cash_car_data != '') {
        //----------簽帳現銷油品
        let cash_car = cash_car_data[0].carno;
        let cash_car_oiltype = cash_car_data[0].OilType;
        
        if (debugMedel != 0) {
            console.log('簽帳現銷車號: ' + cash_car);
            console.log('簽帳現銷油品: ' + cash_car_oiltype);
        }
        _g().setCellValue("C8", null, "簽帳現銷")
        _g().setCellValue("C7", null, cash_car)
        // $('td[id^=C3-0-0]').css('color', '#004B97');
        $('td[id^=C5-0-0]').css('color', '#004B97');
        $('td[id^=C6-0-0]').css('color', '#004B97');
        // $('td[id^=C7-0-0]').css('color', '#004B97');

        $('td[id^=C8-0-0]').css('color', '#004B97');

        //更換油品顏色
        car_oil_type(cash_car_oiltype);

        if (_g().getWidgetByName("delete_qr") != null) {
            _g().getWidgetByName("delete_qr").fireEvent("click")
            _g().getWidgetByName("delete_qr").setEnable(false)
            return
        }
    } else {
        //1110308修改，會員判斷寫在向API要資料後
        // let last_point = '';
        // _g().setCellValue("C8", null, "會員")
        // // _g().setCellValue("C7", null, last_point + "點")

        // if (_g().getWidgetByName("delete_qr") != null) {
        //     _g().getWidgetByName("delete_qr").fireEvent("click")
        //     _g().getWidgetByName("delete_qr").setEnable(false)
        //     return

        // }
    };

    var retCode = data.objStatus.retCode
    var retMsg = data.objStatus.retMsg
    //-----------------------------------------------------------------判斷是否有此車牌
    if (retCode == -1) {
        //------------------------------------無此車牌，遞迴
        //------------------------------------遞迴找尋車牌的 “-” 位置
        if (dash_location < 4) {
            dash_location += 1
            //alert(car_no.substring(0,dash_location)+"-"+car_no.substring(dash_location,car_no.length))
            API(url, car_no, sale_begindate, sale_enddate, prod_list)
            return
        }
        //------------------------------------無此車牌，進行無車牌的前端設定
        else {
            if (_g().getWidgetByName("delete_qr") != null) {
                _g().getWidgetByName("delete_qr").fireEvent("click")
                _g().getWidgetByName("delete_qr").setEnable(false)
            }

            _g().setCellValue("C3", null, car_no)
            // var cate_id = FR.remoteEvaluate('=SQL("' + db_name + '","SELECT t1.category_id FROM ProdCategory t1  where is_show=1 limit 6",1)')
            var cate_id = cate_id_ajax();
            
            for (var i = 0; i < cate_id.length; i++) {
                _g().setCellValue("C" + (11 + i).toString(), null, cate_id[i])
                _g().getWidgetByCell("D" + (11 + i).toString()).setVisible(true)
            }
            return
        }
    }







    //-----------------------------------------------------------------抽取ＡＰＩ吐回的資料

    var vip_id = data.vipInfo.vip_id
    var name = data.vipInfo.name
    var zip = data.vipInfo.zip
    var address = data.vipInfo.address
    var telephone = data.vipInfo.telephone
    var sex = data.vipInfo.sex.toString()
    var birthday = data.vipInfo.birthday
    var email = data.vipInfo.email
    var mobile = data.vipInfo.mobile
    var last_point = data.vipInfo.last_point
    var last_amt = data.vipInfo.last_amt
    var vip_level = data.vipInfo.vip_level
    var vip_level_name = data.vipInfo.vip_level_name
    var end_date = data.vipInfo.end_date
    var id_card = data.vipInfo.id_card
    var iccardno = data.vipInfo.iccardno
    var searchtyp = data.vipInfo.searchtyp
    var fax = data.vipInfo.fax
    var occupation = data.vipInfo.occupation
    var company = data.vipInfo.company
    var linkman = data.vipInfo.linkman
    var contact = data.vipInfo.contact
    var work_title = data.vipInfo.work_title
    var company_zip = data.vipInfo.company_zip
    var company_addr = data.vipInfo.company_addr
    var black = data.vipInfo.black
    var discount = data.vipInfo.discount
    var buyer_number = data.vipInfo.buyer_number
    var vip_code = data.vipInfo.vip_code
    var last_examination_date = data.vipInfo.last_examination_date.substring(0, 10)
    var oil_prodid = data.vipInfo.oil_prodid
    var issued_date = data.vipInfo.issued_date.substring(0, 10)
    var car_type = data.vipInfo.car_type
    var memo = data.vipInfo.memo
    var SaleInfo = data.vipInfo.SaleInfo


    //-----------------------------------------------------------------整理ＡＰＩ吐回的商品資訊 存入陣列
    var ProdID = []
    var ProdDate = []

    for (var i = 0; i < SaleInfo.length; i++) {
        var shop_id = SaleInfo[i].shop_id
        var sale_id = SaleInfo[i].sale_id
        var sale_date = SaleInfo[i].sale_date.substring(0, 10)
        var SaleDetailInfo = SaleInfo[i].SaleDetailInfo

        for (var j = 0; j < SaleDetailInfo.length; j++) {
            var prod_id = SaleDetailInfo[j].prod_id
            var prod_name = SaleDetailInfo[j].prod_name
            var qty = SaleDetailInfo[j].qty

            var flag = 0
            for (var k = 0; k < ProdID.length; k++) {
                if (ProdID[k] == prod_id) {
                    flag = 1;
                    if (date_bigger(sale_date, ProdDate[k])) {
                        ProdDate[k] = sale_date
                    }
                    break;
                }
            }

            if (flag == 0) {
                ProdID.push(prod_id)
                ProdDate.push(sale_date)
            }
        }
    }


    //-----------------------------------------------------------------判斷下次驗車日期
    if (last_examination_date.length < 10) {
        _g().setCellValue("C9", null, date_add(issued_date, 60))
    }
    else if (date_bigger(date_add(last_examination_date, 6), date_add(issued_date, 120))) {
        _g().setCellValue("C9", null, date_add(last_examination_date, 6))
    } else {
        _g().setCellValue("C9", null, date_add(last_examination_date, 12))
    }


    //-----------------------------------------------------------------設定前端資料 如車牌 會員號碼 名稱等等

    _g().setCellValue("B2", null, vip_id)
    _g().setCellValue("C3", null, car_no.substring(0, dash_location) + "-" + car_no.substring(dash_location, car_no.length))

    if (vip_code != null) {
        _g().setCellValue("C4", null, vip_code)
    }

    if (name != null) {
        if (sex == "0") {
            _g().setCellValue("C5", null, name.substring(0, 1) + "先生")
        }
        else if (sex == "1") {
            _g().setCellValue("C5", null, name.substring(0, 1) + "女士")
        }
        else {
            _g().setCellValue("C5", null, name)
        }
    }

    //若C8為會員，將C7設為API所得到的點數，1110308修改，只有會員才顯示出會員，非會員會顯示non，流程為要不到API資料就不會執行到這段
    //1110407新增車隊卡
    let member_type = _g().getCellValue("C8", null);
    // console.log(member_type);
    if (member_type !== "禮遇卡" && member_type !== "簽帳現銷" && member_type !== "簽帳客戶" && member_type !== "車隊卡") {
        _g().setCellValue("C8", null, "會員")
        _g().setCellValue("C7", null, last_point + "點");


        if (_g().getWidgetByName("delete_qr") != null) {
            _g().getWidgetByName("delete_qr").fireEvent("click")
            _g().getWidgetByName("delete_qr").setEnable(false)
            return
        }
    }


    //-----------------------------------------------------------------判斷油品來更改顏色


    if (oil_prodid == '00') {
        $('td[id^=C3-0-0]').css('background-color', '#2894FF');
    }
    else if (oil_prodid == '92') {
        $('td[id^=C3-0-0]').css('background-color', '#CA8EC2');
    }
    else if (oil_prodid == '95') {
        $('td[id^=C3-0-0]').css('background-color', '#FFA042');
    }
    else if (oil_prodid == '98') {
        $('td[id^=C3-0-0]').css('background-color', '#8CEA00');
    }

    //-----------------------------------------------------------------獲取推銷週期和售出的週期

    //var recommend_period = FR.remoteEvaluate('=SQL("'+db_name+'","SELECT days FROM ProdPeriod t1  where type= 0 order by period_id ",1)')
    //var sold_period = FR.remoteEvaluate('=SQL("'+db_name+'","SELECT days FROM ProdPeriod t1  where type= 1 order by period_id ",1)')

    //var recommend_period_cate = FR.remoteEvaluate('=SQL("'+db_name+'","SELECT category_id FROM ProdPeriod t1  where type= 0 order by period_id ",1)')
    //var sold_period_cate = FR.remoteEvaluate('=SQL("'+db_name+'","SELECT category_id FROM ProdPeriod t1  where type= 1 order by period_id ",1)')

    //-----------------------------------------------------------------獲取所有有效品項
    // var cate_id = FR.remoteEvaluate('=SQL("' + db_name + '","SELECT t1.category_id FROM ProdCategory t1  where is_show=1 limit 6 ",1)')
    
    var cate_id = cate_id_ajax();

    //-----------------------------------------------------------------獲取對此會員已推銷的項目以及其週期到達時間
    //var recommended_id_array = FR.remoteEvaluate('=SQL("'+db_name+'","select t1.category_id,DATEADD (dd , '+recommend_period.toString()+' , t1.recommended_time ) as re_time from ProdRecommeded t1 join ProdCategory t2 on t1.category_id = t2.category_id where is_show = 1  and vip_id = \''+vip_id+'\' order by t1.category_id",1)').toString().split(',')
    //var recommended_date_array = FR.remoteEvaluate('=SQL("'+db_name+'","select t1.category_id,DATEADD (dd , '+recommend_period.toString()+' , t1.recommended_time ) as re_time from ProdRecommeded t1 join ProdCategory t2 on t1.category_id = t2.category_id where is_show = 1  and vip_id = \''+vip_id+'\' order by t1.category_id",2)').toString().split(',')

    //1110527註解，改用ajax
    // var recommended_id_array = FR.remoteEvaluate('=SQL("' + db_name + '","select t1.category_id from ProdRecommeded t1 join ProdCategory t2 on t1.category_id = t2.category_id where is_show = 1  and vip_id = \'' + vip_id + '\' order by t1.category_id",1)').toString().split(',')
    // var recommended_date_array = FR.remoteEvaluate('=SQL("' + db_name + '","select t1.recommended_time as re_time from ProdRecommeded t1 join ProdCategory t2 on t1.category_id = t2.category_id where is_show = 1  and vip_id = \'' + vip_id + '\' order by t1.category_id",1)').toString().split(',')


    let recommended_array = prod_recommand_ajax(vip_id)
    var recommended_id_array = [];
    var recommended_date_array = [];
    for (let i = 0; i<recommended_array.length; i++) {
        recommended_id_array.push(recommended_array[i].category_id);
        recommended_date_array.push(recommended_array[i].recommended_time);
    }

    let re_period_array = re_period_ajax(recommended_id_array);
    let re_period = [];
    for (var j = 0; j < recommended_id_array.length; j++) {
        
        re_period.push(re_period_array[j].days);

        // var re_period = parseInt(FR.remoteEvaluate('=SQL("' + db_name + '","SELECT days FROM ProdPeriod t1  where type= 0 and category_id = \'' + recommended_id_array[j] + '\' order by period_id ",1,1)').toString(), 10)

        recommended_date_array[j] = date_add_day(recommended_date_array[j], parseInt(re_period[j],10));

    }

    //alert(   FR.remoteEvaluate('=SQL("'+db_name+'","select ADDDATE( t1.recommended_time '+recommend_period.toString()+') as re_time from ProdRecommeded t1 join ProdCategory t2 on t1.category_id = t2.category_id where is_show = 1  and vip_id = \''+vip_id+'\' order by t1.category_id",1)'))


    //-----------------------------------------------------------------判斷是否已達收出週期，如果沒達到則改為999999999，已達到則將值改為品項ID方便等等判斷要不要隱藏此項目
    for (var j = 0; j < ProdID.length; j++) {

        var cate = FR.remoteEvaluate('=SQL("' + db_name + '","SELECT t1.category_id FROM ProdCategory t1 join ProdDetailInfo t2 on t1.category_id = t2.category_id where t2.prod_id =  \'' + ProdID[j] + '\'",1,1)')
        var sold_period = parseInt(FR.remoteEvaluate('=SQL("' + db_name + '","SELECT days FROM ProdPeriod t1  where type= 1 and category_id = \'' + cate + '\' order by period_id ",1,1)').toString(), 10)
        var sold_date = date_add_day(ProdDate[j], sold_period)

        if (date_bigger(sold_date, today)) {
            //ProdID[j] = FR.remoteEvaluate('=SQL("'+db_name+'","SELECT t1.category_id FROM ProdCategory t1 join ProdDetailInfo t2 on t1.category_id = t2.category_id where t2.prod_id =  \'' + ProdID[j] +'\'",1,1)')
            ProdID[j] = cate
        }
        else {
            ProdID[j] = "9999999999"
        }
    }


    //alert(cate_id +"---" + recommended_id_array + "---" + recommended_date_array)
    //-----------------------------------------------------------------將六個品項放上前端
    for (var i = 0; i < cate_id.length; i++) {

        _g().setCellValue("C" + (11 + i).toString(), null, cate_id[i])
        _g().getWidgetByCell("D" + (11 + i).toString()).setVisible(true)

        //-----------------------------------------------------------------未達推銷週期的不用推銷
        for (var j = 0; j < recommended_id_array.length; j++) {
            if (recommended_id_array[j] == cate_id[i] && date_bigger(recommended_date_array[j], today)) {
                _g().setCellValue("C" + (11 + i).toString(), null, "")
                _g().getWidgetByCell("D" + (11 + i).toString()).setVisible(false)
                break;
            }
        }

        //-----------------------------------------------------------------未達購買週期的不用推銷
        for (var j = 0; j < ProdID.length; j++) {
            if (ProdID[j] == cate_id[i]) {
                _g().setCellValue("C" + (11 + i).toString(), null, "")
                _g().getWidgetByCell("D" + (11 + i).toString()).setVisible(false)
                break;
            }
        }


    }


    //-----------------------------------------------------------------會員重點提示

    // var info = FR.remoteEvaluate('=SQL("' + db_name + '","select detail from VipMemo where vip_id = \'' + vip_id + '\' and used_flag = 2 and type = \'habit\' order by used_flag,memo_id DESC",1,1)')


    let info = member_info(vip_id);
    if (info.length != 0) {
        var timeoutID = window.setTimeout((() => {
            var iframe = $("<iframe id='inp' name='inp' width='100%' height='100%' scrolling='yes' frameborder='0'>");
            var url = "${servletURL}?reportlet=" + path_vip + "&op=write&P_INFO=" + info;
            iframe.attr("src", url);
            var o = {
                title: name,
                width: 250,
                height: 250
            };
            window.FR.showDialog(o.title, o.width, o.height, iframe, o);
        }), 50);
    }
}


//-----------------------------------------------------------------判斷第一個日期是否比第二個大
function date_bigger(date1, date2) {
    var g1 = new Date(date1);
    var g2 = new Date(date2);
    if (g1.getTime() > g2.getTime())
        return true;
    else
        return false

}

//-----------------------------------------------------------------將日期加上某個月份的數量
function date_add(date, month) {
    var get_date = new Date(date)
    var newDate = new Date(get_date.setMonth(get_date.getMonth() + month));
    return newDate
}

//-----------------------------------------------------------------將日期加上某個天數的數量
function date_add_day(date, day) {
    var get_date = new Date(date)
    var newDate = new Date(get_date.setDate(get_date.getDate() + day));
    var mm = newDate.getMonth() + 1; // getMonth() is zero-based
    var dd = newDate.getDate();
    var yyyy = newDate.getFullYear()
    if (mm <= 9) {
        mm = "0" + mm
    }
    if (dd <= 9) {
        dd = "0" + dd
    }
    return yyyy + "-" + mm + "-" + dd
}

//-----------------------------------------------------------------產生亂數

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


function change_car() {
    //1110413新增換車就關閉彈窗
    window.FR.closeDialog();
    var url = window.location.href;
    if (url.indexOf('car_no') > -1) {
        url = url.substring(0, url.indexOf('car_no') - 1)

    }
    url += '&car_no=' + car_no
    if (url.indexOf('P_MANUAL') > -1) {
        url = url.substring(0, url.indexOf('P_MANUAL') - 1)

    }

    //window.parent.FR.doHyperlinkByGet(url, {}, 'RHIFRAME'+(seq-1).toString());
    //window.location.href = url;
    FR.ajax({
        url: FR.servletURL + '?op=fr_dialog&cmd=parameters_d',
        type: 'POST',
        data: { car_no: car_no },
        headers: { sessionID: sessionID },
        complete: function (res, status) {
            if (FR && FR.Chart && FR.Chart.WebUtils) {
                FR.Chart.WebUtils.clearCharts()
            }
            if (FR && FR.destroyDialog) {
                _g().loadContentPane()
            }
            API(url, car_no, sale_begindate, sale_enddate, prod_list)
        }
    })
}


document.getElementById('C7-0-0').onclick = QR_CODE_BIG;

function QR_CODE_BIG() {
    let car_no_replace = filter(car_no);

    // var qr_code = _g().getCellValue("C7",null)
    //1110407新增車隊卡
    if (_g().getCellValue("C8", null) == "禮遇卡") {
        //1110307修正sql語法，加上and status = 1, 更改欄位名稱， start_date 更改為 date_f, end_date更改為 date_e
        //禮遇卡折扣
        // let courtesy_discount = FR.remoteEvaluate('=SQL("' + db_name + '","select discount from courtesy_carlist where REPLACE( car_no, \'-\' , \'\' ) = \'' + car_no_replace + '\' and date_f <= date(now()) and date_e >= date(now()) and status = 1",1,1)');
        // console.log("禮遇卡折扣" + courtesy_discount);

        let courtesy_discount = courtesy_ajax(car_no_replace,ip);

        //禮遇卡卡號
        let gmvip = 'GMVIP%';
        var courtesy_cardNo = FR.remoteEvaluate('=SQL("3s_db","select dcard_no from dcard_mbr where car_no = \'' + courtesy_discount + '\' and cust_id like \'' + gmvip + '\' ",1,1)');
        // console.log(courtesy_cardNo);
        var courtesy_carNo = courtesy_discount;
        //1110401修正禮遇卡彈窗與簽帳抓相同報表
        // var url = "${servletURL}?reportlet=" + path + "&op=write&P_QR_CODE=" + courtesy_cardNo + "&P_QR=" + courtesy_carNo + "&category=1";
        var url = "${servletURL}?reportlet=禮遇卡測試/function_qrcode.cpt&op=write&P_FR_IP=" + ip + "&P_FR_PORT=" + port + "&P_QR_CODE=" + courtesy_carNo + "&category=1" + "&P_QR=" + courtesy_cardNo;
        // console.log(car_no_replace);
        showwindow(url);
        if (debugMedel != 0) {
            console.log('禮遇卡折扣: ' + courtesy_discount);
            console.log('禮遇卡卡號: ' + courtesy_cardNo);
        };
    } else if (_g().getCellValue("C8", null) == "簽帳現銷") {
        //1110303新增變數cash_car，為了帶入正確的車號含 - ，再進DB撈一次
        // let cash_car = FR.remoteEvaluate('=SQL("local_mysql","SELECT carno FROM oil.st_oil_credit_cash_car where status = 1 and REPLACE( carno, \'-\' , \'\' ) = \'' + car_no_replace + '\'",1,1)');


        let cash_car = cash_car_ajax(car_no_replace,ip)[0].carno;

        //1110318修改彈窗另一個報表，function鍵
        // var url = "${servletURL}?reportlet=" + path + "&op=write&P_QR_CODE=" + cash_car + "&category=2";
        var url = "${servletURL}?reportlet=禮遇卡測試/function_qrcode.cpt&op=write&P_FR_IP=" + ip + "&P_FR_PORT=" + port + "&P_QR_CODE=" + cash_car + "&category=2" + "&P_QR=cash";
        showwindow(url);
    } else if (_g().getCellValue("C8", null) == "簽帳客戶") {
        //1110303新增變數subcustcar_no，為了帶入正確的車號含 - ，再進DB撈一次
        // let subcustcar_no = FR.remoteEvaluate('=SQL("local_mysql","select CarNo from st_oil_credit_car where status = 1  and REPLACE( carNo, \'-\' , \'\') = \'' + car_no_replace + '\'",1,1)');

        //簽帳車號
        let subcustcar_no = subcustcar_ajax(car_no_replace,ip)[0].Carno;

        //1110318修改彈窗另一個報表，function鍵
        // var url = "${servletURL}?reportlet=" + path + "&op=write&P_QR_CODE=" + subcustcar_no + "&category=0";
        var url = "${servletURL}?reportlet=禮遇卡測試/function_qrcode.cpt&op=write&P_FR_IP=" + ip + "&P_FR_PORT=" + port + "&P_QR_CODE=" + subcustcar_no + "&category=0" + "&P_QR=credit";
        showwindow(url);
    }else if(_g().getCellValue("C8", null) == "車隊卡"){
        // let fleet_cardno = FR.remoteEvaluate('=SQL("' + db_name + '","select remark from courtesy_carlist where REPLACE( car_no, \'-\' , \'\' ) = \'' + car_no_replace + '\' and vip_no = 905000 and status = 905",1,1)');
        
        //車隊卡車號
        let fleet_cardno = fleet_ajax(car_no_replace,ip)[0].car_no;

        var url = "${servletURL}?reportlet=禮遇卡測試/function_qrcode.cpt&op=write&P_FR_IP=" + ip + "&P_FR_PORT=" + port + "&P_QR_CODE=" + fleet_cardno + "&category=3" + "&P_QR=905";
        showwindow(url);
    };
    //1110303新增function，解決0302只要點擊C7就會跳出彈窗的問題
    function showwindow(url) {
        console.log(url);
        var iframe = $("<iframe id='inp' name='inp' width='100%' height='100%' scrolling='yes' frameborder='0'>");
        iframe.attr("src", url);
        var o = {
            title: "QR_CODE",
            width: 250,
            height: 250
        };

        window.FR.showDialog(o.title, o.width, o.height, iframe, o);
    };


}


document.getElementById('C2-0-0').onclick = cancel;
function cancel() {
    var url = window.location.href;
    if (url.indexOf('car_no') > -1) {
        url = url.substring(0, url.indexOf('car_no') - 1)

    }
    if (url.indexOf('P_MANUAL') > -1) {
        url = url.substring(0, url.indexOf('P_MANUAL') - 1)

    }
    url += '&P_MANUAL=0'
    window.location.href = url;
}

function send_to_pos(island, send_msg) {
    //1100412暫時新增
    // let wsip = '10.72.130.205:8080';
    var ws = new WebSocket("ws://" + ip + ":" + port + "/webroot/msg_center")
    // var ws = new WebSocket("ws://" + wsip + "/webroot/msg_center")
    // console.log("ws://" + ip + ":" + port + "/webroot/msg_center");
    // console.log(send_msg);
    ws.onopen = () => {
        msg = {
            type: "msg",
            topic: island,
            msg: send_msg
        }
        ws.send(JSON.stringify(msg))
        change_car()
    }


}

function ping(ip, callback) {
    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
        var _that = this;
        this.img = new Image();
        this.img.onload = function () {
            _that.inUse = false;
            //clearTimeout(_thst.timer)
            _that.callback('responded');

        };
        this.img.onerror = function (e) {
            if (_that.inUse) {
                _that.inUse = false;
                //clearTimeout(_thst.timer)
                _that.callback('responded', e);
            }

        };
        this.start = new Date().getTime();
        this.img.src = "http://" + ip;
        this.timer = setTimeout(function () {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('timeout');
            }
        }, time_check);
        // 1110317修正為參數，參數部分要寫
    }
};

//忽略車號的 - 
function filter(str) {
    var pattern = /-/g;
    return str.replace(pattern, "");
}



//1110419新增ws簽到，若沒簽到則會被POS_AUTO關閉

checkin_posauto()

function checkin_posauto() {
    let island_ip = ip.split('.')[0] + "." + ip.split('.')[1] + "." + ip.split('.')[2] + "." + island + "0:8093";
    // console.log(island_ip);
    // var ws = new WebSocket("ws://" + island_ip);
    var ws = new WebSocket("ws://127.0.0.1:8093");
    ws.onopen = () => {
        msg = {
            state: "checkin",
            frequency: frequency,
            waittime: waittime,
        }
        ws.send(JSON.stringify(msg))
        // console.log("第1次送出");
        setInterval (function(){
            msg = {
                state: "checkin",
                frequency: frequency,
                waittime: waittime,
            }
            ws.send(JSON.stringify(msg))
            //console.log("送出");
        },frequency*1000)
    }
}

//1110426新增攝影機時間測試，權重車號與車號頁面比對
function time_checkin(time, car_test){
    // var get_cam_info = FR.remoteEvaluate('API_GET("http://' + cam_ip + '/get_search_info?select=log&limit=1","' + account + '","' + password + '")')
    if (debugMedel != 0){
        console.log("面: " + seq);
        console.log("報表車號: " + _g().getCellValue("C3", null))
        console.log("鏡頭車號: " + car_test)
        console.log("cam: " + time);
    }
    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    let sec = new Date().getSeconds();
    if (hour <= 9) {
        hour = "0" + hour
    }
    if (minute <= 9) {
        minute = "0" + minute
    }
    if (sec <= 9) {
        sec = "0" + sec
    }
    console.log("now: " + today + " " + hour + ":" + minute + ":"+  sec);
    if(car_test != _g().getCellValue("C3", null) && _g().getCellValue("C3", null) != ''){
        if (debugMedel != 0){
            console.log('車號不符20秒後重整');
        }
        setTimeout((() => {
            if(car_test != _g().getCellValue("C3", null)){
                if (debugMedel != 0){
                    console.log(seq +'面:頁面刷新');
                }
                cancel();
            }else{
                if (debugMedel != 0){
                    console.log(seq +'面:二次檢查正確');
                }
            }
        }), 20000);
        
    }else{
        if (debugMedel != 0){
            console.log('車號正確');
        }
    }
    if (debugMedel != 0){
        console.log("-------------------------------------------------------")
    }
};


//1110504時間跑馬燈，目的讓網頁不要閒置造成休眠，放在品項標題欄
function time_clock(){
    setInterval(function(){
    var today_test = new Date();
    var MM = today_test.getMonth() + 1; // getMonth() is zero-based
    var dd = today_test.getDate();
    var yyyy = today_test.getFullYear();
    var hh = today_test.getHours();
    var mm = today_test.getMinutes();
    var ss = today_test.getSeconds();

    if (MM <= 9) {
        MM = "0" + MM
    }
    if (dd <= 9) {
        dd = "0" + dd
    }
    if (hh <= 9) {
        hh = "0" + hh
    }
    if (mm <= 9) {
        mm = "0" + mm
    }
    if (ss <= 9) {
        ss = "0" + ss
    }
    
    now_time = yyyy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss
        // console.log(today);
        // _g().setCellValue("C18", null, now_time)


        _g().setCellValue("C10", null, "<span style='color:#ffcc99;'>"+mm+"</span>品項<span style='color:#ffcc99;'>"+ss+"</span>")
    },1000)
}

time_clock();



//1110525新增判斷會員類別用AJAX------------------------------------------------
//禮遇卡折扣
function courtesy_ajax(car_no_replace, ip){
    let res;
    $.ajax({
        method: "POST",
        url: "http://"+ ip +":8095/courtesy_discount.php",
        data: {
            'car_no_replace': car_no_replace,
            },
        dataType: "text",
        timeout: 5000,
        async:false,
        //crossDomain: true,
        success: function (response) {
            if(response == '' || response.includes("error")){
                res = '';
            }else{
                res = response;
            }
        },
        error: function (exception) {
            console.log("發生錯誤: " + exception.status);
        }
    });
    return res;
}

//簽帳車號、統編、簡稱、油品、臨時超加額度
function subcustcar_ajax(car_no_replace, ip){
    let res;
    $.ajax({
        method: "POST",
        url: "http://"+ ip +":8095/subcustcar.php",
        data: {
            'car_no_replace': car_no_replace,
            'mysql_ip': mysql_ip,
            },
        dataType: "text",
        timeout: 5000,
        async:false,
        //crossDomain: true,
        success: function (response) {
            if(response == '' || response.includes("error")){
                res = '';
            }else{
                res = JSON.parse(response);
            }
        },
        error: function (exception) {
            console.log("發生錯誤: " + exception.status);
        }
    });
    return res;
}

//簽帳餘額
function subcustcar_amt_ajax(subcustcar_uid){
    let res;
    $.ajax({
        method: "POST",
        url: "http://"+ ip +":8095/subcustcar_amt.php",
        data: {
            'subcustcar_uid': subcustcar_uid,
            },
        dataType: "text",
        timeout: 5000,
        async:false,
        //crossDomain: true,
        success: function (response) {
            if(response == '' || response.includes("error")){
                res = '';
            }else{
                res = response;
            }
        },
        error: function (exception) {
            console.log("發生錯誤: " + exception.status);
        }
    });
    return res;
}


//車隊卡油品
function fleet_ajax(car_no_replace, ip){
    let res;
    $.ajax({
        method: "POST",
        url: "http://"+ ip +":8095/fleet.php",
        data: {
            'car_no_replace': car_no_replace,
            },
        dataType: "text",
        timeout: 5000,
        async:false,
        //crossDomain: true,
        success: function (response) {
            if(response == '' || response.includes("error")){
                res = '';
            }else{
                res = JSON.parse(response);
            }
        },
        error: function (exception) {
            console.log("發生錯誤: " + exception.status);
        }
    });
    return res;
}

//現銷車號、油品
function cash_car_ajax(car_no_replace, ip){
    let res;
    $.ajax({
        method: "POST",
        url: "http://"+ ip +":8095/cash_car.php",
        data: {
            'car_no_replace': car_no_replace,
            'mysql_ip': mysql_ip,
            },
        dataType: "text",
        timeout: 5000,
        async:false,
        //crossDomain: true,
        success: function (response) {
            if(response == '' || response.includes("error")){
                res = '';
            }else{
                res = JSON.parse(response);
            }
        },
        error: function (exception) {
            console.log("發生錯誤: " + exception.status);
        }
    });
    return res;
}


//會員重點提示
function member_info(vip_id){
    let res;
    $.ajax({
        method: "POST",
        url: "http://"+ ip +":8095/member_info.php",
        data: {
            'vip_id': vip_id,
            },
        dataType: "text",
        timeout: 5000,
        async:false,
        //crossDomain: true,
        success: function (response) {
            if(response == '' || response.includes("error")){
                res = '';
            }else{
                res = response;
            }
        },
        error: function (exception) {
            console.log("發生錯誤: " + exception.status);
        }
    });
    return res;
}

//cate_id
function cate_id_ajax(){
    let res = [];
    $.ajax({
        method: "POST",
        url: "http://"+ ip +":8095/cate_id.php",
        data: {},
        dataType: "text",
        timeout: 5000,
        async:false,
        //crossDomain: true,
        success: function (response) {
            if(response == '' || response.includes("error")){
                res = '';
            }else{
                res_arr = JSON.parse(response);
                for (let i = 0; i<res_arr.length; i++) {
                    res.push(res_arr[i].category_id);
                }
            }
        },
        error: function (exception) {
            console.log("發生錯誤: " + exception.status);
        }
    });
    return res;
}


//prod_recommand
function prod_recommand_ajax(vip_id){
    let res;
    $.ajax({
        method: "POST",
        url: "http://"+ ip +":8095/prod_recommand.php",
        data: {
            'vip_id':vip_id
        },
        dataType: "text",
        timeout: 5000,
        async:false,
        //crossDomain: true,
        success: function (response) {
            if(response == '' || response.includes("error")){
                res = '';
            }else{
                res = JSON.parse(response);
            }
        },
        error: function (exception) {
            console.log("發生錯誤: " + exception.status);
        }
    });
    return res;
}

//prod_recommand
function re_period_ajax(recommended_id_array){
    let res;
    $.ajax({
        method: "POST",
        url: "http://"+ ip +":8095/re_period.php",
        data: {
            'recommended_id_array':recommended_id_array
        },
        dataType: "text",
        timeout: 5000,
        async:false,
        //crossDomain: true,
        success: function (response) {
            if(response == '' || response.includes("error")){
                res = '';
            }else{
                res = JSON.parse(response);
            }
        },
        error: function (exception) {
            console.log("發生錯誤: " + exception.status);
        }
    });
    return res;
}





//------------------------------------------------------------------------------


var debugMedel = 0;//0：表示關閉 //編號表示第幾面開啟console
//v1.0.5.3