<?php
/**
 * DEV - режим отладки через консоль
 */
define('DEV', false);

try {
    include_once 'Game.php';

    if ((isset($_POST['type']) && isset($_POST['total'])) || DEV) {

        if (DEV) {
            $intType = isset($argv[1]) ? (int) $argv[1] : 0;
            $intTotal = isset($argv[2]) ? (int) $argv[2] : 0;
        } else {
            $intType = abs((int) $_POST['type']);
            $intTotal = abs((int) $_POST['total']);
        }

        $obj = new Game($intType, $intTotal);
        $arrResult = $obj->getResponse();

        $jsonResult = json_encode($arrResult);

    } else {
        throw new Exception('Ошибка входящих параметров');
    }
} catch (Exception $e) {
    $jsonResult = json_encode(['result' => false, 'message' => $e->getMessage()]);
}

if (DEV) {
    print_r(json_decode($jsonResult));
} else {
    header('Content-type: application/json');
    echo $jsonResult;
}
exit;