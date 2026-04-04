<?php

namespace App\Custom;

use DateInterval;
use DatePeriod;
use DateTime;
use DateTimeZone;

class DateTimeHelper
{
    const string NOW = 'now';
    const int DATE_HOUR_LENGTH_WITHOUT_UTC_OFFSET = 19; // 0000-00-00 00:00:00

    /***
     * private para não poder instanciada nem herdada
     */
    private function __construct() {}

    public static function isAfterOrSame(string $valueToCompare, string $value): bool {
        return new DateTime($valueToCompare) >= new DateTime($value);
    }

    public static function isBefore(string $valueToCompare, string $value): bool {
        return new DateTime($valueToCompare) < new DateTime($value);
    }

    public static function formatDateHour(?string $value, array $modify = [], $withoutTimeZone = false): ?string {
        return static::format('d/m/Y H:i', $value, $modify, $withoutTimeZone);
    }

    public static function formatDate(?string $value, array $modify = []): ?string {
        return static::format('d/m/Y', $value, $modify);
    }

    public static function formatDbDate(?string $value = self::NOW, array $modify = []): ?string {
        return static::format('Y-m-d', $value, $modify, false);
    }

    public static function formatDbDateHour(?string $value = self::NOW, array $modify = [], $withoutTimeZone = false): ?string {
        return static::format('Y-m-d H:i', $value, $modify, $withoutTimeZone);
    }

    public static function formatFileName(string $value, array $modify = []): ?string {
        return static::format('Y-m-d-H-i-s', $value, $modify, false);
    }

    public static function formatHour(?string $value, array $modify = [], $withoutTimeZone = false): ?string {
        return static::format('H:i', $value, $modify, $withoutTimeZone);
    }

    public static function getDateTimestamp(string $value = self::NOW, array $modify = []): ?string {
        if (!$value) {
            return null;
        }
        // Quando é necessário inserir uma data que não passa pelo ActiveRecord
        $defaultModify = ['noon'];
        $resolvedModify = empty($modify) ? $defaultModify : array_merge($defaultModify, $modify);
        return static::getTimestamp(
            value: $value,
            modify: $resolvedModify,
            withoutTimeZone: true,
        );
    }

    public static function getTimestamp(string $value = self::NOW, array $modify = [], $withoutTimeZone = false): ?string {
        if (!$value) {
            return null;
        }
        $mask = $withoutTimeZone ? 'Y-m-d H:i:s' : 'Y-m-d H:i:sO';
        $timestamp = static::format($mask, $value, $modify, $withoutTimeZone);
        // Normaliza o offset pra ficar igual ao postgres -02 ao invés de -0200
        // No sys_audit, por exemplo, isso é relevante, pois dependendo de como fosse
        // acionado o log salvariaar -02 ou -0200, logando uma alteração inexistente
        // dd($timestamp, mb_substr($timestamp, 0, -2));
        return $withoutTimeZone ? $timestamp : mb_substr($timestamp, 0, -2);
    }

    public static function format(string $mask, ?string $value = self::NOW, array $modify = [], $withoutTimeZone = false): ?string {
        if (!$value) {
            return null;
        }
        $dateTime = $withoutTimeZone ? static::getDateTime($value) : static::getDateTimeFromBrowserUtcOffset($value);
        if ($dateTime) {
            $dateTime = static::modify($dateTime, $modify);
            return $dateTime->format($mask);
        }
        return null;
    }

    private static function modify(DateTime $dateTime, array $modify): DateTime {
        if (!empty($modify)) {
            foreach ($modify as $value) {
                $dateTime->modify($value);
            }
        }
        return $dateTime;
    }

