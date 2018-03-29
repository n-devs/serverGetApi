function searchData() {
    var input, table, tr, th, a, i;
    input = document.getElementById("myInputSearchData");
    table = input.value.toUpperCase();
    tr = document.getElementById("item");
    th = tr.getElementsByTagName("tr");
    for (i = 0; i < th.length; i++) {
        a = th[i].getElementsByTagName("th")[1];
        if (a.innerHTML.toUpperCase().indexOf(table) > -1) {
            th[i].style.display = "";
        } else {
            th[i].style.display = "none";

        }


    }
}




const getApi = new XMLHttpRequest();
getApi.open("GET", "/apis/products", true);
getApi.send(null);

const data = JSON.stringify(getApi.response)

getApi.onload = function () {

    let getData = JSON.parse(getApi.response);
    if (getApi.readyState == 4 && getApi.status == "200") {
        console.log(getData);
        let table = []
        let item, arrayCheck;
        let productId, productBarcode, productName, productBrand, productManufacturer;
        for (var i = 0; i <= getData.products.length; i++) {
            for (const prop in getData.products[i]) {
                switch (prop) {
                    case "productId":
                        productId = getData.products[i][prop];
                        arrayCheck = i
                        break;
                    case "productBarcode":
                        productBarcode = getData.products[i][prop];
                        break;
                    case "productName":
                        productName = getData.products[i][prop];
                        break;
                    case "productBrand":
                        productBrand = getData.products[i][prop];
                        break;
                }

            }
            let number = arrayCheck + 1;
            table.push({ html: item })
            item = `
            <tr>
            <th>${number}</th>
            <th>${productBarcode}</th>
            <th>${productName}</th>
            <th>${productBrand}</th>
            <th>
            <div class="btn-group">
            <button id="editProduct" onclick="checkData(${arrayCheck})">แก้ไข</button>
            <button  id="deleteProduct" onclick="deleteProduct(${arrayCheck})">ลบ</button>
            </div>
            </th>
            </tr>`;

        }

        let tableDataHead = ""
        let tableData = ""
        for (let i = 0; i < table.length; i++) {

            if (table[i].html == undefined) {
                tableDataHead = `<htr><hth>ลำดับ</hth><hth>รหัส</hth><hth>ชื่อ</hth><hth>แบรนด์/ ยื่ห้อ</hth><hth>รายละเอียด</hth></htr>`;

            } else {
                tableDataHead = `<htr><hth>ลำดับ</hth><hth>รหัส</hth><hth>ชื่อ</hth><hth>แบรนด์/ ยื่ห้อ</hth><hth>รายละเอียด</hth></htr>`;
                tableData += table[i].html
            }

        }

        document.getElementById("item").innerHTML = tableDataHead + tableData;


    } else {
        console.error(getData);
    }


}

