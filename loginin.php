
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>web login in page - cssmoban</title>
<meta name="keywords" content="">
<meta name="description" content="">
<meta name="viewport" content="width=device-width">
<link href="css/login.css" rel="stylesheet" type="text/css">
</head>
<body>

<div class="login">
<form action="" method="post" onsubmit="return check()">
	<div class="logo"></div>
    <div class="login_form">
    	<div class="user">
        	<input class="text_value" value="" name="username" type="text" id="username">
            <input class="text_value" value="" name="password" type="password" id="password">
        </div>
        <button class="button" id="submit" type="submit">login in</button>
    </div>
    
    <div id="tip"></div>
    <div class="foot">
    
    </div>
</form>
</div>

</body>
<script src="js/original_ajax.js" type="text/javascript" charset="utf-8"></script>
<script>
    function check() {
        var username=document.getElementById("username").value;
        var password=document.getElementById("password").value;
        ajax({
            url: '_login.php',
            method: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function (response) {
                var data = JSON.parse(response);
                if(data['code']){
                    document.location = './'
                }else{
                    var tip = document.getElementById("tip");
                    tip.innerHTML=data['msg'];
                }
            }
        })
        return false;
    }
</script>
</html>
