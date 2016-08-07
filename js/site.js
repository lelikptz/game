;
'use strict';
$(function () {
    // координаты клеток
    var steps = [[220, 135], [305, 135], [395, 135], [480, 135], [570, 135], [655, 135],
        [740, 135], [740, 210], [740, 290], [740, 370], [740, 445], [655, 445], [570, 445],
        [480, 445], [395, 445], [305, 445], [220, 445], [220, 370], [220, 290], [220, 210]];

    // координаты для анимации броска кубика
    var handAnimate = ['-76px', '-156px', '-232px', '-310px', '-387px', '-464px', '-541px', '-618px', '-695px', '-773px', '-849px'];

    var gamer = $('.gamer');
    var dice = $('.dice');
    var diceCount = $('.dice_count span');
    var hand = $('.hand.animate');
    var bonus = $('.bonus');
    var total = $('.total');
    var button = $('.start');

    var Game = {
        // текущее положение игрока
        position: 0,
        // текущий выйгрыш
        bonus: 0,
        // общий выйгрыщ
        total: 0,
        // кол-во бросков
        dice: 7,
        // переход по одной клетке на count клеток
        oneStep: function (count) {
            var that = this;

            if (count > 0) {
                that.position++;
                if (that.position > steps.length - 1) {
                    that.position = 0;
                }

                gamer.animate({
                    left: steps[that.position][0],
                    top: steps[that.position][1]
                }, 500, function () {

                    that.oneStep(--count);
                });
            } else {
                that.ajax()
            }
        },
        // переход на определённую клетку
        stepTo: function (to) {
            var that = this;
            gamer.animate({
                left: steps[to][0],
                top: steps[to][1]
            }, 500, function () {
                that.position = to;
            });
        },
        // поехали
        roll: function () {
            var that = this;

            if (!that.dice) {
                alert('Ходы закончились, win = ' + that.total);
                button.removeClass('disabled');
                return false;
            }

            var i = 0;
            var intervalID = setInterval(function () {
                if (!handAnimate[i]) {
                    hand.css('background-position-x', 0);
                    clearInterval(intervalID);
                    that.oneStep(that.getRandom());
                }
                hand.css('background-position-x', handAnimate[i]);
                i++;
            }, 100);
        },
        // получаем случайное число от 1 до 6 и присваиваем соответсвующий класс
        getRandom: function () {
            var random = Math.floor(Math.random() * 6) + 1;
            dice.addClass('dice-' + random);
            return random;
        },
        ajax: function () {
            var that = this;
            $.ajax({
                method: 'POST',
                url: '/game/server.php',
                data: {type: that.position, total: that.total},
                dataType: 'json',
                error: function (err) {
                    alert('Ошибка отправки данных на сервер');
                    button.removeClass('disabled');
                },
                success: function (data) {
                    if (data.result) {
                        that.bonus = data.bonus;
                        that.total = data.total;
                        that.dice--;

                        bonus.html(data.bonus);
                        total.html(data.total);
                        diceCount.html(that.dice);

                        if (that.position != data.nextStep) {
                            that.stepTo(data.nextStep);
                            that.position = data.nextStep;
                        }

                        if (that.dice == 0) {
                            alert('Игра закончена, win ' + that.total);
                        }
                    } else {
                        alert(data.message);
                    }
                    button.removeClass('disabled');
                }
            });
        }
    };

    // клик по кнопке старт
    button.on('click', function () {
        if (button.hasClass('disabled')) {
            return false;
        }
        dice.removeClass().addClass('dice');
        button.addClass('disabled');
        Game.roll();
    });
});