let detailProduct = ""
function checkData(funcProduct) {


    let funcProductContro = funcProduct;
    console.log(funcProductContro);

    const getApiToDetailProduct = new XMLHttpRequest();
    getApiToDetailProduct.open("GET", "/apis/products", true);
    getApiToDetailProduct.send(null);

    getApiToDetailProduct.onload = function () {

        let getData = JSON.parse(getApiToDetailProduct.response);
        if (getApiToDetailProduct.readyState == 4 && getApiToDetailProduct.status == "200") {
            let detailProductId, detailProductBarcode, detailProductName, detailProductBrand, detailProductManufacturer,
                detailProductSize, detailProductStatus;
            if (funcProductContro == funcProductContro) {

                for (const prop in getData.products[funcProductContro]) {
                    switch (prop) {
                        case "productId":
                            detailProductId = getData.products[funcProductContro][prop];
                            break;
                        case "productBarcode":
                            detailProductBarcode = getData.products[funcProductContro][prop];
                            break;
                        case "productName":
                            detailProductName = getData.products[funcProductContro][prop];
                            break;
                        case "productBrand":
                            detailProductBrand = getData.products[funcProductContro][prop];
                            break;
                        case "productManufacturer":
                            detailProductManufacturer = getData.products[funcProductContro][prop];
                            break;
                        case "productSize":
                            detailProductSize = getData.products[funcProductContro][prop];
                            break;
                        case "productStatus":
                            detailProductStatus = getData.products[funcProductContro][prop];
                            break;
                    }

                }

                detailProduct = `<div id="addProductForm" class="modal">

                <form class="modal-content animate">
                    <div class="imgcontainer">
                       
            
                    </div>
            
                    <div class="container-modle">
                    <span onclick="document.getElementById('addProductForm').style.display='none'" class="close" title="Close Modal">&times;</span>
                        <div class="input-container">
                            <input value="${detailProductBarcode}" type="#{label}" id="pBarCode" required="required" class="t0-input" id="pBarCode">
                            <label for="#{label}">รหัสบาร์โค๊ดสินค้า:</label>
                            <div class="bar"></div>
                        </div>
                        <div class="input-container">
                            <input value="${detailProductName}" type="#{label}" id="pName" required="required" class="t0-input" id="pName">
                            <label for="#{label}">ชื่อสินค้า:</label>
                            <div class="bar"></div>
                        </div>
                        <div class="input-container">
                            <input value="${detailProductBrand}" type="#{label}" id="pBrand" required="required" class="t0-input" id="pBrand">
                            <label for="#{label}">แบรนด์:</label>
                            <div class="bar"></div>
                        </div>
                        <div class="input-container">
                            <input value="${detailProductManufacturer}" type="#{label}" id="pManufacturer" required="required" class="t0-input" id="pManufacturer">
                            <label for="#{label}">ผู้ผลิตสินค้า:</label>
                            <div class="bar"></div>
                        </div>
                        <div class="input-container">
                            <input value="${detailProductSize}" type="#{label}" id="pSize" required="required" class="t0-input" id="pSize">
                            <label for="#{label}">จำนวนสินค้า:</label>
                            <div class="bar"></div>
                        </div>
                        <div class="input-container">
                            <input value="${detailProductStatus}" type="#{label}" id="pStatus" required="required" class="t0-input" id="pSize">
                            <label for="#{label}">สถานะสินค้า:</label>
                            <div class="bar"></div>
                        </div>
                    </div>
            
                    <div class="container-modle" style="background-color:#f1f1f1">
                        <button type="button" onclick="finishEditData(${funcProductContro})" class="finishbtn">เสร็จสิ้น</button>
            
                    </div>
                </form>
            </div>`;
                console.log(getData.products[funcProductContro]);
            }
            document.getElementById("detailProduct").innerHTML = detailProduct;

        }
    }
}



function editData(funcContro) {
    $("input[name='editData']").removeAttr("disabled");
    $("#editData").text('เสร็จสิ้น').removeAttr('onclick')
    $("#editData").attr('onclick', `finishEditData(${funcContro})`)
    console.log(funcContro);

}



