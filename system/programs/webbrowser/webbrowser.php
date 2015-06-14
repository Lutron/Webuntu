<?php
$r=$_REQUEST;
if (!isset($r["url"]) || $r["url"]=="") {
	die();
}
echo json_encode(array($r["id"],loadPage($r["url"])));
?>