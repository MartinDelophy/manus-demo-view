import subprocess

def execute_command(command, call_back):
    try:
        # 创建子进程，将标准输出重定向到管道，设置以文本模式读取
        process = subprocess.Popen(command, stdout=subprocess.PIPE, universal_newlines=True)
        strip_output = ''
        # 循环读取子进程的输出并打印
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                strip_output += output.strip() + '\n'
                # print(output.strip())
                call_back(strip_output)

        # 获取子进程的返回码
        returncode = process.poll()
        if returncode != 0:
            # 如果返回码非零，抛出 CalledProcessError 异常
            raise subprocess.CalledProcessError(returncode, command, output=strip_output)
        return returncode
    except FileNotFoundError:
        print(f"Error: The command {command[0]} was not found.")
    except PermissionError:
        print(f"Error: You do not have permission to execute {command[0]}.")
    except subprocess.CalledProcessError as e:
        print(f"Error: Command {e.cmd} failed with return code {e.returncode}. Output: {e.output}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        
def report(command):
    print(command)

        
execute_command(["pip", "install", "requests"], report)