    /**
     * Debug apenas, imprime algumas amostras
     */
    public static function printSamples(bool $isDebug = true): void {
        $values = [
            '21/12/2012 12:32:12', // d/m/Y H:i:s
            '21/12/2012 12:32', // d/m/Y H:i
            '21/12/2012', // d/m/Y
            '2012-12-21 12:32:12-03:00', // Y-m-d H:i:sO
            '2012-12-21 12:32:12-0300', // Y-m-d H:i:sO
            '2012-12-21 12:32:12-03', // Y-m-d H:i:sO
            '2012-12-21T12:32:12-03:00', // Y-m-d\TH:i:sO
            '2012-12-21T12:32:12-0300', // Y-m-d\TH:i:sO
            '2012-12-21T12:32:12-03', // Y-m-d\TH:i:sO
            '2012-12-21 12:32:12.123456', // Y-m-d H:i:s.u
            '2012-12-21 12:32:12', // Y-m-d H:i:s
            '2012-12-21 12:32', // Y-m-d H:i
            '2012-12-21', // Y-m-d
            '12:32', // H:i
            'now', // new DateTime
            // inválido
            '21/13/2012', // d/m/Y formato certo, data inválida
            '21/12/20122', // formato errado
        ];
        foreach ($values as $value) {
            dump(static::getDateTime($value, $isDebug));
        }
        exit;
    }

    /**
     * Obtém o DateTime de uma string de data
     */
    private static function getDateTime(string $value, bool $isDebug = false): DateTime|array|null {
        $logCall = $logErrors = $logWarnings = null; // debugging shit
        $validDateTime = null;
        if ($value === static::NOW) {
            $logCall = "new DateTime('" . $value . "')";
            $validDateTime = new DateTime(static::NOW);
        } else {
            $expectedFormats = [
                'd/m/Y H:i:s', // 12/12/2012 12:12:12
                'd/m/Y H:i', // 12/12/2012 12:12
                'd/m/Y', // 12/12/2012
                'Y-m-d H:i:sO', // 2012-12-12 12:12:12-03:00 (timezone pode ser também -03; -0300)
                'Y-m-d\TH:i:sO', // 2012-12-12T12:12:12-03:00 (timezone pode ser também -03; -0300)
                'Y-m-d\TH:i:s', // 2012-12-12T12:12:12-03:00 (timezone pode ser também -03; -0300)
                'Y-m-d H:i:s.u', // 2012-12-12 12:12:12.123456 (depois do ponto são microsegundos)
                'Y-m-d H:i:s', // 2012-12-12 12:12:12
                'Y-m-d H:i', // 2012-12-12 12:12
                'Y-m-d', // 2012-12-12
                'H:i', // 12:12
                '', // não casa com nenhuma das anteriores, da erro ao chegar aqui,
            ];
            foreach ($expectedFormats as $format) {
                $logCall = "DateTime::createFromFormat('" . $format . "', '" . $value . "')";
                $dateTime = DateTime::createFromFormat($format, $value);
                $lastErrors = DateTime::getLastErrors();
                if (empty($lastErrors['error_count'])) { // formato inválido
                    $logErrors = null;
                    $validDateTime = $dateTime;
                    if (!empty($lastErrors['warning_count'])) { // formato válido, data inválida. 12/13/2012 | 12/12/2012 26:32
                        $logWarnings = implode('|', $lastErrors['warnings']);
                        $validDateTime = null;
                    }
                    break;
                } else {
                    $logErrors = implode('|', $lastErrors['errors']);
                    $validDateTime = null;
                }
            }
        }
        return !$isDebug ? $validDateTime : [
            'dateTime' => $validDateTime,
            'log' => [
                'call' => $logCall,
                'errors' => $logErrors,
                'warnings' => $logWarnings,
            ],
        ];
    }

    private static function getDateTimeFromBrowserUtcOffset(string $value): DateTime|array|null {
        $dateTime = static::getDateTime($value);
        if ($dateTime) {
            if (!app()->runningInConsole()) {
                // Só aplica o offset na data now ou quando o offset estiver contido na string
                $browserUtcOffset = session('browser_utc_offset');
                if ($browserUtcOffset && ($value === static::NOW or mb_strlen($value) > static::DATE_HOUR_LENGTH_WITHOUT_UTC_OFFSET)) {
                    $resolvedBrowserUtcOffset = $browserUtcOffset > 0
                      ? '+' . ($browserUtcOffset / 60) // Precisa o sinal de +
                      : $browserUtcOffset / 60;
                    $dateTime->setTimezone(new DateTimeZone($resolvedBrowserUtcOffset));
                }
            }
            return $dateTime;
        }
        return null;
    }

