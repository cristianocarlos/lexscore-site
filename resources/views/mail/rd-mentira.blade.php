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
    <a href="{{$link}}" class="block bg-amber-300" target="_blank">
        Responda
    </a>
    <br /><br />
    Atenciosamente,<br />
    {{ config('mail.from.name') }}
  </body>
</html>