function finishEditData(funcContros) {
    $("input[name='editData']").attr('disabled', true)
    $("#editData").text('แก้ไขสินค้า').removeAttr('onclick')
    $("#editData").attr('onclick', `editData(${funcContros})`)

    const pBarCode = document.getElementById("pBarCode").value;
    const pName = document.getElementById("pName").value;
    const pBrand = document.getElementById("pBrand").value;
    const pManufacturer = document.getElementById("pManufacturer").value;
    const pSize = document.getElementById("pSize").value;
    const pStatus = document.getElementById("pStatus").value;


    const getApiFinishEditData = new XMLHttpRequest();
    getApiFinishEditData.open("GET", "/apis/products", true);
    getApiFinishEditData.send(null);

    getApiFinishEditData.onload = function () {

        let getData = JSON.parse(getApiFinishEditData.response);
        if (getApiFinishEditData.readyState == 4 && getApiFinishEditData.status == "200") {
            var productId, productBarcode, productName, productBrand, productManufacturer,
                productSize, productStatus;
            if (funcContros == funcContros) {

                for (const prop in getData.products[funcContros]) {
                    switch (prop) {
                        case "productId":
                            productId = getData.products[funcContros][prop];
                            break;
                        case "productBarcode":
                            productBarcode = getData.products[funcContros][prop];
                            break;
                        case "productName":
                            productName = getData.products[funcContros][prop];
                            break;
                        case "productBrand":
                            productBrand = getData.products[funcContros][prop];
                            break;
                        case "productManufacturer":
                            productManufacturer = getData.products[funcContros][prop];
                            break;
                        case "productSize":
                            productSize = getData.products[funcContros][prop];
                            break;
                        case "productStatus":
                            productStatus = getData.products[funcContros][prop];
                            break;
                    }

                }
            }
        }


        let product = {
            "productBarcode": pBarCode
            , "productName": pName, "productBrand": pBrand, "productManufacturer": pManufacturer
            , "productSize": pSize, "productStatus": pStatus
        };


        let json = JSON.stringify(product);

        let putApi = new XMLHttpRequest();
        putApi.open("PUT", ` /apis/products/${productBarcode}`, true);
        putApi.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        putApi.onload = function () {
            let users = JSON.parse(putApi.responseText);
            if (putApi.readyState == 4 && putApi.status == "200") {
                document.getElementById('addProductForm').style.display = 'none';
                const pupUp = `
                <div id="finishbtn" class="modal">
                <div class="container-modle modal-content animate" >
                <div style="background-color:#fff">
                <center><h1>แก้ไขเสร็จสิ้น</h1></center>
                </div>
                <div class="container-modle" style="background-color:#f1f1f1">
                <button onclick="document.getElementById('finishbtn').style.display='none'">ตกลง</button>
                </div>
                </div>
                </div>`
                document.getElementById("detailProduct").innerHTML = pupUp;
                console.log(users);
            } else {
                console.error(users);
            }
        }
        putApi.send(json)
    }

}

let labalProductBarcode = ''

function addProduct(funcControsAdd) {
    console.log(funcControsAdd);

    let addProduct = ` <div id="addProductForm" class="modal">

    <form class="modal-content animate"  >
        <div class="imgcontainer">
            <span onclick="document.getElementById('addProductForm').style.display='none'" class="close" title="Close Modal">&times;</span>

        </div>

        <div class="container-modle">
            <div class="input-container">
                <input type="#{label}" name="productBarcode" id="productBarcode" required="required" class="t0-input" id="pBarCode">
                <label for="#{label} id="labalProductBarcode">รหัสบาร์โค๊ดสินค้า:</label>
                <div class="bar"></div>
            </div>
            <div class="input-container">
                <input type="#{label}" name="productName" id="productName" required="required" class="t0-input" id="pName">
                <label for="#{label} id="labalProductName">ชื่อสินค้า:</label>
                <div class="bar"></div>
            </div>
            <div class="input-container">
                <input type="#{label}" name="productBrand" id="productBrand" required="required" class="t0-input" id="pBrand">
                <label for="#{label} id="labalProductBrand">แบรนด์สินค้า:</label>
                <div class="bar"></div>
            </div>
            <div class="input-container">
                <input type="#{label}" name="productManufacturer" id="productManufacturer" required="required" class="t0-input" id="pManufacturer">
                <label for="#{label}">ผู้ผลิตสินค้า:</label>
                <div class="bar"></div>
            </div>
            <div class="input-container">
                <input type="#{label}" name="productSize" id="productSize" required="required" class="t0-input" id="pSize">
                <label for="#{label}">จำนวนสินค้า:</label>
                <div class="bar"></div>
            </div>
        </div>

        <div class="container-modle" style="background-color:#f1f1f1">
            <button type="button" onclick="finishAddProduct()" class="finishbtn">เสร็จสิ้น</button>

        </div>
    </form>
    <div id="checkProduct"></div>
</div>`;
    document.getElementById("detailProduct").innerHTML = addProduct;
}

