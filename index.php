<?php
session_start();
$_SESSION["data"] = isset($_SESSION["data"]) ? $_SESSION["data"] : array();
$_SESSION["data"]["currentuser"] = isset($_SESSION["data"]["currentuser"]) ? $_SESSION["data"]["currentuser"] : "";

$r=$_REQUEST;
if (isset($r["program"]) && $r["program"]!="" && file_exists("system/".$r["program"]."/".$r["program"].".php")) {
	require_once("system/".$r["program"]."/".$r["program"].".php");
	$program=new $r["program"];
	$program->execute($r);
} else {
	init();
}

function init() {
echo '
<!DOCTYPE html>
<meta charset="utf-8">
<title>webOS</title>
<link rel="shortcut icon" href="system/gfx/symbol.png">
<script src="system/jquery-2.1.4.min.js"></script>
<script src="system/system.js"></script>
';
}
?>