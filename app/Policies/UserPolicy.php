<?php

namespace App\Policies;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
// use Illuminate\Support\Facades\Auth;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if current logged user has appropiate role
     * @param  User   $user [description]
     * @return void
     */
    public function destroy(User $user)
    {
        return $user->hasRole(['admin', 'root']);
    }

    public function setStatus(User $user)
    {
        return $user->hasRole(['admin', 'root']);
    }

    public function showProfile(User $user)
    {
        return $user->hasRole('admin', 'root') OR $user->id === auth()->user()->id;
    }
}
