@if (count($errors) > 0)
<!-- notification -->
<div class="row">
    <div class="col-md-12">
        <div class="alert alert-success alert-dismissable">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            <strong>Success!</strong>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </div>
    </div>
</div>
<!-- end of notification -->
@endif