function finishAddProduct() {
    const pBarCode = document.getElementById("productBarcode").value;
    const pName = document.getElementById("productName").value;
    const pBrand = document.getElementById("productBrand").value;
    const pManufacturer = document.getElementById("productManufacturer").value;
    const pSize = document.getElementById("productSize").value;


    let addProduct = {
        productBarcode: pBarCode
        , productName: pName, productBrand: pBrand, productManufacturer: pManufacturer
        , productSize: pSize, productStatus: "1"
    };


    if (pBarCode == ``) {
        document.getElementById('checkProduct').style.display = 'block'
        const labalProductBarcode = `
        <div id="resetProductBarcode" class="modal">
         <form class="container-modal modal-content animate" >
          <div style="background-color:#fff">
           <center><h1 style="color: #b50202;" >กรุณาใส่ รหัสบาร์โค๊ดสินค้า</h1></center>
          
           <div class="container-modal style="background-color:#f1f1f1"" >
           <div class="imgcontainer">
            <span onclick="document.getElementById('checkProduct').style.display='none'" class="button" >ปิด</span>

        </div>
         <div/ >
        </div>
         </form>
        </div>`
        document.getElementById("checkProduct").innerHTML = labalProductBarcode;
    } else {
        if (pName == ``) {
            document.getElementById('checkProduct').style.display = 'block'
            const labalProductName = `
            <div id="resetProductBarcode" class="modal">
             <form class="container-modal modal-content animate" >
              <div style="background-color:#fff">
               <center><h1 style="color: #b50202;" >กรุณาใส่ ชื่อสินค้า</h1></center>
              
               <div class="container-modal style="background-color:#f1f1f1"" >
               <div class="imgcontainer">
            <span onclick="document.getElementById('checkProduct').style.display='none'" class="button" >ปิด</span>
             </div>
               <div/ >
            </div>
             </form>
            </div>`
            document.getElementById("checkProduct").innerHTML = labalProductName;

        } else {

            if (pBrand == ``) {
                document.getElementById('checkProduct').style.display = 'block'
                const labalProductBrand = `
                <div id="resetProductBarcode" class="modal">
                 <form class="container-modal modal-content animate" >
                  <div style="background-color:#fff">
                   <center><h1 style="color: #b50202;" >กรุณาใส่ แบรนด์สินค้า</h1></center>
                  
                   <div class="container-modal style="background-color:#f1f1f1"" >
                   <div class="imgcontainer">
                <span onclick="document.getElementById('checkProduct').style.display='none'" class="button" >ปิด</span>
                 </div>
                   <div/ >
                </div>
                 </form>
                </div>`
                document.getElementById("checkProduct").innerHTML = labalProductBrand;

            } else {

                let jsons = JSON.stringify(addProduct);

                let postApi = new XMLHttpRequest();
                postApi.open("POST", "/apis/products", true);
                postApi.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                postApi.onload = function () {
                    let users = JSON.parse(postApi.responseText);
                    if (postApi.readyState == 4 && postApi.status == "201") {
                        const pupUp = `
                            <div id="finishbtn" class="modal">
                            <div class="container-modle modal-content animate" >
                            <div style="background-color:#fff">
                            <center><h1>เพิ่มเสร็จสิ้น</h1></center>
                            </div>
                            <div class="container-modal" style="background-color:#f1f1f1">
                            <button onclick="document.getElementById('finishbtn').style.display='none', location.reload()">ตกลง</button>
                            </div>
                            </div>
                            </div>`
                        document.getElementById("detailProduct").innerHTML = pupUp;

                        ;

                        console.log(users);
                    } else {
                        console.error(users);
                        if (postApi.readyState == 4 && postApi.status == "409") {
                            document.getElementById('checkProduct').style.display = 'block'
                            const labalProductBrand = `
                <div id="resetProductBarcode" class="modal">
                 <form class="container-modal modal-content animate" >
                  <div style="background-color:#fff">
                   <center><h1 style="color: #b50202;" >ข้อมูลซ้ำกัน กรุณากรอกใหม่</h1></center>
                  
                   <div class="container-modal style="background-color:#f1f1f1"" >
                   <div class="imgcontainer">
                <span onclick="document.getElementById('checkProduct').style.display='none'" class="button" >ปิด</span>
                 </div>
                   <div/ >
                </div>
                 </form>
                </div>`
                            document.getElementById("checkProduct").innerHTML = labalProductBrand;
                        }
                    }


                }
                postApi.send(jsons)
                console.log("b:" + jsons);
            }
        }
    }

}



