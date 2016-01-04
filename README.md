AJAIBWEBSITE
============
Repository for Ajaib website and admin panel

## Installation

1. Download [Composer](http://getcomposer.org/doc/00-intro.md) or update `composer self-update`.
2. Run `php composer.phar create-project --prefer-dist laravel/laravel [app_name]`.

If Composer is installed globally, run
```bash
composer create-project --prefer-dist laravel/laravel [app_name]
```

You should now be able to visit the path to where you installed the app and see
the setup traffic lights.

## Configuration

Read and edit `config/app.php` and setup the 'Connection' on `config/database.php` and any other
configuration relevant for your application. And don't forget to update your .env file on root directory


### SET PERMISSION USING ACL

Perform action bellow to grant http user to folders

```bash
$ HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1 | sed -e 's/:/\t/g' | awk '{print $NF}'`

sudo setfacl -R -m u:${HTTPDUSER}:rwx storage
sudo setfacl -R -d -m u:${HTTPDUSER}:rwx storage
sudo setfacl -R -m u:${HTTPDUSER}:rwx bootstrap/cache
sudo setfacl -R -d -m u:${HTTPDUSER}:rwx bootstrap/cache
```

## HOW TO COMMIT - IAMUCIL

Phase 1

1. Fork the project
2. Once it done, clone your forked project
   1. `mkdir project_name`
   2. `cd project_name`
   3. `git init`
   4. Do `git remote add <alias> <URL-git-project>`
3. You've done the initial step (phase 1).

To do phase 2, do the following steps, right before you commit the changes

1. Do `git add .`
2. Do `git commit -am "some message"`
3. Run `git fetch <alias>` (the one you defined in phase 1, step 3)
4. Do `git rebase <alias>/<branch_name>`. The branch name default is usually `master`.
5. Do `git push`

Then do phase 3. Do pull request thru' web interface.

## HOW TO INSTALL AFTER CLONING IN LOCAL

After finishing cloning from github repo into local machine (phase 1, step 2)

1. Do ``git fetch <alias> <branch_name>``. The branch name default is usually `master`.
2. Do ``git pull <alias> <branch_name>``
3. Do ``composer install``
4. rename ``.env.example`` to ``.env`` on root directory. [More detail](http://laravel.com/docs/5.1/installation#environment-configuration) read the documentation [here](http://laravel.com/docs/5.1/installation#environment-configuration)
5. Set connection database in ``config/database.php``
6. Make sure ``resources`` and ``bootstrap/cache`` are writeable
7. Do ``php artisan key:generate`` to generate key automatically
8. Run your app in your machine

## PACKAGES

1. ``composer require zizaco/entrust``
2. ``composer require artem-schander/l5-modular``
   1. ``composer update``
   2. load package l5-modular into service providers on ``APP/config/app.php`` add ``ArtemSchander\L5Modular\ModuleServiceProvider::class,`` in ``providers`` section
   3. The built in Artisan command ``php artisan make:module name [--no-migration] [--no-translation]`` generates a ready to use module in the ``app/Modules`` folder and a migration if necessary.
   4. name is camel cased word

## USING SSL

1. Install OpenSSL or other ssl service on the web server
2. Set APP_ENV in .env file into APP_ENV=local or APP_ENV=release or other name for using SSL
3. Set APP_ENV in .env file into APP_ENV=devel for developing mode (no SSL)

## Flash Message

1. ``composer require laracasts/flash``
2. do ``composer update`` or ``composer install`` if neccessary
3. edit your ``config/app.php``
   1. in ``providers`` sections add: ``Laracasts\Flash\FlashServiceProvider::class,``
   2. and ``'Flash'     => Laracasts\Flash\Flash::class,`` in ``aliases`` section
   3. Sample using flash message :
      ```php
      public function store (Request $request) {
         $task    = new Task($request->all());
         Task::create($task);
         flash('Your data has been created');
         // flash()->success('Your data has been created');
         // overlay message
         // flash()->overlay('message', 'title');
         return redirect('/task');
      }

      // in view include flash_message template
      @include('flash::message')
      ```

## OAUTH2.0

1. Grant Access ``https://getajaib.co/api/v1/oauth/grant_access``
   * set header ``Content-Type : application/json``
   * set method to ``POST``
   * set body to raw json format if using 3rd party like postman chrome extension, with bellow parameter
   ```
   {
      "id":"YOUR_CLIENT_ID",
      "secret":"YOUR_CLIENT_SECRET",
      "code":"VERIFICATION_CODE_FROM_REGISTRATION FORM"
   }
   ```
   * result
   ```
   {
      "access_token": "ACCESS_TOKEN",
      "refresh_token": "REFRESH_TOKEN",
      "email": "USER_EMAIL",
      "phone_number": "USER_PHONE_NUMBER",
      "expires": 36288000
   }
   ```
2. Refresh Token ``https://getajaib.co/api/v1/oauth/access_token`` this API used to get new access token
   * uri : ``https://getajaib.co/api/v1/oauth/access_token``
   * set body using x-www-from-urlencoded if using 3rd party like postman chrome extension, with bellow parameter
   ```
   grant_type     : refresh_token
   client_id      : YOUR_CLIENT_ID
   client_secret  : YOUR_CLIENT_SECRET
   refresh_token  : REFRESH_TOKEN from previous action
   ```