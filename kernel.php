<?php
class kernel {
	var $root="/Webentwicklung/meh/Webuntu/";
	function execute($r) {
		switch($r["action"]) {
			case "currentUser":
				echo $_SESSION["data"]["currentuser"];
				break;
			case "listFiles":
				$this->listFiles($r["directory"]);
				break;
			case "writeFile":
				$file=isset($r["path"]) ? $r["path"] : die();
				$content=isset($r["content"]) ? $r["content"] : "";
				$this->writeFile($file,$content);
				break;
			case "deleteFile":
				$file=isset($r["path"]) ? $r["path"] : die();
				$this->deleteFile($file);
				break;
			case "login":
				$u=isset($r["username"]) ? $r["username"] : "";
				$p=isset($r["password"]) ? $r["password"] : "";
				$this->login($u,$p);
				break;
			case "listUsers":
				$this->listUsers();
				break;
			case "copyFiles":
				$des=isset($r["destination"]) ? $r["destination"] : die();
				$paths=isset($r["paths"]) ? $r["paths"] : die();
				$paths=json_decode($paths);
				$this->copyFiles($des,$paths);
				break;
			case "moveFiles":
				$des=isset($r["destination"]) ? $r["destination"] : die();
				$paths=isset($r["paths"]) ? $r["paths"] : die();
				$paths=json_decode($paths);
				$this->moveFiles($des,$paths);
				break;
			case "renameFile":
				$basepath=isset($r["basepath"]) ? $r["basepath"] : die();
				$newname=isset($r["newname"]) ? basename($r["newname"]) : die();
				$oldname=isset($r["oldname"]) ? basename($r["oldname"]) : die();
				$this->renameFile($basepath,$newname,$oldname);
				break;
			case "readFile":
				$path=isset($r["path"]) ? $r["path"] : die();
				$this->readFile($path);
				break;
			case "readIni":
				$filename=isset($r["filename"]) ? $r["filename"] : die();
				$this->readIni($filename);
				break;
			case "writeIni":
				$filename=isset($r["filename"]) ? $r["filename"] : die();
				$content=isset($r["content"]) ? $r["content"] : die();
				$this->writeIni($filename,$content);
				break;
			case "shell":
				$command=isset($r["command"]) ? $r["command"] : "";
				$this->shell($command);
				break;
			case "logout":
				$this->logout();
				break;
			case "listPrograms":
				$this->listPrograms();
				break;
		}
	}
	
	function shell($command) {
		//$command=base64_decode($command);
		if ($command === false) {
			die();
		}
		echo shell_exec($command);
	}
	
	function listUsers() {
		$users=array_filter(glob('system/users/*',GLOB_ONLYDIR), 'is_dir');
		foreach ($users as $key=>$u) {
			$users[$key]=basename($u);
		}
		echo json_encode($users);
	}
	
	function listPrograms() {
		$dirs=array_filter(glob('system/programs/*',GLOB_ONLYDIR), 'is_dir');
		foreach ($dirs as $key=>$d) {
			$basename=basename($d);
			if (in_array($basename,array("boot","login","explorer"))) {
				unset($dirs[$key]);
			} else {
				$dirs[$key]=$basename;
			}
		}
		echo json_encode($dirs);
	}
	
	function writeIni($filename,$content) {
		$path=$this->root."system/users/".$_SESSION["data"]["currentuser"]."/".basename($filename).".ini";
		$content=json_decode($content);
		if (!file_exists($path) || !$content) die();
		
		$content=implode("\n",$content);
		
		$file=fopen($path,"w") or die("Unable to open file!");
		fwrite($file,$content);
		fclose($file);
	}
	
	function readIni($filename) {
		$path=$this->root."system/users/".$_SESSION["data"]["currentuser"]."/".basename($filename).".ini";
		if (file_exists($path)) {
			$ini=file($path);
			$result=array();
			foreach ($ini as $i) {
				$result[]=trim($i);
			}
			echo json_encode($result);
		}
	}
	
