<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$data = [
    [
    "School" => "Lehigh University",
    "Program" => "Financial Engineering",
    "Type" => "MS",
    "Year Conferred" => "2020"
    ]
];

echo json_encode($data, JSON_PRETTY_PRINT);
