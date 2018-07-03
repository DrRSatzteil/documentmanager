<?php
header('Content-type: image/jpeg;');
echo file_get_contents('http://logo.clearbit.com/' . $_GET['url']);
