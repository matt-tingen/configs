import random
import socket
import sys

lo, hi = int(sys.argv[1]), int(sys.argv[2])
if lo >= hi:
    raise ValueError("min must be less than max")

ports = list(range(lo, hi))
random.shuffle(ports)
for p in ports:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.bind(("127.0.0.1", p))
        s.close()
        print(p)
        sys.exit(0)
    except OSError:
        s.close()

print("no free port in range", file=sys.stderr)
sys.exit(1)