function deleteProduct(funcControDelete) {

    const getApiDeleteProduct = new XMLHttpRequest();
    getApiDeleteProduct.open("GET", "/apis/products", true);
    getApiDeleteProduct.send(null);

    getApiDeleteProduct.onload = function () {

        let getData = JSON.parse(getApiDeleteProduct.response);
        if (getApiDeleteProduct.readyState == 4 && getApiDeleteProduct.status == "200") {
            var productId, productBarcode, productName, productBrand, productManufacturer,
                productSize, productStatus;
            if (funcControDelete == funcControDelete) {

                for (const prop in getData.products[funcControDelete]) {
                    switch (prop) {
                        case "productId":
                            productId = getData.products[funcControDelete][prop];
                            break;
                        case "productBarcode":
                            productBarcode = getData.products[funcControDelete][prop];
                            break;
                        case "productName":
                            productName = getData.products[funcControDelete][prop];
                            break;
                        case "productBrand":
                            productBrand = getData.products[funcControDelete][prop];
                            break;
                        case "productManufacturer":
                            productManufacturer = getData.products[funcControDelete][prop];
                            break;
                        case "productSize":
                            productSize = getData.products[funcControDelete][prop];
                            break;
                        case "productStatus":
                            productStatus = getData.products[funcControDelete][prop];
                            break;
                    }

                }
            }
        }

        const pupUpDeelete = `
                <div id="finishbtn" class="modal">
                 <form class="container-modal modal-content animate" >
                  <div style="background-color:#fff">
                   <center><h1 style="color: #b50202;" >คุณแน่ใจว่าจะลบข้อมูลนี้ ใช่หรือไม่</h1></center>
                  
                   <div class="container-modal style="background-color:#f1f1f1"" >
                   <button id="yesbtn" onclick="deletData(${funcControDelete})">ใช่</button>
                   <button id="nobtn" onclick="notDeletData(${funcControDelete})">ไม่</button>
                   <div/ >
                </div>
                 </form>
                </div>`
        document.getElementById("detailProduct").innerHTML = pupUpDeelete;


    }
}

function deletData(deleteNum) {
    const getApiDeleteProduct = new XMLHttpRequest();
    getApiDeleteProduct.open("GET", "/apis/products", true);
    getApiDeleteProduct.send(null);

    getApiDeleteProduct.onload = function () {

        let getData = JSON.parse(getApiDeleteProduct.response);
        if (getApiDeleteProduct.readyState == 4 && getApiDeleteProduct.status == "200") {
            var productIdDelete, productBarcodeDelete, productNameDelete,
                productBrandDelete, productManufacturerDelete, productSizeDelete,
                productStatusDelete;
            if (deleteNum == deleteNum) {

                for (const prop in getData.products[deleteNum]) {
                    switch (prop) {
                        case "productId":
                            productIdDelete = getData.products[deleteNum][prop];
                            break;
                        case "productBarcode":
                            productBarcodeDelete = getData.products[deleteNum][prop];
                            break;
                        case "productName":
                            productNameDelete = getData.products[deleteNum][prop];
                            break;
                        case "productBrand":
                            productBrandDelete = getData.products[deleteNum][prop];
                            break;
                        case "productManufacturer":
                            productManufacturerDelete = getData.products[deleteNum][prop];
                            break;
                        case "productSize":
                            productSizeDelete = getData.products[deleteNum][prop];
                            break;
                        case "productStatus":
                            productStatusDelete = getData.products[deleteNum][prop];
                            break;
                    }

                }
            }
        }

        let deleteApi = new XMLHttpRequest();
        deleteApi.open("DELETE", `/apis/products/${productBarcodeDelete}`, true);
        deleteApi.onload = function () {
            let deleteUsers = JSON.parse(deleteApi.responseText);
            if (deleteApi.readyState == 4 && deleteApi.status == "200") {
                console.log(deleteUsers);
            } else {
                console.error(deleteUsers);
            }

        }
        document.getElementById('finishbtn').style.display = 'none'
        deleteApi.send(null);
    }


}

function notDeletData(notDeleteNum) {
    document.getElementById('finishbtn').style.display = 'none'
}
