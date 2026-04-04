<?php

namespace App\Console\Custom;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EnumHelper
{
    private static function getAppNamespaceNames(): array {
        $rii = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator(base_path() . '/app/Enums'));
        $namespaceModelNames = [];
        /** @var \SplFileInfo $file */
        foreach ($rii as $file) {
            if ($file->isDir()) {
                continue;
            }
            // resolve o nome do model com namespace \App\Models\extension\NewsletterSubscriber
            $namespaceModelNames[] = str_replace([base_path() . '/app/', '/', '.php'], ['/App/', '\\', ''], $file->getPathname());
        }
        return $namespaceModelNames;
    }

    private static function getAppFileConstants($enum): array {
        $constants = [];
        foreach ($enum::cases() as $case) {
            $constants[$case->name] = $case->value;
        }
        return $constants;
    }

    public static function getAppConstants(): array {
        $namespaceNames = static::getAppNamespaceNames();
        $constants = [];
        foreach ($namespaceNames as $namespaceName) {
            try {
                $constants[new \ReflectionClass($namespaceName)->getShortName()] = static::getAppFileConstants($namespaceName);
            } catch (\Exception $e) {
                // plog($namespaceName);
            }
        }
        return $constants;
    }

    public static function getDbNamesAndOptions(array $intlNameCols): array {
        $names = [];
        $options = [];
        $sqlVar1 = implode(', ', $intlNameCols);
        $sqlTableName = Schema::hasTable('public.type') ? 'public.type' : 'misc.type';
        try {
            $sql = <<<SQL
                SELECT type_code
                     , $sqlVar1
                     , F_CI(type_name) AS type_name_ci
                     , type_flag
                  FROM $sqlTableName
                 ORDER BY type_flag, type_orde, type_name_ci
            SQL;
            $rows = DB::select($sql);
            foreach ($rows as $reg) {
                $id = $reg->type_code;
                $flag = $reg->type_flag;
                foreach ($intlNameCols as $lang => $columnName) {
                    $label = $reg->$columnName;
                    $names[$lang][$flag][$id] = $label;
                    $options[$lang][$flag][] = ['id' => $id, 'label' => $label];
                }
            }
        } catch (\Exception $e) {
            echo $e->getMessage();
        }
        return ['names' => $names, 'options' => $options];
    }

    public static function getDbConstants(): array {
        $sqlTableName = Schema::hasTable('public.type') ? 'public.type' : 'misc.type';
        $constants = [];
        try {
            $sql = <<<SQL
                SELECT type_code
                     , type_flag
                     , type_cons
                  FROM $sqlTableName
            SQL;
            $rows = DB::select($sql);
            foreach ($rows as $reg) {
                $constants[$reg->type_flag][$reg->type_cons] = $reg->type_code;
            }
        } catch (\Exception $e) {
            echo $e->getMessage();
        }
        return $constants;
    }
}
