<?php
    $str = $_POST['balance'];
    $fd = fopen("balance.json", "w");
    fwrite($fd, $str);
    fclose($fd);
    $balance = file_get_contents("balance.json");
    echo $balance;
?>