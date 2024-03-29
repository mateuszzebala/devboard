import platform
from django.urls import path, re_path
from django.http import JsonResponse
from .auth import devboard_access
import subprocess
from pathlib import Path
from .utils.runner import Runner
import os
from django.conf import settings
from devboard.configuration.settings import SETTINGS
from channels.generic.websocket import AsyncWebsocketConsumer
from queue import Empty
import threading
import asyncio
import time

processes = {}

@devboard_access
def kill_process(request):
    if processes.get(request.user.id) is not None:
        for process in processes[request.user.id]:
            try:
                process.terminate()
                process.kill()
            except:
                return JsonResponse({'done':False})
    return JsonResponse({'done':True})

@devboard_access
def command(request):
    path = request.POST.get('path')
    path_splitted = request.POST.get('path').split(os.sep)
    cmd = request.POST.get('command')
    interpreter = SETTINGS.get('terminal.sh_type')

    if interpreter == 'cmd':
        interpreter = 'C:\\Windows\\System32\\cmd.exe'

    process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=path, executable=interpreter)
    
    if processes.get(request.user.id) is None:
        processes[request.user.id] = []
    processes[request.user.id].append(process)
    output, errors = process.communicate()
    processes[request.user.id].remove(process)
    request.session.save()

    if cmd.startswith('cd ') and len(errors) == 0:
        folder = cmd[3:]
        if folder == '..':
            slesh_position = path.rfind(os.sep)
            path = path[:slesh_position]
        else:
            path = os.path.join(path, folder)

    return JsonResponse({
        'output': output.decode(),
        'errors': errors.decode(),
        'path': path,
        'folder_content': os.listdir(path)
    })


@devboard_access
def init_terminal(request):
    path = request.POST.get('path') if request.POST.get('path') != 'null' else Path.home() 
    return JsonResponse({
        'root': str(os.path.abspath(os.sep)),
        'path': str(path),
        'home': str(Path.home()),
        'project': str(settings.BASE_DIR),
        'folder_content': os.listdir(path),
        'os': platform.system(),
    })
    
urlpatterns = [
    path('init/', init_terminal), # GET USER PATH
    path('command/', command), # COMMAND FOR TERMINAL
    path('kill/', kill_process), # KILL ALL PROCESSES
]


# -- WEBSOCKET --


def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t

class TerminalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        shell = SETTINGS.get('terminal.sh_type')
        rc_file_path = SETTINGS.get('terminal.rc_file')
        
        if shell == 'bash':
            self.runner = Runner('bash', ['--init-file', rc_file_path], 0.1)
        else:
            self.runner = Runner(shell, ['-i'], 0.1)
        self.runner.start()

        # if rc_file_path:
        #     self.runner.run_command(f"source {rc_file_path}\n".encode())
        # self.runner.run_command("clear\n".encode())
            
        await self.accept()
        await self.send_output()
        set_interval(lambda: asyncio.run(self.send_output()), 0.01)

    async def disconnect(self, close_code):
        try:
            self.runner.proc.kill()
        except:
            ...

    async def receive(self, text_data):
        if text_data:
            #await self.send(text_data=text_data)
            self.runner.run_command(text_data.encode())
        
    async def send_output(self):
        while True:
            stdout = b''
            while True:
                try: 
                    stdout += self.runner.lineQueue.get_nowait()
                except Empty:
                    break

            if stdout == b'': break

            if stdout != b'':
                await self.send(bytes_data=stdout)
                await self.send_output()

