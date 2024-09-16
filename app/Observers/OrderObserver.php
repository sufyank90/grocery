<?php

namespace App\Observers;
use App\Models\Order;
use App\Models\User;
use App\Models\Setting;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function created(Order $order)
    {
        //
    }

    /**
     * Handle the Order "updated" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function updated(Order $order)
    {
        // Fetch the reward points from settings where id is 5
        $setting = Setting::find(5);

        // Check if the setting exists
        if (!$setting) {
            return; // Exit if the setting is not found
        }

        $rewardPoints = (int) $setting->value; // Ensure value is treated as integer

        // Check if the status has been updated and if it is now 'completed'
        if ($order->isDirty('status') && $order->status == 'completed') {
            // Get the user associated with the order
            $user = User::find($order->user_id);

            // Check if the user exists
            if ($user) {
                $user->earn_rewards += $rewardPoints;
                $user->save();
            }
        }

        // Check if the status has been updated and if it is now 'cancelled'
        if ($order->isDirty('status') && $order->status == 'cancelled') {
            $user = User::find($order->user_id);

            // Check if the user exists and has enough earn_rewards
            if ($user && $user->earn_rewards != null && $user->earn_rewards >= $rewardPoints) {
                $user->earn_rewards -= $rewardPoints;
                $user->save();
            }
        }
    }

    /**
     * Handle the Order "deleted" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function deleted(Order $order)
    {
        //
    }

    /**
     * Handle the Order "restored" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function restored(Order $order)
    {
        //
    }

    /**
     * Handle the Order "force deleted" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function forceDeleted(Order $order)
    {
        //
    }
}