    public static function getPeriod(
        string $start, // data no formato db
        string $end, // data no formato db
        string $interval, // 1 day, 30 days, 15 minutes, ...
    ): DatePeriod {
        $startDateTime = new DateTime($start);
        $endDateTime = new DateTime($end);
        $interval = DateInterval::createFromDateString($interval);
        return new DatePeriod($startDateTime, $interval, $endDateTime);
    }

    public static function getDiffInDays(
        string $start, // data no formato db
        string $end, // data no formato db
    ): int {
        $startDateTime = new DateTime($start);
        $endDateTime = new DateTime($end);
        $interval = $startDateTime->diff($endDateTime);
        // Cálculo ajustado com o luxon, daria pra usar o "days", mas parece seguro assumir 30 pro "m"
        return ($interval->m * 30) + $interval->d;
    }

    public static function getDiffInMinutes(
        string $start, // data no formato db
        string $end, // data no formato db
    ): int {
        $startDateTime = new DateTime($start);
        $endDateTime = new DateTime($end);
        $interval = $startDateTime->diff($endDateTime);
        // Cálculo ajustado com o luxon, daria pra usar o "days", mas parece seguro assumir 30 pro "m"
        return ($interval->m * 43200) // Um mês tem 43200 minutos
          + ($interval->d * 1440) // Um dia tem 1440 minutos
          + ($interval->h * 60) // Uma hora tem 60 minutos
          + $interval->i; // Um dia tem 1440 minutos
    }

    public static function getDiffInSeconds(
        string $start, // data no formato db
        string $end, // data no formato db
    ): int {
        $startDateTime = new DateTime($start);
        $endDateTime = new DateTime($end);
        return $endDateTime->getTimestamp() - $startDateTime->getTimestamp();
    }

    public static function getDateTimestampByDay(int $day): ?string {
        $todayDay = (int) static::format('d');
        $todayMonth = (int) static::format('m');
        $todayYear = (int) static::format('Y');
        if ($todayDay > $day) {
            $payMonth = $todayMonth + 1;
            $payYear = $todayYear;
            if ($payMonth == 13) {
                $payMonth = 1;
                $payYear = $todayYear + 1;
            }
            $date = $payYear . '-' . Helper::zeroFill($payMonth, 2) . '-' . Helper::zeroFill($day, 2);
        } else {
            $date = $todayYear . '-' . Helper::zeroFill($todayMonth, 2) . '-' . Helper::zeroFill($day, 2);
        }
        return static::getDateTimestamp($date);
    }

    public static function getShortWeekDayNames(): array {
        // pt_BR
        // dom = 7 pra normalizar com o luxon
        return [1 => 'seg.', 2 => 'ter.', 3 => 'qua.', 4 => 'qui.', 5 => 'sex.', 6 => 'sab.', 7 => 'dom.'];
    }

    public static function getDayOfWeek(string|DateTime $value): int {
        // pt_BR
        // 1 seg, 2 ter, 3 qua, 4 qui, 5 sex, 6 sab, 0 dom
        $dayOfWeek = (int) (is_string($value) ? static::format('w', $value) : $value->format('w'));
        // 1 seg, 2 ter, 3 qua, 4 qui, 5 sex, 6 sab, 7 dom pra normalizar com o luxon
        return $dayOfWeek === 0 ? 7 : $dayOfWeek;
    }

