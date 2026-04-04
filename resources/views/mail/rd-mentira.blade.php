<?php
    $rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>{{$subject}}</title>
</head>
  <body>
    Olá,
    <br /><br />
    Responda
    <br /><br />
    <table style="border-collapse: collapse">
        <tr>
            @foreach ($rows as $value)
                <td style="background-color: red; text-align: center; border: solid 1px white">
                    <a
                        style="color: white; text-decoration: none; display: block; width: 32px; line-height: 32px"
                        href="{{$link}}?v={{$value}}"
                        target="_blank"
                    >
                        {{ $value }}
                    </a>
                </td>
            @endforeach
        </tr>
    </table>
    <br /><br />
    Atenciosamente,<br />
    {{ config('mail.from.name') }}
  </body>
</html>
