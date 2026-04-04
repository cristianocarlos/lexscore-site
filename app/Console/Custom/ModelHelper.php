<?php

namespace App\Console\Custom;

use Illuminate\Database\Eloquent\Model;

class ModelHelper
{
    private static function getNamespaceNames(): array {
        $rii = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator(base_path() . '/app/Models'));
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

    public static function getNamesData(): array {
        $namespaceModelNames = static::getNamespaceNames();
        $byModelSafeAttributes = [];
        foreach ($namespaceModelNames as $namespaceModelName) {
            try {
                $reflectionClass = new \ReflectionClass($namespaceModelName);
                $modelName = $reflectionClass->getShortName();
                // if ($modelName !== 'NewsletterSubscriber') continue;
                /** @var Model $model */
                $model = $reflectionClass->newInstanceWithoutConstructor();
                $byModelSafeAttributes[$modelName] = array_merge($model->getFillable(), $model->getAppends());
            } catch (\Exception $e) {
                // plog($namespaceModelName);
            }
        }
        $modelNames = [];
        $modelAttributeNames = [];
        foreach ($byModelSafeAttributes as $modelName => $modelAttributes) {
            $modelNames[] = $modelName;
            foreach ($modelAttributes as $attributeName) {
                $modelAttributeNames[] = $modelName . '.' . $attributeName;
            }
        }
        sort($modelNames);
        sort($modelAttributeNames);
        return [
            'modelAllNames' => array_values(array_merge($modelNames, $modelAttributeNames)),
            'modelAttributeNames' => array_values($modelAttributeNames),
            'modelNames' => array_values($modelNames),
        ]; // Ao remover duplicidades o índice muda, então precisa do array_values
    }
}
