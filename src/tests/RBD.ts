export interface QuizQuestionBase {
  id: number;
  question: string;
  type: 'single' | 'multiple' | 'matching';
}

export interface SingleChoiceQuestion extends QuizQuestionBase {
  type: 'single';
  options: string[];
  correctAnswers: number[];
}

export interface MultipleChoiceQuestion extends QuizQuestionBase {
  type: 'multiple';
  options: string[];
  correctAnswers: number[];
}

export interface MatchingQuestion extends QuizQuestionBase {
  type: 'matching';
  terms: { [key: string]: string }; // A, B, C, D...
  meanings: { [key: number]: string }; // 0, 1, 2, 3...
  correctAnswers: string[]; // ["A0", "B1", "C2", ...]
}

export type QuizQuestion = SingleChoiceQuestion | MultipleChoiceQuestion | MatchingQuestion;

export interface Quiz {
  discipline_name: string;
  questions: QuizQuestion[];
}

export const sqlQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Что в терминологии реляционной модели данных соответствует понятию «кортеж»?",
    type: 'single',
    options: [
      "Строка таблицы",
      "Множество всех таблиц в базе данных",
      "Заголовок столбца",
      "Программный интерфейс доступа к данным"
    ],
    correctAnswers: [0]
  },
  {
    id: 2,
    question: "Какие результаты могут принимать логические выражения в SQL в связи с поддержкой NULL-значений?",
    type: 'multiple',
    options: [
      "UNKNOWN (неизвестно)",
      "VOID (пустота)",
      "FALSE (ложь)",
      "TRUE (истина)"
    ],
    correctAnswers: [0, 2, 3]
  },
  {
    id: 3,
    question: "В чем заключается особенность использования ROWS при определении границ окна?",
    type: 'single',
    options: [
      "Позволяет изменять данные в таблице",
      "Основывается на физическом положении строк относительно текущей строки",
      "Включает диапазон значений столбца сортировки",
      "Автоматически удаляет пустые строки"
    ],
    correctAnswers: [1]
  },
  {
    id: 4,
    question: "Какие условия обязательны для того, чтобы представление было автоматически изменяемым?",
    type: 'multiple',
    options: [
      "Обязательное наличие GROUP BY",
      "Отсутствие агрегатных функций в списке выборки",
      "Использование DISTINCT",
      "FROM содержит одну таблицу или изменяемое представление"
    ],
    correctAnswers: [1, 3]
  },
  {
    id: 5,
    question: "Установите соответствие между категорией оконной функции и её назначением.",
    type: 'matching',
    terms: {
      A: "Функции смещения",
      B: "Агрегатные",
      C: "Ранжирующие"
    },
    meanings: {
      0: "ранжируют значение для каждой строки в окне",
      1: "позволяют обращаться к разным строкам окна",
      2: "выполняют арифметические вычисления на наборе данных"
    },
    correctAnswers: ["A1", "B2", "C0"]
  },
  {
    id: 6,
    question: "Чем отличаются монопольные блокировки (X-блокировки) от разделяемых?",
    type: 'single',
    options: [
      "Используются только для чтения",
      "Шифруют данные",
      "Запрещают любой взаимный доступ к объекту данных",
      "Позволяют одновременное изменение"
    ],
    correctAnswers: [2]
  },
  {
    id: 7,
    question: "Каков общий синтаксис оператора соединения таблиц в SQL?",
    type: 'single',
    options: [
      "SELECT … MERGE …",
      "SELECT … AND …",
      "SELECT поля FROM таблица_1 JOIN таблица_2 ON условие",
      "SELECT … WHERE …"
    ],
    correctAnswers: [2]
  },
  {
    id: 8,
    question: "Какие параметры можно передать в функцию LAG?",
    type: 'multiple',
    options: [
      "Значение по умолчанию",
      "Смещение в строках",
      "Пароль администратора",
      "Поле таблицы"
    ],
    correctAnswers: [0, 1, 3]
  },
  {
    id: 9,
    question: "Какие операторы допустимы в WHERE для диапазона или шаблона?",
    type: 'multiple',
    options: [
      "IN для сортировки",
      "BETWEEN для интервала",
      "AS для группы",
      "LIKE для строкового шаблона"
    ],
    correctAnswers: [1, 3]
  },
  {
    id: 10,
    question: "Установите соответствие между элементами процедур и их назначением.",
    type: 'matching',
    terms: {
      A: "OUT",
      B: "CALL",
      C: "IN",
      D: "INOUT"
    },
    meanings: {
      0: "вызов процедуры",
      1: "передача и изменение данных",
      2: "передача значений в процедуру",
      3: "возврат значений"
    },
    correctAnswers: ["A3", "B0", "C2", "D1"]
  },
  {
    id: 11,
    question: "Какая секция MERGE выполняется при совпадении строк?",
    type: 'single',
    options: [
      "WHEN NOT MATCHED",
      "ON SUCCESS",
      "WHEN MATCHED",
      "IF EXISTS"
    ],
    correctAnswers: [2]
  },
  {
    id: 12,
    question: "Какие строковые функции удаляют пробелы?",
    type: 'multiple',
    options: [
      "REPLACE()",
      "TRIM()",
      "LTRIM()",
      "STRIP()"
    ],
    correctAnswers: [1, 2]
  },
  {
    id: 13,
    question: "К какому типу относятся LAG и LEAD?",
    type: 'single',
    options: [
      "Удаление дубликатов",
      "Ранжирование",
      "Функции смещения",
      "Агрегатные"
    ],
    correctAnswers: [2]
  },
  {
    id: 14,
    question: "Где применяется хранение двоичных данных?",
    type: 'multiple',
    options: [
      "Облачные хранилища документов",
      "Системы генерации текста",
      "Видеохостинги",
      "Бумажные библиотеки"
    ],
    correctAnswers: [0, 2]
  },
  {
    id: 15,
    question: "Соотнесите DML-операторы и назначения.",
    type: 'matching',
    terms: {
      A: "DELETE",
      B: "MERGE",
      C: "UPDATE",
      D: "INSERT"
    },
    meanings: {
      0: "слияние операций",
      1: "добавление записей",
      2: "удаление записей",
      3: "обновление данных"
    },
    correctAnswers: ["A2", "B0", "C3", "D1"]
  },
  {
    id: 16,
    question: "Какое CASE проверяет только равенство значений?",
    type: 'single',
    options: [
      "Поисковое",
      "Агрегатное",
      "Рекурсивное",
      "Простое CASE"
    ],
    correctAnswers: [3]
  },
  {
    id: 17,
    question: "Какие этапы должны завершиться до расчёта оконных функций?",
    type: 'multiple',
    options: [
      "WHERE",
      "GROUP BY",
      "Очистка кэша",
      "ORDER BY"
    ],
    correctAnswers: [0, 1]
  },
  {
    id: 18,
    question: "Какой результат даёт CROSS JOIN?",
    type: 'single',
    options: [
      "Объединение по ключу",
      "Пересечение",
      "Метаданные",
      "Каждая строка первой с каждой строкой второй"
    ],
    correctAnswers: [3]
  },
  {
    id: 19,
    question: "Что верно для LEFT ANTI-JOIN?",
    type: 'multiple',
    options: [
      "Исключает строки с совпадениями",
      "Возвращает строки без соответствий",
      "Физически удаляет данные",
      "Реализуется через LEFT JOIN + IS NULL"
    ],
    correctAnswers: [1, 3]
  },
  {
    id: 20,
    question: "Различия UNION и UNION ALL:",
    type: 'multiple',
    options: [
      "Требуют совместимости типов",
      "UNION ALL сохраняет дубликаты",
      "UNION удаляет дубликаты",
      "UNION ALL сортирует автоматически"
    ],
    correctAnswers: [0, 1, 2]
  },
  {
    id: 21,
    question: "Что возвращает INNER JOIN?",
    type: 'single',
    options: [
      "Все строки левой",
      "Только совпадающие строки обеих таблиц",
      "Только несовпадающие",
      "Все строки без условий"
    ],
    correctAnswers: [1]
  },
  {
    id: 22,
    question: "Как выполнить вещественное деление в PostgreSQL?",
    type: 'multiple',
    options: [
      "5./3",
      "CAST(… AS FLOAT)",
      "//",
      "Только целые"
    ],
    correctAnswers: [0, 1]
  },
  {
    id: 23,
    question: "Соотнесите строковые функции и назначения.",
    type: 'matching',
    terms: {
      A: "CONCAT",
      B: "REPLACE",
      C: "TRIM",
      D: "SUBSTRING"
    },
    meanings: {
      0: "удаление пробелов",
      1: "извлечение подстрок",
      2: "объединение строк",
      3: "замена подстрок"
    },
    correctAnswers: ["A2", "B3", "C0", "D1"]
  },
  {
    id: 24,
    question: "Результат CEIL(69.69):",
    type: 'single',
    options: [
      "69.7",
      "69",
      "60",
      "70"
    ],
    correctAnswers: [3]
  },
  {
    id: 25,
    question: "Правила использования подзапросов:",
    type: 'multiple',
    options: [
      "Скалярный возвращает одно значение",
      "Подзапрос заключается в скобки",
      "ORDER BY обязателен",
      "Допустима ссылка на внешний запрос"
    ],
    correctAnswers: [0, 1, 3]
  },
  {
    id: 26,
    question: "Какие характеристики описывают обычные представления (VIEW)?",
    type: 'multiple',
    options: [
      "Занимают дисковую память",
      "Являются физическими копиями таблиц",
      "Содержимое выбирается из других таблиц",
      "Формируются динамически"
    ],
    correctAnswers: [2, 3]
  },
  {
    id: 27,
    question: "Установите соответствие между командами управления курсорами и их функциями.",
    type: 'matching',
    terms: {
      A: "CLOSE",
      B: "FETCH",
      C: "OPEN",
      D: "MOVE"
    },
    meanings: {
      0: "извлекает строки из курсора",
      1: "открывает курсор",
      2: "перемещает курсор по набору данных",
      3: "закрывает курсор"
    },
    correctAnswers: ["A3", "B0", "C1", "D2"]
  },
  {
    id: 28,
    question: "Какое свойство является преимуществом TRUNCATE по сравнению с DELETE?",
    type: 'single',
    options: [
      "TRUNCATE работает значительно быстрее, так как не сканирует каждую строку",
      "Данные всегда можно восстановить",
      "Можно использовать WHERE",
      "Пересоздаёт индексы"
    ],
    correctAnswers: [0]
  },
  {
    id: 29,
    question: "Какие условия должны соблюдаться для выполнения UNION?",
    type: 'multiple',
    options: [
      "Одинаковое количество выходных столбцов",
      "Обязательное наличие индексов",
      "Совместимость типов данных столбцов",
      "Совпадение количества строк"
    ],
    correctAnswers: [0, 2]
  },
  {
    id: 30,
    question: "Какие команды используются для управления явными курсорами?",
    type: 'multiple',
    options: [
      "OPEN",
      "CLOSE",
      "FETCH",
      "START"
    ],
    correctAnswers: [0, 1, 2]
  },
  {
    id: 31,
    question: "Сопоставьте свойства транзакций ACID с их определениями.",
    type: 'matching',
    terms: {
      A: "Изоляция",
      B: "Долговечность",
      C: "Атомарность",
      D: "Согласованность"
    },
    meanings: {
      0: "результаты сохраняются даже при сбое",
      1: "транзакция выполняется либо целиком, либо не выполняется совсем",
      2: "переход БД из одного целостного состояния в другое",
      3: "транзакции не мешают друг другу"
    },
    correctAnswers: ["A3", "B0", "C1", "D2"]
  },
  {
    id: 32,
    question: "Каким оператором можно прервать бесконечный цикл LOOP?",
    type: 'single',
    options: [
      "STOP",
      "BREAK",
      "DELETE LOOP",
      "EXIT"
    ],
    correctAnswers: [3]
  },
  {
    id: 33,
    question: "Какие ограничения относятся к декларативным?",
    type: 'multiple',
    options: [
      "UNIQUE и CHECK",
      "Ограничения на основе триггеров",
      "PRIMARY KEY и FOREIGN KEY",
      "Ограничения оперативной памяти"
    ],
    correctAnswers: [0, 2]
  },
  {
    id: 34,
    question: "Как заполняются данные правой таблицы в LEFT JOIN при отсутствии совпадений?",
    type: 'single',
    options: [
      "Пустыми строками",
      "Значениями DEFAULT",
      "Значениями NULL",
      "Нулями"
    ],
    correctAnswers: [2]
  },
  {
    id: 35,
    question: "Какие предложения входят в формат SELECT?",
    type: 'multiple',
    options: [
      "CREATE",
      "WHERE",
      "ORDER BY",
      "FROM"
    ],
    correctAnswers: [1, 2, 3]
  },
  {
    id: 36,
    question: "Какие три логических результата возможны в SQL?",
    type: 'single',
    options: [
      "TRUE, FALSE, UNKNOWN",
      "YES, NO, MAYBE",
      "1, 0, -1",
      "READ, WRITE, EXECUTE"
    ],
    correctAnswers: [0]
  },
  {
    id: 37,
    question: "Какие способы явного приведения к INTEGER поддерживает PostgreSQL?",
    type: 'multiple',
    options: [
      "'123'::INTEGER",
      "TO_INT('123')",
      "AS_TYPE('123','INTEGER')",
      "CAST('123' AS INTEGER)"
    ],
    correctAnswers: [0, 3]
  },
  {
    id: 38,
    question: "Какой оператор объединяет INSERT, UPDATE и DELETE?",
    type: 'single',
    options: [
      "UPDATE",
      "SELECT",
      "INSERT",
      "MERGE"
    ],
    correctAnswers: [3]
  },
  {
    id: 39,
    question: "Из каких элементов состоит механизм работы с курсором?",
    type: 'multiple',
    options: [
      "Таблица блокировок",
      "Журнал транзакций",
      "Результирующий набор",
      "Позиция курсора"
    ],
    correctAnswers: [2, 3]
  },
  {
    id: 40,
    question: "Какая переменная триггера содержит данные для INSERT?",
    type: 'single',
    options: [
      "TG_OP",
      "FUTURE_DATA",
      "NEW",
      "OLD"
    ],
    correctAnswers: [2]
  },
  {
    id: 41,
    question: "Основное отличие материализованного представления:",
    type: 'single',
    options: [
      "Автообновление",
      "Нет дискового хранения",
      "Сессионное существование",
      "Физическое хранение результата запроса"
    ],
    correctAnswers: [3]
  },
  {
    id: 42,
    question: "Какие типы параметров используются в процедурах?",
    type: 'multiple',
    options: [
      "Глобальные константы",
      "IN",
      "OUT",
      "INOUT"
    ],
    correctAnswers: [1, 2, 3]
  },
  {
    id: 43,
    question: "Какие типы внешних соединений существуют?",
    type: 'multiple',
    options: [
      "LEFT",
      "FULL",
      "CENTER",
      "RIGHT"
    ],
    correctAnswers: [0, 1, 3]
  },
  {
    id: 44,
    question: "Сопоставьте объект БД с его функцией.",
    type: 'matching',
    terms: {
      A: "Представления",
      B: "Триггеры",
      C: "Индексы",
      D: "Таблицы"
    },
    meanings: {
      0: "хранение данных",
      1: "виртуальные таблицы",
      2: "автоматическое выполнение при событиях",
      3: "ускорение поиска"
    },
    correctAnswers: ["A1", "B2", "C3", "D0"]
  },
  {
    id: 45,
    question: "Результат операции PROJECT в реляционной алгебре:",
    type: 'single',
    options: [
      "Отношение с подмножеством атрибутов",
      "Только идентификаторы",
      "Список таблиц схемы",
      "Сумма значений"
    ],
    correctAnswers: [0]
  },
  {
    id: 46,
    question: "Тип данных для хранения больших двоичных данных:",
    type: 'single',
    options: [
      "BLOB (bytea)",
      "VARCHAR",
      "TXT",
      "INT"
    ],
    correctAnswers: [0]
  },
  {
    id: 47,
    question: "Сопоставьте этапы ETL:",
    type: 'matching',
    terms: {
      A: "Transform",
      B: "Load",
      C: "Extract"
    },
    meanings: {
      0: "загрузка данных",
      1: "извлечение данных",
      2: "преобразование данных"
    },
    correctAnswers: ["A2", "B0", "C1"]
  },
  {
    id: 48,
    question: "Какое условие используется в UPDATE для строки курсора?",
    type: 'single',
    options: [
      "WHERE CURRENT OF",
      "WHERE ID IS CURSOR",
      "WHERE THIS ROW",
      "UPDATE ALL RECORDS"
    ],
    correctAnswers: [0]
  },
  {
    id: 49,
    question: "Что ускоряет доступ к двоичным данным?",
    type: 'multiple',
    options: [
      "Настройка параметров хранения",
      "Использование соответствующих индексов",
      "Удаление драйверов",
      "Разгон процессора"
    ],
    correctAnswers: [0, 1]
  },
  {
    id: 50,
    question: "Как выполняется деление целых чисел в PostgreSQL по умолчанию?",
    type: 'single',
    options: [
      "Деление с плавающей точкой",
      "Ошибка типов",
      "Округление",
      "Целочисленное деление"
    ],
    correctAnswers: [3]
  },
  {
    id: 51,
    question: "Основные отличия процедур от функций в PostgreSQL:",
    type: 'multiple',
    options: [
      "Обязательно возвращают значение",
      "Могут включать транзакции",
      "Вызываются командой CALL",
      "Запрещают SQL"
    ],
    correctAnswers: [1, 2]
  }
];

const RPD_QUIZ: Quiz = {
  discipline_name: "Разработка баз данных",
  questions: sqlQuizQuestions
}

export { RPD_QUIZ };