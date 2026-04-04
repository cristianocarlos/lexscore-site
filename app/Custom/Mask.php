<?php

namespace App\Custom;

use Carbon\Carbon;

class Mask
{
    public static function cnpj(?string $value): ?string {
        if (!is_numeric($value)) return $value;
        $value = str_pad($value, 14, '0', STR_PAD_LEFT);
        return preg_replace('/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/', '$1.$2.$3/$4-$5', $value);
    }

    public static function cpf(?string $value): ?string {
        if (!is_numeric($value)) return $value;
        $value = str_pad($value, 11, '0', STR_PAD_LEFT);
        return preg_replace('/(\d{3})(\d{3})(\d{3})(\d{2})/', '$1.$2.$3-$4', $value);
    }

    public static function currency(?string $value): ?string {
        if (!is_numeric($value)) return $value;
        return number_format($value, 2, ',', '.'); // pt_br
    }

    // Number::currency($value, in: 'BRL', locale: 'pt_BR')
    public static function float(?string $value): ?string {
        if (!is_numeric($value)) return $value;
        return str_replace('.', ',', (string) $value); // pt_br
    }

    public static function integer(?string $value): ?string {
        if (!is_numeric($value)) return $value;
        return number_format($value, 0, '', '.'); // pt_br
    }

    public static function phoneNumber(?string $value): ?string {
        if (!is_numeric($value)) return $value;
        $resolvedValue = (string) $value;
        if (mb_strlen($resolvedValue) == 10) {
            return mb_substr($resolvedValue, 0, 2)
              . ' ' . mb_substr($resolvedValue, 2, 4)
              . '-' . mb_substr($resolvedValue, 6, 4);
        } elseif (mb_strlen($resolvedValue) == 11) {
            return mb_substr($resolvedValue, 0, 2)
              . ' ' . mb_substr($resolvedValue, 2, 5)
              . '-' . mb_substr($resolvedValue, 7, 4);
        } elseif (mb_strlen($resolvedValue) == 12) {
            return '+' . mb_substr($resolvedValue, 0, 2)
              . ' ' . mb_substr($resolvedValue, 2, 2)
              . ' ' . mb_substr($resolvedValue, 4, 4)
              . '-' . mb_substr($resolvedValue, 8, 4);
        } elseif (mb_strlen($resolvedValue) == 13) {
            return '+' . mb_substr($resolvedValue, 0, 2)
              . ' ' . mb_substr($resolvedValue, 2, 2)
              . ' ' . mb_substr($resolvedValue, 4, 5)
              . '-' . mb_substr($resolvedValue, 9, 4);
        }
        return $resolvedValue; // pt_br
    }

    public static function zipCode(?string $value): ?string {
        if (!is_numeric($value)) return $value;
        $value = str_pad($value, 8, '0', STR_PAD_LEFT);
        return mb_substr($value, 0, 5) . '-' . mb_substr($value, 5, 3); // pt_br
    }

    public static function date(?string $value): ?string {
        return Carbon::parse($value)->format('d/m/Y');
    }

    public static function dateHour(?string $value): ?string {
        return Carbon::parse($value)->format('d/m/Y H:i');
    }
}