    public static function resolveDateRange(?string $dateStart, ?string $dateEnd): array {
        $start = static::formatDbDate($dateStart);
        $end = static::formatDbDate($dateEnd);
        $title = $dateStart . ' ' . __('flag.fragmentUntil') . ' ' . $dateEnd;
        if ($start && !$end) {
            $end = static::formatDbDate(value: static::NOW, modify: ['+30 years']);
            $title = __('text.A partir de ') . $dateStart;
        } elseif (!$start && $end) {
            $start = static::formatDbDate(value: static::NOW, modify: ['-30 years']);
            $title = __('text.Até') . ' ' . $dateEnd;
        }
        // Pra usar com o between, se não setar a hora na data final, a data fim 23/11/2019
        // não vai considerar 23/11/2019 12:00:00, pra cosiderar teria que usar o ::date na coluna
        // mas isso deixa a consulta bem mais lenta
        $end = $end && mb_strlen($end) === 10 ? static::endOfDay($end) : $end; // pra não usar o ::date no filtro
        return [
            'start' => $start,
            'end' => $end,
            'title' => $title,
        ];
    }

    public static function endOfDay(string $value = self::NOW, array $modify = []): ?string {
        $defaultModify = ['tomorrow', '-1 second'];
        $resolvedModify = empty($modify) ? $defaultModify : array_merge($defaultModify, $modify);
        return static::getTimestamp(
            value: $value,
            modify: $resolvedModify,
            withoutTimeZone: true,
        );
    }

    public static function startOfDay(string $value = self::NOW, array $modify = []): ?string {
        $defaultModify = ['midnight'];
        $resolvedModify = empty($modify) ? $defaultModify : array_merge($defaultModify, $modify);
        return static::getTimestamp(
            value: $value,
            modify: $resolvedModify,
            withoutTimeZone: true,
        );
    }

    public static function endOfMonth(string $value, array $modify = []): ?string {
        $defaultModify = ['last day of this month', '+1 day', 'midnight', '-1 second'];
        $resolvedModify = empty($modify) ? $defaultModify : array_merge($defaultModify, $modify);
        return static::getTimestamp(
            value: $value,
            modify: $resolvedModify,
            withoutTimeZone: true,
        );
    }

    public static function startOfMonth(string $value, array $modify = []): ?string {
        $defaultModify = ['midnight', 'first day of this month'];
        $resolvedModify = empty($modify) ? $defaultModify : array_merge($defaultModify, $modify);
        return static::getTimestamp(
            value: $value,
            modify: $resolvedModify,
            withoutTimeZone: true,
        );
    }

    public static function ageInWords(?string $birthDate): ?string {
        if (!$birthDate) {
            return null;
        }
        $birthDateDateTime = new DateTime($birthDate);
        $now = new DateTime;
        $diff = $now->diff($birthDateDateTime);

        $years = $diff->y;
        $months = $diff->m;
        $days = $diff->d;

        $yearsDesc = '';
        $monthsDesc = '';
        $daysDesc = '';

        if ($years) {
            $singular = $years . ' ' . __('flag.fragmentAgeDescYear');
            $plural = $years . ' ' . __('flag.fragmentAgeDescYears');
            $yearsDesc = $years === 1 ? $singular : $plural;
        }

        if ($years) {
            $singular = $months . ' ' . __('flag.fragmentAgeDescMonth');
            $plural = $months . ' ' . __('flag.fragmentAgeDescMonths');
            $monthsDesc = $months === 1 ? $singular : $plural;
        }

        if ($years) {
            $singular = $days . ' ' . __('flag.fragmentAgeDescDay');
            $plural = $days . ' ' . __('flag.fragmentAgeDescDays');
            $daysDesc = $days === 1 ? $singular : $plural;
        }

        if ($yearsDesc) {
            $ageDesc = $yearsDesc;
            $ageDesc .= $monthsDesc ? ' e ' : '';
            $ageDesc .= $monthsDesc;
        } else {
            $ageDesc = $monthsDesc;
            $ageDesc .= $monthsDesc && $daysDesc ? ' e ' : '';
            $ageDesc .= $daysDesc;
        }

        return $ageDesc;
    }
}
