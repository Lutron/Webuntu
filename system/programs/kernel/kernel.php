<?php
class kernel {
	function execute($r) {
		switch($r["action"]) {
			case "currentUser":
				echo $_SESSION["data"]["currentuser"];
				break;
		}
	}
}
?>