<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
//Role
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $roles = Role::latest()->paginate(10);
        return Inertia::render('role/List',compact('roles'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
         $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles,name',
            'guard_name' => 'required',
         ]);

        if ($validator->fails()) {
            return session()->flash('error', $validator->errors()->first());
        }
        $role = Role::create($request->all());

        return session()->flash('message', 'Role created successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $role = Role::findOrFail($id);

        $permissions = $role->permissions->pluck('name')->toArray();

        $permissionsList = Permission::pluck('name')->toArray();

        return Inertia::render('role/View', compact('role', 'permissions','permissionsList'));
        
    }

    public function updatePermission(Request $request, $id)
    {
       $permissions = $request->all();

       $role = Role::find($id)->syncPermissions($permissions);

       return session()->flash('message', 'Permissions updated successfully');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles,name,'.$id,
            'guard_name' => 'required',
         ]);

        if ($validator->fails()) {
            return session()->flash('error', $validator->errors()->first());
        }
        $role = Role::find($id)->update($request->all());

        return session()->flash('message', 'Role updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Role::find($id)->delete();
    }
}
