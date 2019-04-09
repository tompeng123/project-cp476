<?php
require("config.php");
session_start();
$username = $_POST['username'];
$password = $_POST['password'];
$con = new mysqli($mysql_server_name,$mysql_username,$mysql_password,$mysql_database,$mysql_prot);
if(mysqli_connect_errno()){
    echo 'Database connection error! The error message is：'.mysqli_connect_error();
    exit;
}
$sql="select password from user where username='$username'";
$result = mysqli_query($con,$sql);
$row=mysqli_fetch_row($result);
if($password!=null&&$username!=null){
    if($row[0]==$password){
        $rs['code'] = 1;
        $rs['msg'] = "login success";
        $_SESSION['username']=$username;
    }else{
        $rs['code'] = 0;
        $rs['msg'] = "password error";
    }
}else{
    $rs['code'] = 0;
    $rs['msg'] = "error";
}

echo json_encode($rs);