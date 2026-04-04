<?php

namespace App\Custom;

class SqlIntlHelper
{
    public static function resolveJsonCol(string $jsonCol, string $nameCol): string {
        return match (app()->getLocale()) {
            'en' => 'COALESCE(' . $jsonCol . "_en->>'" . $nameCol . "', " . $nameCol . ')',
            'es' => 'COALESCE(' . $jsonCol . "_es->>'" . $nameCol . "', " . $nameCol . ')',
            default => $nameCol,
        };
    }

    public static function resolveNameCol(string $value): string {
        return match (app()->getLocale()) {
            'en' => $value . '_en',
            'es' => $value . '_es',
            default => $value,
        };
    }

    /**
     * @return object{'intlHatCol': string, 'intlSummaryCol': string, 'intlTitleCol': string}
     */
    /**
     * @property string $intlHatCol
     * @property-read string $intlSummaryCol
     * @property-read string $intlSummaryCol
     */
    public static function resolveEntryCols(): \stdClass {
        switch (app()->getLocale()) {
            case 'en':
                $intlHatCol = "COALESCE(entr_intl_en->>'entr_hat', entr_hat)";
                $intlSummaryCol = "COALESCE(entr_intl_en->>'entr_summ', entr_summ)";
                $intlTitleCol = "COALESCE(entr_intl_en->>'entr_titl', entr_titl)";
                break;
            case 'es':
                $intlHatCol = "COALESCE(entr_intl_es->>'entr_hat', entr_hat)";
                $intlSummaryCol = "COALESCE(entr_intl_es->>'entr_summ', entr_summ)";
                $intlTitleCol = "COALESCE(entr_intl_es->>'entr_titl', entr_titl)";
                break;
            default:
                $intlHatCol = 'entr_hat';
                $intlSummaryCol = 'entr_summ';
                $intlTitleCol = 'entr_titl';
        }
        return literal(
            intlHatCol: $intlHatCol,
            intlSummaryCol: $intlSummaryCol,
            intlTitleCol: $intlTitleCol,
        );
    }

    public static function resolvePublicationEditionDetailsCol(): string {
        return match (app()->getLocale()) {
            'en' => 'pued_deta_en_data',
            'es' => 'pued_deta_es_data',
            default => 'pued_deta_data',
        };
    }
}
