<?php

/**
 * Created by PhpStorm.
 * User: orlov
 * Date: 07.08.16
 * Time: 21:32
 */
class Game {

    /**
     * Порядковый номер клетки
     * @var int
     */
    private $intType = 0;

    /**
     * Куда переместить игрока после хода
     * @var int
     */
    private $intNextStep;

    /**
     * Общее количество очков
     * @var int
     */
    private $intTotal;

    /**
     * Куда переместить игрока после хода
     * @var int
     */
    private $intBonus;
    /**
     * Массив полей игры по порядку начиная со "старт"
     * Первый аргумент - вызываемая функция, второй - аргумент
     * @var array
     */
    private $arrTypes = [
        ['plus', 5],
        ['plus', 15],
        ['plus', 15],
        ['plus', 30],
        ['plus', 30],
        ['plus', 10],
        ['plus', 0],
        ['move', 0],
        ['plus', 50],
        ['plus', 50],
        ['plus', 0],
        ['plus', 20],
        ['move', 4],
        ['plus', 80],
        ['plus', 80],
        ['plus', 30],
        ['move', 6],
        ['plus', 120],
        ['plus', 120],
        ['plus', 200],
    ];

    /**
     * Game constructor.
     * Задаём начальные параметры
     *
     * @param int $intType
     * @param int $intTotal
     * @throws Exception
     */
    public function __construct($intType = 0, $intTotal = 0) {
        if ($intType <= (count($this->arrTypes) - 1)) {
            $this->intType = $intType;
            $this->intTotal = $intTotal;
            $this->intNextStep = $intType;
        } else {
            throw new Exception('Ошибочный ход');
        }
    }

    /**
     * Вызов нужного метода для подсчёта количества очков
     * @return array
     */
    public function getResponse() {
        $this->{$this->arrTypes[$this->intType][0]}($this->arrTypes[$this->intType][1]);
        $this->intBonus = $this->arrTypes[$this->intType][1];

        return [
            'result' => true,
            'bonus' => $this->intBonus,
            'total' => $this->intTotal,
            'nextStep' => $this->intNextStep
        ];
    }

    /**
     * Умножение очков на заданное число
     * @param int $int
     */
    private function plus($int = 0) {
        $this->intTotal += $int;
    }

    /**
     * Переход хода на другую клетку
     * @param int $int
     */
    private function move($int = 1) {
        $this->intType = $int;
        $this->intNextStep = $int;
        $this->getResponse();
    }
}