	function readFile($path) {
		$path=$this->root.$this->sanitizePath($path);
		if (file_exists($path)) {
			readfile($path);
		}
	}
	
	function renameFile($basepath,$newname,$oldname) {
		$new=$this->root.$this->sanitizePath($basepath."/".$newname);
		$old=$this->root.$this->sanitizePath($basepath."/".$oldname);
		rename($old,$new);
	}
	
	function moveFiles($destination,$files) {
		foreach ($files as $key=>$f) {
			$files[$key]=$this->root.$this->sanitizePath($f);
		}
		$files=array_unique($files);
		$destination=$this->root.$this->sanitizePath($destination);
		
		foreach ($files as $f) {
			if (!file_exists($f)) {
				return;
			}
			rename($f,$destination."/".basename($f));
		}
	}
	
	function copyFiles($destination,$files) {
		foreach ($files as $key=>$f) {
			$files[$key]=$this->root.$this->sanitizePath($f);
		}
		$files=array_unique($files);
		$destination=$this->root.$this->sanitizePath($destination);
		
		foreach ($files as $f) {
			if (!file_exists($f)) {
				return;
			}
			if (filetype($f)=="dir" || filetype($f)=="file") {
				$basename=basename($f);
				$this->copyr($f,$destination."/".$basename);
			}
		}
	}
	
	function copyr($source, $dest) {
		if (is_file($source)) {
			return copy($source, $dest);
		}
		
		if (!is_dir($dest)) {
			mkdir($dest);
		}

		$dir = dir($source);
		while (false !== $entry = $dir->read()) {
			if ($entry == '.' || $entry == '..') {
				continue;
			}
			
			if ($dest !== $source."/".$entry) {
				$this->copyr($source."/".$entry, $dest."/".$entry);
			}
		}
		$dir->close();
		return true;
	}
	
	function deleteDirectory($dir) {
		if (!file_exists($dir)) {
			return true;
		}
		if (!is_dir($dir)) {
			return unlink($dir);
		}
		foreach (scandir($dir) as $item) {
			if ($item == '.' || $item == '..') {
				continue;
			}
			if (!$this->deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
				return false;
			}
		}
		return rmdir($dir);
	}
	
	function deleteFile($file) {
		$file=$this->root.$this->sanitizePath($file);
		if (!file_exists($file)) {
			echo "File not found.";
			die();
		}
		if (filetype($file)=="file") {
			unlink($file);
		} else if (filetype($file)=="dir") {
			$this->deleteDirectory($file);
		}
	}
	
	function writeFile($file,$content) {
		$file=$this->root.$this->sanitizePath($file);
		$myfile = fopen($file,"w") or die("Unable to open file!");
		fwrite($myfile,$content);
		fclose($myfile);
	}
	
	function listFiles($dir) {
		$dir=$this->sanitizePath($dir);
		$path=$this->root.$dir;
		if (!file_exists($path)) {
			die();
		}
		$files=scandir($path);
		if (!$files) {
			die();
		}
		$result=array();
		$files=array_diff($files,array("..","."));
		foreach ($files as $f) {
			$result[]=array($f,filetype($path."/".$f));
		}
		echo json_encode(array($dir,$result));
	}
	
	function sanitizePath($path) {
		$path=explode("/",$path);
		$buffer=array();
		foreach ($path as $p) {
			$p=str_replace(array("~","\\","./",chr(0)),'',$p);
			$p=preg_replace('/\.{2,}/','.',$p);
			if ($p!="" && $p!=".") {
				$buffer[]=$p;
			}
		}
		$path=implode("/",$buffer);
		$path="/".$path;
		return $path;
	}
	
	function login($username="",$password="") {
		if ($username!="" && file_exists("system/users/".$username."/system.ini")) {
			$userfile=file("system/users/".$username."/system.ini");
			if (trim($userfile[0])==$password) {
				if (!isset($_SESSION[$username])) {
					$_SESSION[$username]=new stdClass();
				}
				$_SESSION["data"]["currentuser"]=$username;
				echo $username;
				die();
			}
		}
	}
	
	function logout() {
		session_destroy();
	}
}
?>