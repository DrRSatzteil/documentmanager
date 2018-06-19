<?php


namespace OCA\DocumentManager\AppInfo;

use OCP\AppFramework\App;

use OCP\DocumentManager\Service\File;

if ((@include_once __DIR__ . '/../vendor/autoload.php')===false) {
	throw new Exception('Cannot include autoload. Did you run install dependencies using composer?');
}
