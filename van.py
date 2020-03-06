import pyvan 

OPTIONS = {
    "main_file_name": "app.py", 
    "show_console": True,
    "use_pipreqs": True,
    'install_only_these_modules':[],
    "exclude_modules":[],
    "include_modules":['.\\combine.py','.\\search.py','.\\update.py'],
    "path_to_get_pip_and_python_embeded_zip": ""
}

pyvan.build(OPTIONS)