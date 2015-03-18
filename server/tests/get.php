<?php
	/**
	 * get.php
	 * @author Antoine De Gieter
	 * @copyright Net Production Köbe & Co
	 * @digest sends a get request to the api
	 */
	$url = 'http://localhost:8989/test-bundle/test-method';
	
	$data = Array(
		'key1' => 'value1', 
		'key2' => 'value2'
	);

	// use key 'http' even if you send the request to https://...
	$options = Array(
		'http' => Array(
			'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
			'method'  => 'GET',
			'content' => http_build_query($data),
		),
	);
	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);

	var_dump($result);