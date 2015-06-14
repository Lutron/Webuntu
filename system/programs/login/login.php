<?php
class login {
	function execute($r) {
		switch ($r["action"]) {
			case "listUsers":
				$users=array("Lutan");
				echo json_encode($users);
				break;
			case "login":
				$u=isset($r["username"]) ? $r["username"] : "";
				$p=isset($r["password"]) ? $r["password"] : "";
				$this->login($u,$p);
				break;
		}
	}
	
	function login($username="",$password="") {
		if ($username!="" && file_exists("system/users/".$username."/settings.ini")) {
			$userfile=file("system/users/".$username."/settings.ini");
			if ($userfile[0]==$password) {
				if (!isset($_SESSION[$username])) {
					$_SESSION[$username]=new stdClass();
				}
				$_SESSION["data"]["currentuser"]=$username;
				echo $username;
				die();
			}
		}
	}
}
?>