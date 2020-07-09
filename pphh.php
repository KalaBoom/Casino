<?php
    $number = (int)$_POST['num'];
    $bet = (int)$_POST['bet'];
    $balance = file_get_contents("balance.json");
    $jsonBalance = json_decode($balance);
    $balanceGamer = $jsonBalance->{"balance-gamer"};
    $balanceCasino = $jsonBalance->{"balance-casino"};
    $roulette = rand(1, 100);
    $returnData = '{"number":'.$number.',"bet":'.$bet.',"roulette":'.$roulette.',';

    // проверка чтобы числа входили в диапазон
    function checkRange($min, $max, $num) {
        return $num >= $min && $num <= $max;
    }

    function checkIf() {
        global $number, $bet;
        if (!checkRange(1,100,$number)) return false;
        if (!checkRange(100,1000,$bet)) return false;
        return true;
    }
    
    // изменение баланса
    function changeBalance($operation, $operand) {
        global $balanceGamer, $balanceCasino;
        switch($operation) {
            case '+':
                $balanceGamer += $operand*2;
                $balanceCasino -= $operand*2;
                break;
            case '-':
                $balanceGamer -= $operand;
                $balanceCasino += $operand;
                break;
        }

        $str = '{'.'"balance-gamer":'.$balanceGamer.',"balance-casino":'.$balanceCasino.'}';
        $fd = fopen("balance.json", "w");
        fwrite($fd, $str);
        fclose($fd);
    }

    //игра
    function game() {
        global $number, $roulette, $bet, $returnData;
        if (checkIf()) {
            $dif = abs($number - $roulette);

            if ($dif <= 10) {
                $returnData .= '"result": "Выйгрыш х2",';
                changeBalance('+', $bet);
            }
            elseif ($dif > 10 && $dif <= 20) $returnData .= '"result": "Ничья",';
            else {
                $returnData .= '"result": "Проигрыш",';
                changeBalance('-', $bet);
            }
        } else {
            $returnData .= '"err": "Введены некоректные данные",';
        }  
    }


    game();
    $returnData .= '"gamer":'.$balanceGamer.',"casino":'.$balanceCasino.'}';
    echo $returnData;
?>

