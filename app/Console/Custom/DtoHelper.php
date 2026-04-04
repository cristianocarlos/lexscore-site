<?php

namespace App\Console\Custom;

class DtoHelper
{
    private static function getNamespaceNames(): array {
        $rii = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator(base_path() . '/app/DTOs'));
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

    public static function resolveTypeName(string $typeName, ?string $docComment = null): string {
        if ($docComment) {
            return trim(str_replace(
                ['/**', '*/', '@var', '|null', '`', 'array<'],
                ['', '', '', '', '', 'Array<T'],
                $docComment,
            ));
        } elseif (str_ends_with($typeName, 'DTO')) {
            $reflectionClass = new \ReflectionClass($typeName);
            return "T{$reflectionClass->getShortName()}";
        }
        return match ($typeName) {
            'int' => 'number',
            'bool' => 'boolean',
            default => $typeName,
        };
    }

    public static function getRawTypes(): array {
        $namespaceNames = static::getNamespaceNames();
        $byDtoProperties = [];
        foreach ($namespaceNames as $namespaceName) {
            try {
                $resolvedProperties = [];
                $reflectionClass = new \ReflectionClass($namespaceName);
                $properties = $reflectionClass->getProperties();
                foreach ($properties as $property) {
                    $propertyType = $property->getType();
                    $tsProperty = $property->getName();
                    $tsProperty .= $propertyType->allowsNull() ? '?: ' : ': ';
                    $tsProperty .= static::resolveTypeName($propertyType->getName(), $property->getDocComment());
                    $resolvedProperties[] = $tsProperty;
                }
                $baseTypeName = static::resolveTypeName($namespaceName);
                $byDtoProperties[$baseTypeName] = $resolvedProperties;
            } catch (\Exception $e) {
                // plog($namespaceName);
            }
        }
        return $byDtoProperties;
    }
}
